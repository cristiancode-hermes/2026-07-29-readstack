import { inject } from '@angular/core';
import { Router, type CanActivateFn, UrlTree } from '@angular/router';
import { lastValueFrom } from 'rxjs';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = async (): Promise<boolean | UrlTree> => {
  const auth = inject(AuthService);
  const router = inject(Router);

  const token = localStorage.getItem('readstack_token');
  if (!token) {
    return router.parseUrl('/login');
  }

  if (!auth.currentUser()) {
    try {
      const res = await lastValueFrom(auth.getProfile());
      if (res) {
        auth.currentUser.set(res);
      }
      return true;
    } catch {
      auth.logout();
      return router.parseUrl('/login');
    }
  }

  return true;
};
