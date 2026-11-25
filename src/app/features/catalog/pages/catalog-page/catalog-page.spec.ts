import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { registerLocaleData } from '@angular/common';
import localeEsBo from '@angular/common/locales/es-BO';
import { CatalogPage } from './catalog-page';
import { Catalog } from '../../services/catalog';
import { Product } from '../../models/product';
import { provideRouter, Router } from '@angular/router';
import { STORE_CONFIG } from '../../../../core/config/store.config';

registerLocaleData(localeEsBo, STORE_CONFIG.locale);

const testProducts: readonly Product[] = [
  {
    id: 'first',
    name: 'First product',
    description: 'First description',
    category: 'Accesorios',
    image: '/first.svg',
    price: 10,
    stock: 2,
  },
  {
    id: 'second',
    name: 'Second product',
    description: 'Second description',
    category: 'Hogar',
    image: '/second.svg',
    price: 20,
    stock: 3,
  },
];

async function createCatalogPage(products: readonly Product[] = testProducts) {
  const catalog = {
    products: signal(products),
    loading: signal(false),
    error: signal<Error | undefined>(undefined),
    retry: vi.fn(),
  };
  TestBed.configureTestingModule({
    imports: [CatalogPage],
    providers: [provideRouter([]), { provide: Catalog, useValue: catalog }],
  });
  const router = TestBed.inject(Router);
  vi.spyOn(router, 'navigate').mockResolvedValue(true);
  const fixture = TestBed.createComponent(CatalogPage);
  await fixture.whenStable();
  fixture.detectChanges();
  return { catalog, fixture, router };
}

describe('CatalogPage states', () => {
  it('shows loading, an accessible error with retry, and an empty catalog', async () => {
    const catalog = {
      products: signal<readonly Product[]>([]),
      loading: signal(true),
      error: signal<Error | undefined>(undefined),
      retry: vi.fn(),
    };
    TestBed.configureTestingModule({
      imports: [CatalogPage],
      providers: [provideRouter([]), { provide: Catalog, useValue: catalog }],
    });
    const fixture = TestBed.createComponent(CatalogPage);
    await fixture.whenStable();
    const element: HTMLElement = fixture.nativeElement;
    expect(element.textContent).toContain('Cargando');
    catalog.loading.set(false);
    catalog.error.set(new Error('Unavailable'));
    await fixture.whenStable();
    expect(element.querySelector('[role="alert"]')?.textContent).toContain('No pudimos');
    element.querySelector('button')?.click();
    expect(catalog.retry).toHaveBeenCalledOnce();
    catalog.error.set(undefined);
    await fixture.whenStable();
    expect(element.textContent).toContain('Pronto');
  });
});

describe('CatalogPage sections sidenav', () => {
  it('renders the section checkboxes in the open sidenav and collapses it', async () => {
    const { fixture } = await createCatalogPage();
    const element: HTMLElement = fixture.nativeElement;
    const sidenav = element.querySelector('mat-sidenav');
    const toggle = element.querySelector<HTMLButtonElement>('[mat-icon-button]');

    expect(sidenav).not.toBeNull();
    expect(sidenav?.classList.contains('mat-drawer-opened')).toBe(true);
    expect(element.querySelectorAll('mat-checkbox')).toHaveLength(3);
    expect(toggle?.getAttribute('aria-expanded')).toBe('true');

    toggle?.click();
    fixture.detectChanges();

    expect(toggle?.getAttribute('aria-expanded')).toBe('false');
    expect(sidenav?.classList.contains('mat-drawer-opened')).toBe(false);
    fixture.destroy();
  });

  it('keeps category checkbox selection connected to the URL state', async () => {
    const { fixture, router } = await createCatalogPage();
    const checkboxes = fixture.nativeElement.querySelectorAll('mat-checkbox input');

    expect(checkboxes).toHaveLength(3);
    checkboxes[1].click();

    expect(router.navigate).toHaveBeenCalledWith(
      [],
      expect.objectContaining({
        queryParams: { seccion: ['Hogar'], pagina: 1 },
        queryParamsHandling: 'merge',
      }),
    );
    fixture.destroy();
  });
});
