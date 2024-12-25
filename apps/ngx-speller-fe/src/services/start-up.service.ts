import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { Settings, VoiceType } from '../types';
import { DbService } from './DataBase/db.service';
import { KeyboardSoundService } from './keyboard-sound.service';
import { SvgService } from './svg.service';
import { LocalConfigService } from './LocalConfig/local-config.service';
import { AuthClientConfig, AuthConfig } from '@auth0/auth0-angular';
import { AUTH0_CONFIG } from '../core/constant';

@Injectable({
  providedIn: 'root',
})
export class StartUpService {
  constructor(
    private svgService: SvgService,
    private dbService: DbService,
    private keySound: KeyboardSoundService,
    private localConfig: LocalConfigService,
    private auth0Config: AuthClientConfig,
  ) {}

  load(): () => Promise<void> {
    return async () => {
      await this.viaIndexDBInit();
      await this.viaAuth0Init();
      await this.viaLocalConfigInit();
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

  viaAuth0Init(): Promise<void> {
    return new Promise((resolve) => {
      this.auth0Config.set({ ...AUTH0_CONFIG } as AuthConfig);
      resolve();
    });
  }

  viaLocalConfigInit(): Promise<VoiceType[]> {
    const localConfig$ = this.localConfig.init();
    return firstValueFrom(localConfig$);
  }
}
