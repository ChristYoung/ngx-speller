import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { Settings } from '../types';
import { DbService } from './DataBase/db.service';
import { SvgService } from './svg.service';
import { KeyboardSoundService } from './keyboard-sound.service';

@Injectable({
  providedIn: 'root',
})
export class StartUpService {
  constructor(
    private svgService: SvgService,
    private dbService: DbService,
    private keySound: KeyboardSoundService,
  ) {}

  load(): () => Promise<void> {
    return async () => {
      await this.viaIndexDBInit();
      await this.viaSvgInit();
      this.keySound.initKeyBoardSound();
    };
  }

  viaIndexDBInit(): Promise<Settings> {
    const total$ = this.dbService.getAllWordsFromIndexDB(true).pipe(
      mergeMap((words) => {
        return this.dbService.getSettingConfigsFromIndexDB(words.length, true);
      }),
    );
    return firstValueFrom(total$);
  }

  viaSvgInit(): Promise<void> {
    return new Promise((resolve) => {
      this.svgService.init();
      resolve();
    });
  }
}
