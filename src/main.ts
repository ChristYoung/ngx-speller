import { bootstrapApplication } from '@angular/platform-browser';

import { AppComponent } from './app/app.component';
import { appConfig } from './app/app.config';
import { preloaderFinished } from './utils/preloader.util';

preloaderFinished();

bootstrapApplication(AppComponent, appConfig)
  .then((res) => {
    if ((window as any).appBootstrap) {
      (window as any).appBootstrap();
    }
    return res;
  })
  .catch((err) => console.error(err));
