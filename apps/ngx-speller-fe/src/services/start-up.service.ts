import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { mergeMap, tap } from 'rxjs/operators';
import { Settings, VoiceType } from '../types';
import { DbService } from './DataBase/db.service';
import { KeyboardSoundService } from './keyboard-sound.service';
import { SvgService } from './svg.service';
import { LocalConfigService } from './LocalConfig/local-config.service';
import { AuthClientConfig, AuthConfig, AuthService } from '@auth0/auth0-angular';
import { AUTH0_CONFIG } from '../core/constant';

@Injectable({
  providedIn: 'root',
})
export class StartUpService {
  private isUserLoggedIn: boolean = false;

  constructor(
    private svgService: SvgService,
    private dbService: DbService,
    private keySound: KeyboardSoundService,
    private localConfig: LocalConfigService,
    private auth0Service: AuthService,
    private auth0Config: AuthClientConfig,
  ) {}

  load(): () => Promise<void> {
    return async () => {
      await this.viaIndexDBInit();
      await this.viaInitAuth0Status();
      await this.viaLocalConfigInit();
      await this.viaSvgInit();
      this.keySound.initKeyBoardSound();
    };
  }

  getIsUserLoggedIn(): boolean {
    return this.isUserLoggedIn;
  }

  private viaIndexDBInit(): Promise<Settings> {
    const total$ = this.dbService.getAllWordsFromIndexDB(true).pipe(
      mergeMap((words) => {
        return this.dbService.getSettingConfigsFromIndexDB(words.length, true);
      }),
    );
    return firstValueFrom(total$);
  }

  private viaSvgInit(): Promise<void> {
    return new Promise((resolve) => {
      this.svgService.init();
      resolve();
    });
  }

  private viaInitAuth0Status(): Promise<boolean> {
    return new Promise((resolve) => {
      this.auth0Config.set({ ...AUTH0_CONFIG } as AuthConfig);
      resolve(true);
      // const loggedIn$ = this.auth0Service.isAuthenticated$.pipe(
      //   tap((isAuthenticated) => {
      //     this.isUserLoggedIn = isAuthenticated;
      //     resolve(isAuthenticated);
      //   }),
      // );
      // return firstValueFrom(loggedIn$);
    });
    // const loggedIn$ = this.auth0Service.isAuthenticated$.pipe(
    //   tap((isAuthenticated) => {
    //     this.isUserLoggedIn = isAuthenticated;
    //   }),
    // );
    // return firstValueFrom(loggedIn$);
  }

  private viaLocalConfigInit(): Promise<VoiceType[]> {
    const localConfig$ = this.localConfig.init();
    return firstValueFrom(localConfig$);
  }
}
