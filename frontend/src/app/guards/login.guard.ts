import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';

export const loginGuard: CanActivateFn = (route, state) => {
  const token = sessionStorage.getItem('token');
  const router = inject(Router);

  if (token) {
    router.navigate(['/dashboard']);
    return false;
  } else {
    return true;
  }
};
