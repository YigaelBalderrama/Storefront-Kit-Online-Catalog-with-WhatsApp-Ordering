import {
  EnvironmentProviders,
  InjectionToken,
  inject,
  makeEnvironmentProviders,
} from '@angular/core';
export interface AppConfig {
  apiBaseUrl: string;
  useMockBackend: boolean;
  mockLatencyMs: number;
  tokenStorageKey: string;
}
export const APP_CONFIG = new InjectionToken<AppConfig>('APP_CONFIG');
export function provideAppConfig(config: AppConfig): EnvironmentProviders {
  return makeEnvironmentProviders([{ provide: APP_CONFIG, useValue: config }]);
}
export function injectAppConfig(): AppConfig {
  return inject(APP_CONFIG);
}
