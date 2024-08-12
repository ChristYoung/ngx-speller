import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { WORDS_COMPLEX_EXPLANATION } from '../core/constant';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class YouDaoHttpService {
  constructor(private http: HttpClient) {}

  getYouDaoWordItemByHttp(wordStr: string): Observable<any> {
    return this.http.get<any>(`${WORDS_COMPLEX_EXPLANATION}/${wordStr}`).pipe(
      map((res) => {
        res.word = wordStr;
        return res;
      })
    );
  }
}
