import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { Settings } from '../types';
import { DbService } from './DataBase/db.service';
import { SvgService } from './svg.service';
import { AuthenticatorService } from '@aws-amplify/ui-angular';
import { deleteUser, getCurrentUser } from 'aws-amplify/auth';

@Injectable({
  providedIn: 'root'
})
export class StartUpService {

  constructor(
    private svgService: SvgService,
    private dbService: DbService,
    private auth: AuthenticatorService, 
  ) { }

  load(): () => Promise<void> {
    return async () => {
      await this.viaIndexDBInit();
      await this.viaSvgInit()
      // const currentUser = await getCurrentUser();
      // console.log('currentUser',currentUser);
    };
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
