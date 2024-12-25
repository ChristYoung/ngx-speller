import { registerLocaleData } from '@angular/common';
import { provideHttpClient } from '@angular/common/http';
import zh from '@angular/common/locales/zh';
import { APP_INITIALIZER, ApplicationConfig, importProvidersFrom } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideRouter, withHashLocation } from '@angular/router';
import { provideEffects } from '@ngrx/effects';
import { provideStore } from '@ngrx/store';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { provideNzI18n, zh_CN } from 'ng-zorro-antd/i18n';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NgxIndexedDBModule } from 'ngx-indexed-db';

import { dbConfig } from '../services/DataBase/dbConfig';
import { StartUpService } from '../services/start-up.service';
import { metaReducers, reducers } from '../store';
import { SettingsEffects } from '../store/settings/settings.effect';
import { routes } from './app.routes';
import { Icons } from './icon.config';
import { provideAuth0 } from '@auth0/auth0-angular';

registerLocaleData(zh);

// Attention: initializeUserData must return a type like '() => Promise<void>'!
export function initializeUserData(startup: StartUpService): () => Promise<void> {
  return startup.load();
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes, withHashLocation()),
    importProvidersFrom(NgxIndexedDBModule.forRoot(dbConfig)),
    importProvidersFrom(NzIconModule.forRoot(Icons)),
    provideAnimationsAsync(),
    provideHttpClient(),
    provideStore(reducers, { metaReducers }),
    provideEffects(SettingsEffects),
    provideAuth0(), // Put Auth0 configuration in startUpService
    provideStoreDevtools({
      connectInZone: true,
    }),
    {
      provide: APP_INITIALIZER,
      useFactory: initializeUserData,
      multi: true,
      deps: [StartUpService],
    },
    provideNzI18n(zh_CN),
    importProvidersFrom(FormsModule),
  ],
};
