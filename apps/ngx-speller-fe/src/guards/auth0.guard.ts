import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { AuthService } from '@auth0/auth0-angular';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { removePreloader } from '../utils';

@Injectable({
  providedIn: 'root',
})
export class Auth0Guard implements CanActivate {
  constructor(private auth0Service: AuthService) {}

  canActivate(): Observable<boolean> {
    return this.auth0Service.isAuthenticated$.pipe(
      tap((loggedIn) => {
        if (!loggedIn) {
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
