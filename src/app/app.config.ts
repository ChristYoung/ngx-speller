import {
  APP_INITIALIZER,
  ApplicationConfig,
  importProvidersFrom,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { NgxIndexedDBModule } from 'ngx-indexed-db';

import { provideHttpClient } from '@angular/common/http';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getDatabase, provideDatabase } from '@angular/fire/database';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import {
  getRemoteConfig,
  provideRemoteConfig,
} from '@angular/fire/remote-config';
import { getStorage, provideStorage } from '@angular/fire/storage';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideEffects } from '@ngrx/effects';
import { provideStore } from '@ngrx/store';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { firstValueFrom, mergeMap } from 'rxjs';
import { environment } from '../environments/environment.development';
import { DbService } from '../services/DataBase/db.service';
import { dbConfig } from '../services/DataBase/dbConfig';
import { metaReducers, reducers } from '../store';
import { SettingsEffects } from '../store/settings/settings.effect';
import { routes } from './app.routes';
import { zh_CN, provideNzI18n } from 'ng-zorro-antd/i18n';
import { registerLocaleData } from '@angular/common';
import zh from '@angular/common/locales/zh';
import { FormsModule } from '@angular/forms';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { Icons } from './icon.config';

registerLocaleData(zh);

// Attention: initializeUserData must return a type like '() => Promise<void>'!
export function initializeUserData(db: DbService): () => Promise<void> {
  return async () => {
    const total$ = db.getAllWordsFromIndexDB(true).pipe(
      mergeMap((words) => {
        return db.getSettingConfigsFromIndexDB(words.length, true);
      })
    );
    await firstValueFrom(total$);
  };
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    importProvidersFrom(NgxIndexedDBModule.forRoot(dbConfig)),
    importProvidersFrom(NzIconModule.forRoot(Icons)),
    provideAnimationsAsync(),
    provideHttpClient(),
    provideStore(reducers, { metaReducers }),
    provideEffects(SettingsEffects),
    provideStoreDevtools({
      connectInZone: true,
    }),
    {
      provide: APP_INITIALIZER,
      useFactory: initializeUserData,
      multi: true,
      deps: [DbService],
    },
    // importProvidersFrom(
    //   provideFirebaseApp(() => initializeApp(environment.fireBaseConfig))
    // ),
    // importProvidersFrom(provideAuth(() => getAuth())),
    // importProvidersFrom(provideFirestore(() => getFirestore())),
    // importProvidersFrom(provideDatabase(() => getDatabase())),
    // importProvidersFrom(provideStorage(() => getStorage())),
    // importProvidersFrom(provideRemoteConfig(() => getRemoteConfig())),
    provideNzI18n(zh_CN),
    importProvidersFrom(FormsModule),
    provideAnimationsAsync(),
    provideHttpClient(),
  ],
};
