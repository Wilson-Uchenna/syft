import { inject } from '@angular/core';
import {
  CanActivateFn,
  RouterStateSnapshot,
  ActivatedRouteSnapshot,
  UrlTree,
  Router
} from '@angular/router';
import { AuthService } from './auth.service'; // update path if needed

export const authGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
): boolean | UrlTree => {
  const auth = inject(AuthService);
  const router = inject(Router);

  const user = auth.currentUser$.value;

  return user ? true : router.parseUrl('/login');
};
