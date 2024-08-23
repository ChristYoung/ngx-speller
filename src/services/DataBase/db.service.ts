import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { NgxIndexedDBService } from 'ngx-indexed-db';
import {
  Observable,
  catchError,
  concatMap,
  forkJoin,
  map,
  mergeMap,
  of,
  tap,
} from 'rxjs';
import {
  DEFAULT_FILTER_LESS_THAN
} from '../../core/constant';
import {
  setCommonSettingsConfig,
  setFiltersConfig,
} from '../../store/settings/settings.actions';
import {
  setWordsList,
  updateCurrentWordItem,
} from '../../store/words/words.actions';
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
    private http: HttpClient
  ) {}

  addWordsToIndexDBByInput(words: string): Observable<any> {
    if (!words) return of(null);
    const newWords = words.trim().split('\n');
    const wordsToAdd: WordsItem[] = newWords.map((word) => {
      return {
        word,
        created_timestamp: 0,
        familiar: false,
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
            w.familiar = false;
            w.total_count = 0;
            w.right_count = 0;
            w.created_timestamp = new Date().getTime();
          });
          return wordsRes as WordsItem[];
        }
        return [];
      }),
      concatMap((res) => this.insertWordsToIndexDB$(res))
    );
  }

  addWordsToIndexDBByJSONFile(
    jsonFileContent: WholeIndexDBConfig,
    setToStore?: boolean
  ): void {
    const { settings, words } = jsonFileContent;
    this.dbService
      .clear('words')
      .pipe(
        concatMap(() => this.dbService.bulkAdd('words', words)),
        concatMap(() => this.dbService.clear('settings')),
        concatMap(() =>
          settings ? this.dbService.add('settings', settings) : of(null)
        )
      )
      .subscribe(() => {
        if (setToStore) {
          this.store.dispatch(
            setCommonSettingsConfig({ commonSettings: settings.commonSettings })
          );
          this.store.dispatch(setFiltersConfig({ filters: settings.filters }));
          this.store.dispatch(setWordsList({ words }));
        }
      });
  }

  getAllWordsFromIndexDB(setToStore?: boolean, clearSpellingCount?: boolean): Observable<WordsItem[]> {
    return this.dbService.getAll<WordsItem>('words').pipe(
      map((res) => {
        return res.map((item) => {
          item.total_count = clearSpellingCount ? 0 : item.total_count;
          item.right_count = clearSpellingCount ? 0 : item.right_count;
          item.right_rate =
            item.total_count === 0
              ? '0'
              : ((item.right_count / item.total_count) * 100).toFixed(2);
          return item;
        });
      }),
      tap((res) => {
        if (setToStore) {
          this.store.dispatch(setWordsList({ words: res }));
        }
      })
    );
  }

  getAllWordsCountFromIndexDB(): Observable<number> {
    return this.dbService.count('words').pipe(catchError(() => of(0)));
  }

  removeWordsFromIndexDB(wordsIds: number[]): Observable<number[]> {
    return this.dbService.bulkDelete('words', wordsIds);
  }

  updateWordItemFromIndexDB(
    word: WordsItem,
    setToStore?: boolean
  ): Observable<WordsItem> {
    return this.dbService.update<WordsItem>('words', { ...word }).pipe(
      tap(() => {
        if (setToStore) {
          this.store.dispatch(updateCurrentWordItem({ word }));
        }
      })
    );
  }

  getWordItemFromIndexDBById(id: number): Observable<WordsItem> {
    return this.dbService.getByID<WordsItem>('words', id);
  }

  updateWordSpellingCountToIndexDB(
    w: WordsItem,
    { right_count, total_count },
    setToStore?: boolean
  ): void {
    this.dbService
      .update<WordsItem>('words', {
        ...w,
        right_count,
        total_count,
      })
      .subscribe(() => {});
  }

  bulkClearSpellingCountToIndexDB(): Observable<any> {
    return this.getAllWordsFromIndexDB(false, true)
    .pipe(
      mergeMap((words) => this.dbService.bulkPut<WordsItem>('words', words)))
  }

  getSettingConfigsFromIndexDB(
    allWordsLen: number,
    setToStore?: boolean
  ): Observable<Settings> {
    const _defaultSettings: Settings = {
      commonSettings: {
        mode: 'SPELLING',
        showExamples: true,
        showPhonetic: true,
        showExplanation: true,
        showHorn: true,
      },
      filters: {
        familiarType: 'ALL',
        pickRange: [0, allWordsLen],
        randomOrder: false,
        lessThanRate: 1,
        lessThanCount: DEFAULT_FILTER_LESS_THAN,
      },
    };
    return this.dbService.getAll<Settings>('settings').pipe(
      map((res) => res[0] || _defaultSettings),
      tap((res) => {
        if (setToStore) {
          this.store.dispatch(
            setCommonSettingsConfig({ commonSettings: res.commonSettings })
          );
          this.store.dispatch(setFiltersConfig({ filters: res.filters }));
        }
      })
    );
  }

  updateCommonSettingConfigsToIndexDB(
    commonSettings: CommonSettingsConfig
  ): Observable<Settings> {
    return this.dbService.getAll<Settings>('settings').pipe(
      mergeMap((settings: Settings[]) =>
        this.dbService.update<Settings>('settings', {
          ...settings[0],
          id: 1,
          commonSettings,
        })
      )
    );
  }

  updateFiltersConfigsToIndexDB(filters: FiltersConfig): Observable<Settings> {
    return this.dbService.getAll<Settings>('settings').pipe(
      mergeMap((settings: Settings[]) =>
        this.dbService.update<Settings>('settings', {
          ...settings[0],
          id: 1,
          filters,
        })
      )
    );
  }

  private insertWordsToIndexDB$(ws: WordsItem[]): Observable<WordsItem[]> {
    const setToIndexDB$ = ws.map((w) => this.dbService.add('words', w));
    return forkJoin(setToIndexDB$);
  }
}
