import { Routes } from '@angular/router';
export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'catalogo' },
  {
    path: 'catalogo',
    loadChildren: () => import('./features/catalog/catalog.routes').then((m) => m.catalogRoutes),
  },
  {
    path: 'carrito',
    loadChildren: () => import('./features/cart/cart.routes').then((m) => m.cartRoutes),
  },
  { path: '**', redirectTo: 'catalogo' },
];
