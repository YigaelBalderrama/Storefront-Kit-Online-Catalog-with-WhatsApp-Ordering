import { TestBed } from '@angular/core/testing';
import { App } from './app';
import { provideRouter } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { routes } from './app.routes';
import { appConfig } from './app.config';

describe('App', () => {
  beforeEach(async () => {
    localStorage.clear();
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [...appConfig.providers, provideRouter(routes)],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('opens the catalog from the initial route', async () => {
    const harness = await RouterTestingHarness.create('/');
    await harness.fixture.whenStable();
    expect(harness.routeNativeElement?.querySelector('h1')?.textContent).toContain(
      'Encuentra tu próximo favorito',
    );
    expect(harness.routeNativeElement?.querySelectorAll('app-product-card').length).toBe(3);
    expect(harness.routeNativeElement?.textContent).toContain('Página 1 de 2');
    await harness.navigateByUrl('/catalogo?pagina=2&cantidad=3');
    await harness.fixture.whenStable();
    expect(harness.routeNativeElement?.textContent).toContain('Agotado');
    expect(harness.routeNativeElement?.textContent).toContain('Página 2 de 2');
  });
});
