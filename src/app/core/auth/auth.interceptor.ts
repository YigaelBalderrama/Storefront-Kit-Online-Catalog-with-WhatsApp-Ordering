import { inject } from '@angular/core';
import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import { injectAppConfig } from '../config/app-config';
import { AuthService } from './auth.service';
export const authInterceptor: HttpInterceptorFn = (request, next) => {
  const config = injectAppConfig();
  const auth = inject(AuthService);
  const login = request.url === `${config.apiBaseUrl}/auth/login`;
  const api = request.url.startsWith(`${config.apiBaseUrl}/`);
  const token = !login && api && auth.validateSession() ? auth.token() : null;
  return next(
    token ? request.clone({ setHeaders: { Authorization: `Bearer ${token}` } }) : request,
  ).pipe(
    catchError((error: unknown) => {
      if (!login && api && error instanceof HttpErrorResponse && error.status === 401)
        auth.logout();
      return throwError(() => error);
    }),
  );
};
