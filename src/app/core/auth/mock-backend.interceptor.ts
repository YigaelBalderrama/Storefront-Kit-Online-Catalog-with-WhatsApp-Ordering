import { HttpErrorResponse, HttpInterceptorFn, HttpResponse } from '@angular/common/http';
import { delay, mergeMap, of, throwError } from 'rxjs';
import { injectAppConfig } from '../config/app-config';
import { MOCK_ACCESS_TOKEN, MOCK_CREDENTIALS } from './mock-auth.fixture';
export const mockBackendInterceptor: HttpInterceptorFn = (request, next) => {
  const config = injectAppConfig();
  if (request.method !== 'POST' || request.url !== `${config.apiBaseUrl}/auth/login`)
    return next(request);
  const body: unknown = request.body;
  const valid =
    body !== null &&
    typeof body === 'object' &&
    'email' in body &&
    'password' in body &&
    body.email === MOCK_CREDENTIALS.email &&
    body.password === MOCK_CREDENTIALS.password;
  return of(null).pipe(
    delay(config.mockLatencyMs),
    mergeMap(() =>
      valid
        ? of(new HttpResponse({ status: 200, body: { accessToken: MOCK_ACCESS_TOKEN } }))
        : throwError(
            () => new HttpErrorResponse({ status: 401, error: { code: 'INVALID_CREDENTIALS' } }),
          ),
    ),
  );
};
