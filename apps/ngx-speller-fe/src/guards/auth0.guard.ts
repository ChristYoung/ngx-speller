import { Injectable } from '@angular/core';
import { CanActivateChild } from '@angular/router';
import { AuthService } from '@auth0/auth0-angular';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { removePreloader } from '../utils';

@Injectable({
  providedIn: 'root',
})
export class Auth0Guard implements CanActivateChild {
  constructor(private auth0Service: AuthService) {}

  canActivateChild(): Observable<boolean> {
    return this.auth0Service.isAuthenticated$.pipe(
      tap((loggedIn) => {
        if (!loggedIn) {
          // TODO: Currently, the approach involves waiting until the page is fully loaded and then using a routing guard to determine the redirection,
          // which results in the page loading twice. While this is a temporary solution,
          // we plan to optimize this behavior in future updates.
          // Because loggedIn will be false every time the page is refreshed,
          // even if you have just logged in before and refreshed again,
          // it will still become false, so you need to be redirected to log in again,
          // which leads to the problem of refreshing twice.
          this.auth0Service.loginWithRedirect().subscribe(() => {
            removePreloader();
          });
        } else {
          removePreloader();
        }
      }),
    );
  }
}
