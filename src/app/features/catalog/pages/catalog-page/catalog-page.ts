import { Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';
import { IconButton } from '../../../../shared/components/icon-button/icon-button';
import { Cart } from '../../../cart';
import { Paginator } from '../../../../shared/components/paginator/paginator';
import { CATALOG_CONFIG } from '../../catalog.config';
import { ProductCard } from '../../components/product-card/product-card';
import { Catalog } from '../../services/catalog';
import { CATALOG_COPY } from '../../catalog.copy';
@Component({
  selector: 'app-catalog-page',
  imports: [
    ProductCard,
    IconButton,
    Paginator,
    MatFormFieldModule,
    MatSelectModule,
    MatRadioModule,
  ],
  templateUrl: './catalog-page.html',
  styleUrl: './catalog-page.scss',
})
export class CatalogPage {
  protected readonly priorityImageCount = CATALOG_CONFIG.priorityImageCount;
  protected readonly catalog = inject(Catalog);
  protected readonly cart = inject(Cart);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly query = toSignal(this.route.queryParamMap, {
    initialValue: this.route.snapshot.queryParamMap,
  });
  protected readonly categories = computed(() => [
    ...new Set(this.catalog.products().map((product) => product.category)),
  ]);
  protected readonly category = computed(() => {
    const requested = this.query().get('seccion');
    return requested && this.categories().includes(requested) ? requested : '';
  });
  protected readonly filtered = computed(() =>
    this.cart
      .availableProducts()
      .filter((product) => !this.category() || product.category === this.category()),
  );
  protected readonly sizes = computed(() => {
    const total = this.filtered().length;
    return total > 0
      ? [...new Set(CATALOG_CONFIG.pageSizes.map((size) => Math.min(size, total)))]
      : [];
  });
  protected readonly size = computed(() => {
    const size = Number(this.query().get('cantidad'));
    return (
      this.sizes().find((option) => option === size) ?? this.sizes()[0] ?? CATALOG_CONFIG.pageSize
    );
  });
  protected readonly page = computed(() => {
    const requested = Number(this.query().get('pagina'));
    const last = Math.max(1, Math.ceil(this.filtered().length / this.size()));
    return Number.isSafeInteger(requested) && requested > 0 ? Math.min(requested, last) : 1;
  });
  protected readonly products = computed(() =>
    this.filtered().slice((this.page() - 1) * this.size(), this.page() * this.size()),
  );
  protected readonly message = signal('');
  protected readonly skipLink = computed(() => {
    const queryParams = Object.fromEntries(
      this.query().keys.map((key) => [key, this.query().getAll(key)]),
    );
    return this.router.serializeUrl(
      this.router.createUrlTree([], { relativeTo: this.route, queryParams, fragment: 'products' }),
    );
  });
  protected readonly copy = CATALOG_COPY;

  protected changePage(page: number, size: number = this.size()): void {
    void this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { pagina: page, cantidad: size },
      queryParamsHandling: 'merge',
    });
  }

  protected add(id: string): void {
    this.message.set(this.cart.add(id) ? this.copy.added : this.copy.stockError);
  }

  protected changeCategory(category: string): void {
    void this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { seccion: category || null, pagina: 1 },
      queryParamsHandling: 'merge',
    });
  }
}
