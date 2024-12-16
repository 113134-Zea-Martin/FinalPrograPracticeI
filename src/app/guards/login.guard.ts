import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { LoginService } from '../services/login.service';

export const loginGuard: CanActivateFn = (route, state) => {
  const auth= inject(LoginService);
  const router = inject(Router);

  if (auth.user?.id == null) {
    router.navigate(['/login']);
    return false;
  }

  return true;
};
