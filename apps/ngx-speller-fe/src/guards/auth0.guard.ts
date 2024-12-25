import { Injectable } from '@angular/core';
import { CanActivateChild } from '@angular/router';
import { AuthService } from '@auth0/auth0-angular';
import { Observable, of } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { removePreloaderAnimation } from '../utils';

@Injectable({
  providedIn: 'root',
})
export class Auth0Guard implements CanActivateChild {
  constructor(private auth0Service: AuthService) {}

  canActivateChild(): Observable<boolean> {
    // TODO: It remains to be studied whether the logic for determining the user can be placed in startUpService.
    // After the Auth0 initialization is completed, it will be determined whether the user is logged in.
    return this.auth0Service.isAuthenticated$.pipe(
      mergeMap((loggedIn) => {
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
      catchError(() => {
        return this.auth0Service.loginWithRedirect().pipe(
          map(() => {
            removePreloaderAnimation();
            return false;
          }),
        );
      }),
    );
  }
}
