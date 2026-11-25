import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';
export const guestGuard: CanActivateFn = () =>
  inject(AuthService).validateSession() ? inject(Router).createUrlTree(['/dashboard']) : true;
