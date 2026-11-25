import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { AppConfig, provideAppConfig } from './core/config/app-config';
import { authInterceptor } from './core/auth/auth.interceptor';
import { mockBackendInterceptor } from './core/auth/mock-backend.interceptor';
import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { registerLocaleData } from '@angular/common';
import localeEsBo from '@angular/common/locales/es-BO';
import { STORE_CONFIG } from './core/config/store.config';

registerLocaleData(localeEsBo, STORE_CONFIG.locale);

// Para conectar el backend real, cambia useMockBackend a false y ajusta apiBaseUrl.
const config: AppConfig = {
  apiBaseUrl: '/api',
  useMockBackend: true,
  mockLatencyMs: 600,
  tokenStorageKey: 'access_token',
};

export const appConfig: ApplicationConfig = {
  providers: [
    provideAppConfig(config),
    provideHttpClient(
      withInterceptors([
        authInterceptor,
        ...(config.useMockBackend ? [mockBackendInterceptor] : []),
      ]),
    ),
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
  ],
};
