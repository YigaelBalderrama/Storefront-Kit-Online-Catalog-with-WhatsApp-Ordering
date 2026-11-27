import { Routes } from '@angular/router';
import { EVENT_COPY } from './event.copy';
export const eventRoutes: Routes = [
  {
    path: '',
    title: EVENT_COPY.pageTitle,
    loadComponent: () => import('./pages/event-page/event-page').then((m) => m.EventPage),
  },
  {
    path: EVENT_COPY.specialEvent,
    loadComponent: () =>
      import('./pages/special-event-page/special-event-page').then((m) => m.SpecialEventPage),
  },
];
