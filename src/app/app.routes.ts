import { Routes } from '@angular/router';
import { authGuard } from './core/auth/auth.guard';
import { guestGuard } from './core/auth/guest.guard';
export const routes: Routes = [
  {
    path: 'login',
    canActivate: [guestGuard],
    loadComponent: () => import('./features/login/pages/login/login').then((m) => m.Login),
  },
  {
    path: '',
    canActivateChild: [authGuard],
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./features/dashboard/pages/dashboard/dashboard').then((m) => m.Dashboard),
      },
      {
        path: 'profile',
        loadComponent: () =>
          import('./features/profile/pages/profile/profile').then((m) => m.Profile),
      },
      {
        path: 'catalogo',
        loadChildren: () =>
          import('./features/catalog/catalog.routes').then((m) => m.catalogRoutes),
      },
      {
        path: 'carrito',
        loadChildren: () => import('./features/cart/cart.routes').then((m) => m.cartRoutes),
      },
      { path: '**', redirectTo: 'dashboard' },
    ],
  },
];
