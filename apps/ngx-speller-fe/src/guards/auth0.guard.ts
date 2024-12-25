import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { Observable, of } from 'rxjs';
import { StartUpService } from '../services/start-up.service';

@Injectable({
  providedIn: 'root',
})
export class Auth0Guard implements CanActivate {
  constructor(private startUp: StartUpService) {}

  canActivate(): Observable<boolean> {
    const isUserLoggedIn = this.startUp.getIsUserLoggedIn();
    return of(isUserLoggedIn);
  }
}
