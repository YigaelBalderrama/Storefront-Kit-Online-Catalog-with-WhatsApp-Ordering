import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { CatalogPage } from './catalog-page';
import { Catalog } from '../../services/catalog';
import { Product } from '../../models/product';

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
      providers: [{ provide: Catalog, useValue: catalog }],
    });
    const fixture = TestBed.createComponent(CatalogPage);
    await fixture.whenStable();
    const element: HTMLElement = fixture.nativeElement;
    expect(element.querySelector('[role="status"]')?.textContent).toContain('Cargando');
    catalog.loading.set(false);
    catalog.error.set(new Error('Unavailable'));
    await fixture.whenStable();
    expect(element.querySelector('[role="alert"]')?.textContent).toContain('No pudimos');
    element.querySelector('button')?.click();
    expect(catalog.retry).toHaveBeenCalledOnce();
    catalog.error.set(undefined);
    await fixture.whenStable();
    expect(element.querySelector('[role="status"]')?.textContent).toContain('Pronto');
  });
});
