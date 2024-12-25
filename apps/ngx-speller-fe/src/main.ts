import { bootstrapApplication } from '@angular/platform-browser';

import { AppComponent } from './app/app.component';
import { appConfig } from './app/app.config';
import { preloaderFinished } from './utils/preloader.util';

preloaderFinished();

bootstrapApplication(AppComponent, appConfig)
  .then((res) => {
    // Move the end animation to auth0Guard, because in auth0Guard you need to call the interface to determine whether to log in.
    // removePreloaderAnimation();
    return res;
  })
  .catch((err) => console.error(err));
