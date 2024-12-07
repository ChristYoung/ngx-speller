import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, tap } from 'rxjs';
import { VoiceType } from '../../types';

@Injectable({
  providedIn: 'root',
})
export class LocalConfigService {
  voiceList: VoiceType[] = [];
  constructor(private http: HttpClient) {}

  init(): Observable<VoiceType[]> {
    return this.http.get<VoiceType[]>('assets/voices/voices.json').pipe(
      tap((voices) => {
        this.voiceList = [...voices];
      }),
      catchError((err) => {
        console.log(err);
        return [];
      }),
    );
  }
}
