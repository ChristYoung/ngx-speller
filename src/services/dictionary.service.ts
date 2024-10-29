// https://dictionaryapi.dev/
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { FREE_DICTIONARY_API } from '../core/constant';
import { WordsItem } from '../types';

@Injectable({
  providedIn: 'root',
})
export class DictionaryService {
  constructor(private http: HttpClient) {}

  getYouDaoWordItemByHttp(wordStr: string): Observable<WordsItem> {
    return this.http.get<any>(`${FREE_DICTIONARY_API}/${wordStr}`).pipe(
      map((res: any[]) => {
        if (res?.length > 0 && res[0]) {
          return {
            word: res[0].word,
            phonetic: res[0].phonetic,
          } as WordsItem;
        }
        return null;
      }),
    );
  }
}
