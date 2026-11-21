import { Routes } from '@angular/router';
import { CART_COPY } from './cart.copy';
export const cartRoutes: Routes = [
  {
    path: '',
    title: CART_COPY.pageTitle,
    loadComponent: () => import('./pages/cart-page/cart-page').then((m) => m.CartPage),
  },
];
