import { Injectable, computed, resource } from '@angular/core';
import { Product } from '../models/product';
@Injectable({ providedIn: 'root' })
export class Catalog {
  private readonly productsResource = resource({
    loader: async ({ abortSignal }): Promise<readonly Product[]> => {
      const { PRODUCTS } = await import('../data/products');
      abortSignal.throwIfAborted();
      return PRODUCTS;
    },
  });
  readonly products = computed(() =>
    this.productsResource.hasValue() ? this.productsResource.value() : [],
  );
  readonly loading = this.productsResource.isLoading;
  readonly error = this.productsResource.error;
  retry(): void {
    this.productsResource.reload();
  }
}
