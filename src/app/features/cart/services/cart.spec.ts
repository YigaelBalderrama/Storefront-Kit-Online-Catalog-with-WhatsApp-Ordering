import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Catalog, Product } from '../../catalog';
import { Cart, parseCart } from './cart';
import { CART_STORAGE_KEY } from '../cart.config';

describe('Cart', () => {
  const product: Product = {
    id: 'test',
    name: 'Producto',
    description: '',
    category: '',
    image: '',
    price: 12.35,
    stock: 2,
  };
  const products = signal<readonly Product[]>([]);
  beforeEach(() => {
    localStorage.clear();
    products.set([product]);
    TestBed.configureTestingModule({
      providers: [
        {
          provide: Catalog,
          useValue: {
            products,
            loading: signal(false),
            error: signal(undefined),
          },
        },
      ],
    });
  });

  it('reserves stock, prevents overselling, and restores units when removing', () => {
    const cart = TestBed.inject(Cart);
    expect(cart.add('unknown')).toBe(false);
    expect(cart.add('test')).toBe(true);
    expect(cart.availableProducts()[0].stock).toBe(1);
    expect(cart.add('test')).toBe(true);
    expect(cart.add('test')).toBe(false);
    expect(cart.count()).toBe(2);
    expect(cart.total()).toBe(24.7);
    cart.decrease('test');
    expect(cart.total()).toBe(12.35);
    expect(cart.availableProducts()[0].stock).toBe(1);
    cart.remove('test');
    expect(cart.count()).toBe(0);
    expect(cart.availableProducts()[0].stock).toBe(2);
  });

  it('validates restored quantities and rechecks stock updates', () => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify({ test: 20, unknown: 5, invalid: -1 }));
    const cart = TestBed.inject(Cart);
    expect(cart.count()).toBe(2);
    products.set([{ ...product, stock: 1 }]);
    expect(cart.count()).toBe(1);
    expect(cart.total()).toBe(12.35);
    products.set([{ ...product, stock: 10 }]);
    expect(cart.count()).toBe(1);
    cart.clear();
    expect(cart.count()).toBe(0);
  });

  it('persists the cart and safely ignores malformed storage', async () => {
    expect(parseCart('broken')).toEqual({});
    expect(parseCart('[1,2]')).toEqual({});
    expect(parseCart('{"valid":2,"negative":-1,"fraction":1.5,"text":"2"}')).toEqual({ valid: 2 });
    const cart = TestBed.inject(Cart);
    cart.add('test');
    TestBed.tick();
    expect(JSON.parse(localStorage.getItem(CART_STORAGE_KEY)!)).toEqual({ test: 1 });
  });
});
