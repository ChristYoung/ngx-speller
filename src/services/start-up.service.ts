import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { Settings } from '../types';
import { DbService } from './DataBase/db.service';
import { SvgService } from './svg.service';
import { PlatformService, PlatFormType } from './platform.service';

@Injectable({
  providedIn: 'root'
})
export class StartUpService {

  constructor(
    private platform: PlatformService,
    private svgService: SvgService,
    private dbService: DbService,
  ) { }

  load(): () => Promise<void> {
    return async () => {
      await this.viaPlatFormInit();
      await this.viaIndexDBInit();
      await this.viaSvgInit();
    };
  }

  viaPlatFormInit(): Promise<void> {
    return new Promise((resolve, _reject) => {
      const currentPlatform: PlatFormType = location.href.includes('github.io') ? 'GITHUB' : 'AWS';
      this.platform.setPlatform(currentPlatform);
      resolve();
    });
  }

  viaIndexDBInit(): Promise<Settings> {
    const total$ = this.dbService.getAllWordsFromIndexDB(true).pipe(
        mergeMap((words) => {
          return this.dbService.getSettingConfigsFromIndexDB(words.length, true);
        })
      );
    return firstValueFrom(total$);
  }

  viaSvgInit(): Promise<void> {
    return new Promise((resolve, _reject) => {
      this.svgService.init();
      resolve();
    });
  }

}
