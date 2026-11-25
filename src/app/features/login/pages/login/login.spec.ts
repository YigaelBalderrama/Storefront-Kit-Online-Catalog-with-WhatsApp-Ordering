import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter, Router } from '@angular/router';
import { vi } from 'vitest';
import { Login } from './login';
import { provideAppConfig } from '../../../../core/config/app-config';
import { MOCK_ACCESS_TOKEN } from '../../../../core/auth/mock-auth.fixture';
describe('Login', () => {
  beforeEach(() => {
    vi.stubGlobal('localStorage', {
      getItem: () => null,
      setItem: () => undefined,
      removeItem: () => undefined,
    });
    TestBed.configureTestingModule({
      imports: [Login],
      providers: [
        provideRouter([]),
        provideAppConfig({
          apiBaseUrl: '/test',
          useMockBackend: false,
          mockLatencyMs: 0,
          tokenStorageKey: 'test',
        }),
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    });
  });
  afterEach(() => {
    TestBed.inject(HttpTestingController).verify();
    TestBed.resetTestingModule();
    vi.unstubAllGlobals();
  });
  async function create() {
    const fixture = TestBed.createComponent(Login);
    await fixture.whenStable();
    const element: HTMLElement = fixture.nativeElement;
    return { fixture, element };
  }
  it('toggles password visibility without submitting or losing the value', async () => {
    const { fixture, element } = await create();
    const password = element.querySelector<HTMLInputElement>('#password')!;
    const toggle = element.querySelector<HTMLButtonElement>('[aria-controls=password]')!;
    password.value = 'Admin123!';
    password.dispatchEvent(new Event('input'));
    toggle.click();
    await fixture.whenStable();
    expect(password.type).toBe('text');
    expect(password.value).toBe('Admin123!');
    expect(toggle.getAttribute('aria-label')).toBe('Ocultar contraseña');
    toggle.click();
    await fixture.whenStable();
    expect(password.type).toBe('password');
    expect(toggle.getAttribute('aria-label')).toBe('Mostrar contraseña');
    TestBed.inject(HttpTestingController).expectNone('/test/auth/login');
  });
  it('shows validation errors after touch and focuses invalid submissions', async () => {
    const { fixture, element } = await create();
    const email = element.querySelector<HTMLInputElement>('#email')!;
    expect(element.querySelector('#email-errors')?.textContent?.trim()).toBe('');
    expect(element.querySelector<HTMLButtonElement>('button[type=submit]')?.disabled).toBe(true);
    email.value = 'bad';
    email.dispatchEvent(new Event('input'));
    email.dispatchEvent(new Event('blur'));
    await fixture.whenStable();
    expect(element.querySelector('#email-errors')?.textContent).toContain('válido');
    element.querySelector('form')!.dispatchEvent(new Event('submit', { cancelable: true }));
    await fixture.whenStable();
    expect(document.activeElement).toBe(email);
    expect(element.querySelector('#password-errors')?.textContent).toContain('contraseña');
  });
  it('displays loading and errors, preserves values and retries successfully', async () => {
    const { fixture, element } = await create();
    const navigate = vi.spyOn(TestBed.inject(Router), 'navigateByUrl').mockResolvedValue(true);
    for (const [id, value] of [
      ['email', 'admin@example.com'],
      ['password', 'Admin123!'],
    ]) {
      const input = element.querySelector<HTMLInputElement>(`#${id}`)!;
      input.value = value;
      input.dispatchEvent(new Event('input'));
    }
    await fixture.whenStable();
    element.querySelector<HTMLButtonElement>('button[type=submit]')!.click();
    await new Promise((resolve) => setTimeout(resolve, 0));
    expect(element.querySelector<HTMLButtonElement>('button[type=submit]')?.disabled).toBe(true);
    expect(element.textContent).toContain('Iniciando sesión');
    const http = TestBed.inject(HttpTestingController);
    http.expectOne('/test/auth/login').flush({}, { status: 401, statusText: 'Unauthorized' });
    await new Promise((resolve) => setTimeout(resolve, 0));
    await fixture.whenStable();
    expect(element.querySelector('[role=alert]')?.textContent).toContain('incorrectos');
    expect(element.querySelector<HTMLInputElement>('#password')?.value).toBe('Admin123!');
    element.querySelector<HTMLButtonElement>('button[type=submit]')!.click();
    http.expectOne('/test/auth/login').flush({ accessToken: MOCK_ACCESS_TOKEN });
    await new Promise((resolve) => setTimeout(resolve, 0));
    await fixture.whenStable();
    expect(navigate).toHaveBeenCalledWith('/catalogo');
  });
});
