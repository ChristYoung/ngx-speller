import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { FREE_DICTIONARY_API } from '../core/constant';

@Injectable({
  providedIn: 'root',
})
export class YouDaoHttpService {
  constructor(private http: HttpClient) {}

  getYouDaoWordItemByHttp(wordStr: string): Observable<any> {
    return this.http.get<any>(`${FREE_DICTIONARY_API}/${wordStr}`).pipe(
      map((res) => {
        res.word = wordStr;
        return res;
      }),
    );
  }
}
