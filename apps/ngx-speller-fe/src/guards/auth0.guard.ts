import { Injectable } from '@angular/core';
import { CanActivateChild } from '@angular/router';
import { AuthService } from '@auth0/auth0-angular';
import { Observable, of } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';
import { removePreloaderAnimation } from '../utils';

@Injectable({
  providedIn: 'root',
})
export class Auth0Guard implements CanActivateChild {
  constructor(private auth0Service: AuthService) {}

  canActivateChild(): Observable<boolean> {
    return this.auth0Service.isAuthenticated$.pipe(
      mergeMap((loggedIn) => {
        console.log('loggedIn', loggedIn);
        if (!loggedIn) {
          // To avoid the page refresh twice,
          // we use the getAccessTokenSilently() method to get the access token silently instead of using `loginWithRedirect`.
          // If the access token is available, the user is logged in and the page can be loaded normally.
          return this.auth0Service.getAccessTokenSilently().pipe(
            map(() => {
              removePreloaderAnimation();
              return true;
            }),
          );
        } else {
          removePreloaderAnimation();
          return of(true);
        }
      }),
    );
  }
}
