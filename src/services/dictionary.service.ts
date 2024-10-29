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
    const regex = new RegExp('/', 'g');
    return this.http.get<any>(`${FREE_DICTIONARY_API}/${wordStr}`).pipe(
      map((res: any[]) => {
        if (res?.length > 0 && res[0]) {
          const wordWrap = res[0];
          const meanings =
            (wordWrap?.meanings as any[])?.length > 0 ? (wordWrap?.meanings as any[]) : [];
          const word: string = wordWrap.word;
          const example = meanings[0]?.definitions[0]?.example ?? '';
          const eng_explanation = meanings
            .map((m) => {
              return `${m.partOfSpeech} ${m.definitions[0]?.definition}`;
            })
            .join('; ');
          let phonetic: string = wordWrap.phonetic;
          phonetic = phonetic.includes('/') ? phonetic.replace(regex, '') : phonetic;
          return { word, phonetic, example, eng_explanation } as WordsItem;
        }
        return null;
      }),
    );
  }
}
