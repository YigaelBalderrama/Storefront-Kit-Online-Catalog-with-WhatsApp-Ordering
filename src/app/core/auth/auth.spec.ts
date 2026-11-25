import { TestBed } from '@angular/core/testing';
import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import {
  ActivatedRouteSnapshot,
  provideRouter,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { vi } from 'vitest';
import { AuthService } from './auth.service';
import { authGuard } from './auth.guard';
import { guestGuard } from './guest.guard';
import { authInterceptor } from './auth.interceptor';
import { mockBackendInterceptor } from './mock-backend.interceptor';
import { MOCK_ACCESS_TOKEN } from './mock-auth.fixture';
import { decodeJwt, isTokenExpired } from './jwt.util';
import { provideAppConfig } from '../config/app-config';
const config = {
  apiBaseUrl: '/test-api',
  useMockBackend: true,
  mockLatencyMs: 0,
  tokenStorageKey: 'test-auth',
};
let stored: Map<string, string>;
beforeEach(() => {
  stored = new Map();
  vi.stubGlobal('localStorage', {
    getItem: (key: string) => stored.get(key) ?? null,
    setItem: (key: string, value: string) => stored.set(key, value),
    removeItem: (key: string) => stored.delete(key),
  });
});
afterEach(() => {
  TestBed.resetTestingModule();
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});
function setup(testHttp = false) {
  TestBed.configureTestingModule({
    providers: [
      provideAppConfig(config),
      provideRouter([]),
      provideHttpClient(
        withInterceptors(testHttp ? [authInterceptor] : [authInterceptor, mockBackendInterceptor]),
      ),
      ...(testHttp ? [provideHttpClientTesting()] : []),
    ],
  });
  return TestBed.inject(AuthService);
}
describe('JWT', () => {
  it('decodes a base64url payload', () => {
    expect(decodeJwt(MOCK_ACCESS_TOKEN)?.email).toBe('admin@example.com');
  });
  it('rejects malformed tokens and invalid claims', () => {
    for (const token of ['bad', 'a.%%.b', 'a.e30.b']) expect(decodeJwt(token)).toBeNull();
  });
  it('checks expiry including the exact boundary', () => {
    const user = decodeJwt(MOCK_ACCESS_TOKEN)!;
    expect(isTokenExpired(user, user.exp * 1000)).toBe(true);
    expect(isTokenExpired(user, user.exp * 1000 - 1)).toBe(false);
  });
  it('decodes Unicode and base64url characters', () => {
    const payload = { ...decodeJwt(MOCK_ACCESS_TOKEN), name: 'José 🛒' };
    const bytes = new TextEncoder().encode(JSON.stringify(payload));
    const encoded = btoa(String.fromCharCode(...bytes))
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');
    expect(decodeJwt(`e30.${encoded}.c2ln`)?.name).toBe(payload.name);
  });
});
describe('AuthService and mock', () => {
  it('logs in, persists and logs out', async () => {
    const auth = setup();
    const navigate = vi.spyOn(TestBed.inject(Router), 'navigate').mockResolvedValue(true);
    await auth.login('admin@example.com', 'Admin123!');
    expect(auth.isAuthenticated()).toBe(true);
    expect(stored.get(config.tokenStorageKey)).toBe(MOCK_ACCESS_TOKEN);
    auth.logout();
    expect(auth.token()).toBeNull();
    expect(stored.has(config.tokenStorageKey)).toBe(false);
    expect(navigate).toHaveBeenCalledWith(['/login']);
  });
  it('rejects incorrect credentials', async () => {
    const auth = setup();
    await expect(auth.login('admin@example.com', 'incorrect')).rejects.toMatchObject({
      status: 401,
    });
    expect(auth.isAuthenticated()).toBe(false);
  });
  it('restores a persisted session', () => {
    stored.set(config.tokenStorageKey, MOCK_ACCESS_TOKEN);
    expect(setup().user()?.name).toBe('Administrador');
  });
  it('removes malformed or expired sessions', () => {
    const payload = { ...decodeJwt(MOCK_ACCESS_TOKEN), exp: 1 };
    stored.set(
      config.tokenStorageKey,
      `e30.${btoa(JSON.stringify(payload)).replace(/=+$/, '')}.c2ln`,
    );
    expect(setup().isAuthenticated()).toBe(false);
    expect(stored.size).toBe(0);
  });
  it('works when browser storage is unavailable', async () => {
    vi.stubGlobal('localStorage', {
      getItem: () => {
        throw new Error();
      },
      setItem: () => {
        throw new Error();
      },
      removeItem: () => {
        throw new Error();
      },
    });
    const auth = setup();
    await auth.login('admin@example.com', 'Admin123!');
    expect(auth.isAuthenticated()).toBe(true);
  });
  it('prevents duplicate login requests and late login after logout', async () => {
    const auth = setup(true);
    vi.spyOn(TestBed.inject(Router), 'navigate').mockResolvedValue(true);
    const first = auth.login('admin@example.com', 'Admin123!');
    await auth.login('admin@example.com', 'Admin123!');
    const http = TestBed.inject(HttpTestingController);
    const request = http.expectOne('/test-api/auth/login');
    auth.logout();
    request.flush({ accessToken: MOCK_ACCESS_TOKEN });
    await first;
    expect(auth.token()).toBeNull();
    http.verify();
  });
});
describe('guards', () => {
  it('preserves returnUrl and permits guests', () => {
    setup();
    const route = new ActivatedRouteSnapshot();
    const state = { url: '/catalogo?pagina=2' } as RouterStateSnapshot;
    const result = TestBed.runInInjectionContext(() => authGuard(route, state));
    expect(String(result)).toBe('/login?returnUrl=%2Fcatalogo%3Fpagina%3D2');
    expect(TestBed.runInInjectionContext(() => guestGuard(route, state))).toBe(true);
  });
  it('permits authenticated access and redirects away from login', () => {
    stored.set(config.tokenStorageKey, MOCK_ACCESS_TOKEN);
    setup();
    const route = new ActivatedRouteSnapshot();
    const state = { url: '/profile' } as RouterStateSnapshot;
    expect(TestBed.runInInjectionContext(() => authGuard(route, state))).toBe(true);
    expect(String(TestBed.runInInjectionContext(() => guestGuard(route, state)))).toBe(
      '/dashboard',
    );
  });
});
describe('authInterceptor', () => {
  it('adds the token only to API requests, omitting login', async () => {
    stored.set(config.tokenStorageKey, MOCK_ACCESS_TOKEN);
    setup(true);
    const client = TestBed.inject(HttpClient);
    const http = TestBed.inject(HttpTestingController);
    for (const url of ['/test-api/profile', '/test-api/auth/login', 'https://example.com/data']) {
      const response = firstValueFrom(client.get(url));
      const req = http.expectOne(url);
      expect(req.request.headers.get('Authorization')).toBe(
        url === '/test-api/profile' ? `Bearer ${MOCK_ACCESS_TOKEN}` : null,
      );
      req.flush({});
      await response;
    }
    http.verify();
  });
  it('logs out on API 401 but not login 401', async () => {
    stored.set(config.tokenStorageKey, MOCK_ACCESS_TOKEN);
    const auth = setup(true);
    const navigate = vi.spyOn(TestBed.inject(Router), 'navigate').mockResolvedValue(true);
    const client = TestBed.inject(HttpClient);
    const http = TestBed.inject(HttpTestingController);
    for (const url of ['/test-api/auth/login', '/test-api/profile']) {
      const response = firstValueFrom(client.get(url));
      const rejected = expect(response).rejects.toMatchObject({ status: 401 });
      http.expectOne(url).flush({}, { status: 401, statusText: 'Unauthorized' });
      await rejected;
      expect(auth.isAuthenticated()).toBe(url.endsWith('/login'));
    }
    expect(navigate).toHaveBeenCalledWith(['/login']);
    http.verify();
  });
});
