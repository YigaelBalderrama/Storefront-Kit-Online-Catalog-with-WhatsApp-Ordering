import { Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Cart } from '../../../cart';
import { Paginator } from '../../../../shared/components/paginator/paginator';
import { CATALOG_CONFIG } from '../../catalog.config';
import { MatButtonModule } from '@angular/material/button';
import { ProductCard } from '../../components/product-card/product-card';
import { Catalog } from '../../services/catalog';
import { CATALOG_COPY } from '../../catalog.copy';
@Component({
  selector: 'app-catalog-page',
  imports: [ProductCard, MatButtonModule, RouterLink, Paginator],
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
  protected readonly sizes = CATALOG_CONFIG.pageSizes;
  protected readonly size = computed(() => {
    const size = Number(this.query().get('cantidad'));
    return this.sizes.find((option) => option === size) ?? CATALOG_CONFIG.pageSize;
  });
  protected readonly page = computed(() => {
    const requested = Number(this.query().get('pagina'));
    const last = Math.max(1, Math.ceil(this.catalog.products().length / this.size()));
    return Number.isSafeInteger(requested) && requested > 0 ? Math.min(requested, last) : 1;
  });
  protected readonly products = computed(() =>
    this.cart.availableProducts().slice((this.page() - 1) * this.size(), this.page() * this.size()),
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
}
