import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { NgxIndexedDBService } from 'ngx-indexed-db';
import { Observable, catchError, concatMap, forkJoin, map, mergeMap, of, tap } from 'rxjs';
import { getDefaultSettings } from '../../core/constant';
import { setCommonSettingsConfig, setFiltersConfig } from '../../store/settings/settings.actions';
import { setWordsList, updateCurrentWordItem } from '../../store/words/words.actions';
import {
  CommonSettingsConfig,
  FiltersConfig,
  Settings,
  WholeIndexDBConfig,
  WordsItem,
} from '../../types';
import { YouDaoHttpService } from '../you-dao-http.service';

@Injectable({
  providedIn: 'root',
})
export class DbService {
  private store = inject(Store);

  constructor(
    private dbService: NgxIndexedDBService,
    private youDaoHttp: YouDaoHttpService,
    private http: HttpClient,
  ) {}

  addWordsToIndexDBByInput(words: string): Observable<any> {
    if (!words) return of(null);
    const newWords = words.trim().split('\n');
    const wordsToAdd: WordsItem[] = newWords.map((word) => {
      return {
        word,
        created_timestamp: 0,
        mispronounce: false,
      };
    });
    const fetchWordsInformation$ = wordsToAdd.map((w) => {
      return this.youDaoHttp.getYouDaoWordItemByHttp(w.word);
    });
    return forkJoin(fetchWordsInformation$).pipe(
      map((res) => {
        if (res?.length > 0) {
          const wordsRes = [...res];
          wordsRes.forEach((w: WordsItem) => {
            w.examples = [{ zh: w['example_zh'], en: w['example'] }];
            w.mispronounce = false;
            w.total_count = 0;
            w.right_count = 0;
            w.created_timestamp = new Date().getTime();
            w.type = w.word.includes(' ') ? 'PHRASE' : 'WORD';
          });
          return wordsRes as WordsItem[];
        }
        return [];
      }),
      concatMap((res) => this.insertWordsToIndexDB$(res)),
    );
  }

  addWordsToIndexDBByJSONFile(jsonFileContent: WholeIndexDBConfig, setToStore?: boolean): void {
    const { settings, words } = jsonFileContent;
    this.dbService
      .clear('words')
      .pipe(
        concatMap(() => this.dbService.bulkAdd('words', words)),
        concatMap(() => this.dbService.clear('settings')),
        concatMap(() => (settings ? this.dbService.add('settings', settings) : of(null))),
      )
      .subscribe(() => {
        if (setToStore) {
          this.store.dispatch(setCommonSettingsConfig({ commonSettings: settings.commonSettings }));
          this.store.dispatch(setFiltersConfig({ filters: settings.filters }));
          this.store.dispatch(setWordsList({ words }));
        }
      });
  }

  getAllWordsFromIndexDB(
    setToStore?: boolean,
    clearSpellingCount?: boolean,
  ): Observable<WordsItem[]> {
    return this.dbService.getAll<WordsItem>('words').pipe(
      map((res) => {
        return res.map((item) => {
          item.type = item.type || 'WORD'; // default type is 'WORD'.
          item.total_count = clearSpellingCount ? 0 : item.total_count;
          item.right_count = clearSpellingCount ? 0 : item.right_count;
          item.right_rate =
            item.total_count === 0 ? '0' : ((item.right_count / item.total_count) * 100).toFixed(2);
          return item;
        });
      }),
      tap((res) => {
        if (setToStore) {
          this.store.dispatch(setWordsList({ words: res }));
        }
      }),
    );
  }

  getAllWordsCountFromIndexDB(): Observable<number> {
    return this.dbService.count('words').pipe(catchError(() => of(0)));
  }

  removeWordsFromIndexDB(wordsIds: number[]): Observable<number[]> {
    return this.dbService.bulkDelete('words', wordsIds);
  }

  updateWordItemFromIndexDB(word: WordsItem, setToStore?: boolean): Observable<WordsItem> {
    return this.dbService.update<WordsItem>('words', { ...word }).pipe(
      tap(() => {
        if (setToStore) {
          this.store.dispatch(updateCurrentWordItem({ word }));
        }
      }),
    );
  }

  getWordItemFromIndexDBById(id: number): Observable<WordsItem> {
    return this.dbService.getByID<WordsItem>('words', id);
  }

  updateWordSpellingCountToIndexDB(w: WordsItem, { right_count, total_count }): void {
    this.dbService
      .update<WordsItem>('words', {
        ...w,
        right_count,
        total_count,
      })
      .subscribe(() => {});
  }

  bulkClearSpellingCountToIndexDB(): Observable<any> {
    return this.getAllWordsFromIndexDB(false, true).pipe(
      mergeMap((words) => this.dbService.bulkPut<WordsItem>('words', words)),
    );
  }

  getSettingConfigsFromIndexDB(allWordsLen: number, setToStore?: boolean): Observable<Settings> {
    const { commonSettings: _defaultCommonSetting, filters: _defaultFilterSetting } =
      getDefaultSettings(allWordsLen);
    return this.dbService.getAll<Settings>('settings').pipe(
      map((res) => ({
        commonSettings: (res?.length > 0 && res[0]?.commonSettings) || _defaultCommonSetting,
        filters: (res?.length > 0 && res[0]?.filters) || _defaultFilterSetting,
      })),
      tap(({ commonSettings, filters }) => {
        if (setToStore) {
          this.store.dispatch(setCommonSettingsConfig({ commonSettings }));
          this.store.dispatch(setFiltersConfig({ filters }));
        }
      }),
    );
  }

  updateCommonSettingConfigsToIndexDB(commonSettings: CommonSettingsConfig): Observable<Settings> {
    return this.dbService.getAll<Settings>('settings').pipe(
      mergeMap((settings: Settings[]) =>
        this.dbService.update<Settings>('settings', {
          ...settings[0],
          id: 1,
          commonSettings,
        }),
      ),
    );
  }

  updateFiltersConfigsToIndexDB(filters: FiltersConfig): Observable<Settings> {
    return this.dbService.getAll<Settings>('settings').pipe(
      mergeMap((settings: Settings[]) =>
        this.dbService.update<Settings>('settings', {
          ...settings[0],
          id: 1,
          filters,
        }),
      ),
    );
  }

  private insertWordsToIndexDB$(ws: WordsItem[]): Observable<WordsItem[]> {
    const setToIndexDB$ = ws.map((w) => this.dbService.add('words', w));
    return forkJoin(setToIndexDB$);
  }
}
