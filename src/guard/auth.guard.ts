import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot } from '@angular/router';
import { getCurrentUser } from 'aws-amplify/auth';
import { catchError, from, map, of } from 'rxjs';

export const authGuard: CanActivateFn = (route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot) => {
  return from(getCurrentUser()).pipe(
    map((user) => {
      const { userId } = user;
      if (userId) {
        return true;
      }
      inject(Router).navigate(['/login']);
      return false;
    }),
    catchError((err) => {
      console.error(err);
      return of(false);
    })
  );
};
