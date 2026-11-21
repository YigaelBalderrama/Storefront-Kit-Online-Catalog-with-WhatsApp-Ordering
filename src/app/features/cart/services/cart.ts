import { computed, effect, inject, Injectable, linkedSignal, signal } from '@angular/core';
import { Catalog } from '../../catalog';
import { CartLine } from '../models/cart-line';
import { CART_STORAGE_KEY } from '../cart.config';

export function parseCart(value: string | null): Readonly<Record<string, number>> {
  try {
    const parsed: unknown = JSON.parse(value ?? '{}');
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return {};
    return Object.fromEntries(
      Object.entries(parsed).filter(
        ([id, quantity]) =>
          id.length > 0 &&
          typeof quantity === 'number' &&
          Number.isSafeInteger(quantity) &&
          quantity > 0,
      ),
    );
  } catch {
    return {};
  }
}

@Injectable({ providedIn: 'root' })
export class Cart {
  private readonly catalog = inject(Catalog);
  private readonly restored = signal(this.restore());
  private readonly quantities = linkedSignal({
    source: () => ({
      products: this.catalog.products(),
      ready: !this.catalog.loading() && !this.catalog.error(),
    }),
    computation: ({ products, ready }, previous): Readonly<Record<string, number>> => {
      const quantities = previous?.value ?? this.restored();
      if (!ready) return quantities;
      return Object.fromEntries(
        products.flatMap((product) => {
          const quantity = Math.min(quantities[product.id] ?? 0, product.stock);
          return quantity > 0 ? [[product.id, quantity]] : [];
        }),
      );
    },
  });
  readonly lines = computed<readonly CartLine[]>(() =>
    this.catalog.products().flatMap((product) => {
      const quantity = this.quantities()[product.id] ?? 0;
      return quantity > 0
        ? [
            {
              product,
              quantity,
              subtotal: Math.round(product.price * quantity * 100) / 100,
              available: Math.max(0, product.stock - quantity),
            },
          ]
        : [];
    }),
  );
  readonly count = computed(() => this.lines().reduce((sum, line) => sum + line.quantity, 0));
  readonly total = computed(
    () => Math.round(this.lines().reduce((sum, line) => sum + line.subtotal, 0) * 100) / 100,
  );
  readonly availableProducts = computed(() =>
    this.catalog.products().map((product) => ({
      ...product,
      stock: Math.max(0, product.stock - (this.quantities()[product.id] ?? 0)),
    })),
  );
  readonly loading = this.catalog.loading;
  readonly error = this.catalog.error;

  constructor() {
    effect(() => {
      const quantities = this.quantities();
      if (this.loading() || this.error()) return;
      try {
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(quantities));
      } catch {
        return;
      }
    });
  }

  add(id: string): boolean {
    if (this.loading() || this.error()) return false;
    const product = this.catalog.products().find((product) => product.id === id);
    const current = this.quantities()[id] ?? 0;
    if (!product || current >= product.stock) return false;
    this.quantities.update((values) => ({ ...values, [id]: current + 1 }));
    return true;
  }

  decrease(id: string): void {
    const current = this.quantities()[id] ?? 0;
    if (current <= 1) this.remove(id);
    else this.quantities.update((values) => ({ ...values, [id]: current - 1 }));
  }

  remove(id: string): void {
    this.quantities.update((values) =>
      Object.fromEntries(Object.entries(values).filter(([key]) => key !== id)),
    );
  }

  clear(): void {
    this.quantities.set({});
  }
  retry(): void {
    this.catalog.retry();
  }

  private restore(): Readonly<Record<string, number>> {
    try {
      return parseCart(localStorage.getItem(CART_STORAGE_KEY));
    } catch {
      return {};
    }
  }
}
