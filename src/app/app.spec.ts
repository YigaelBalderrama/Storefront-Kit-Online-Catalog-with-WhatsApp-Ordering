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

  it('filters sections from the URL and handles an unknown section', async () => {
    const harness = await RouterTestingHarness.create('/catalogo?seccion=Hogar&pagina=9');
    await harness.fixture.whenStable();
    expect(harness.routeNativeElement?.querySelectorAll('app-product-card').length).toBe(2);
    expect(harness.routeNativeElement?.querySelector('#products-title')?.textContent).toBe('Hogar');
    expect(harness.routeNativeElement?.querySelector('app-paginator')).toBeNull();
    await harness.navigateByUrl('/catalogo?seccion=unknown');
    await harness.fixture.whenStable();
    expect(harness.routeNativeElement?.querySelectorAll('app-product-card').length).toBe(3);
    expect(harness.routeNativeElement?.querySelector('#products-title')?.textContent).toBe(
      'Todos los productos',
    );
  });

  it('combines categories and supports clearing and selecting all categories', async () => {
    const harness = await RouterTestingHarness.create('/catalogo?seccion=Hogar&seccion=Moda');
    await harness.fixture.whenStable();
    expect(harness.routeNativeElement?.querySelectorAll('app-product-card').length).toBe(3);
    expect(harness.routeNativeElement?.querySelector('#products-title')?.textContent).toBe(
      'Hogar, Moda',
    );
    const all = harness.routeNativeElement?.querySelector<HTMLInputElement>('mat-checkbox input');
    expect(all?.indeterminate).toBe(true);
    all?.click();
    await harness.fixture.whenStable();
    expect(harness.routeNativeElement?.querySelector('#products-title')?.textContent).toBe(
      'Todos los productos',
    );
    all?.click();
    await harness.fixture.whenStable();
    expect(harness.routeNativeElement?.querySelectorAll('app-product-card').length).toBe(0);
    expect(harness.routeNativeElement?.textContent).toContain('Selecciona una o más secciones');
    await harness.navigateByUrl('/catalogo?seccion=');
    await harness.fixture.whenStable();
    expect(harness.routeNativeElement?.querySelectorAll('app-product-card').length).toBe(0);
  });
});
