import { Routes } from '@angular/router';
import { CATALOG_COPY } from './catalog.copy';
export const catalogRoutes: Routes = [
  {
    path: '',
    title: CATALOG_COPY.pageTitle,
    loadComponent: () => import('./pages/catalog-page/catalog-page').then((m) => m.CatalogPage),
  },
];
