import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import * as fs from 'fs';
import { join } from 'path';
import { Observable, catchError, map, shareReplay, throwError } from 'rxjs';
import { WORDS_COMPLEX_EXPLANATION } from './constant';

export interface WordItem {
  phonetic: string;
  explanation: string;
  example: string;
  example_zh: string;
  eng_explanation?: string;
  similar_words?: string[];
}

export interface KeyValueOption {
  id: string;
  name: string;
}

@Injectable()
export class AppService {
  private readonly logger = new Logger(AppService.name);

  constructor(private readonly http: HttpService) {}

  getExplanations(word: string): Observable<unknown> {
    const fetchWordDetails$ = this.http
      .get(`${WORDS_COMPLEX_EXPLANATION}${word}`)
      .pipe(shareReplay(1));

    return fetchWordDetails$.pipe(
      map((data) => {
        const response = data.data as any;
        const ecDicWord = response?.ec?.word[0] ?? null;
        const phonetic = ecDicWord?.usphone ?? '';
        // ['trs'][0]['tr'][0]['l']['i'][0]
        const explanation = ecDicWord?.trs[0]?.tr[0]?.l?.i[0] ?? '';
        const blngDicWord = response?.blng_sents_part ?? null;
        const similar_words =
          response?.syno?.synos?.length > 0
            ? response?.syno?.synos[0]?.syno?.ws?.map((sw) => sw.w)
            : [];
        const eng_explanation = response?.ee?.word?.trs[0]?.tr[0]?.l.i;
        const example = blngDicWord
          ? blngDicWord['sentence-pair'][0]['sentence']
          : null;
        const example_zh = blngDicWord
          ? blngDicWord['sentence-pair'][0]['sentence-translation']
          : null;
        return {
          phonetic,
          explanation,
          example,
          example_zh,
          word,
          similar_words,
          eng_explanation,
        };
      }),
      catchError((err) => {
        this.logger.error(err);
        return fetchWordDetails$.pipe(
          map((res) => {
            if (res && res.data) {
              this.logger.log(JSON.stringify(res.data));
            }
            return throwError(() => new Error(err));
          }),
        );
      }),
    );
  }

  async exportJsonToFile(data: any): Promise<string> {
    const filePath = join(__dirname, '..', 'data.json');
    return new Promise((resolve, reject) => {
      fs.writeFile(filePath, JSON.stringify(data, null, 2), (err) => {
        if (err) {
          reject(err);
        } else {
          resolve(filePath);
        }
      });
    });
  }

  getUUID(len: number) {
    if (len === 0) return '0';
    const chars =
      '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ#^><@$&_!¥';
    let result = '';
    for (let i = len; i > 0; --i)
      result += chars[Math.floor(Math.random() * chars.length)];
    return result;
  }
}
