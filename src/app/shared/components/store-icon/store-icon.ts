import { Component, input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
export const ICON_PATHS = {
  cart: 'M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42l.9-2h7.45c.75 0 1.41-.41 1.75-1.03L21 5l-1-1H5.21l-.94-2H1zm16 16a2 2 0 1 0 0 4 2 2 0 0 0 0-4z',
  add: 'M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z',
  remove: 'M19 13H5v-2h14v2z',
  delete: 'M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zm13-15h-3.5l-1-1h-5l-1 1H5v2h14V4z',
  clear: 'M3 6h18v2H3V6zm2 4h14v10H5V10zm4-7h6v2H9V3z',
  back: 'M15.41 7.41 14 6l-6 6 6 6 1.41-1.41L10.83 12z',
  next: 'M8.59 16.59 10 18l6-6-6-6-1.41 1.41L13.17 12z',
  retry:
    'M17.65 6.35A7.95 7.95 0 0 0 12 4a8 8 0 1 0 7.93 9h-2.02A6 6 0 1 1 12 6c1.66 0 3.14.69 4.22 1.78L13 11h9V2z',
  shop: 'M3 3h18v2H3V3zm-1 4h20v6h-1v8h-2v-8h-4v8H3v-8H2V7zm3 6v6h8v-6H5z',
} as const;
export type StoreIconName = keyof typeof ICON_PATHS;
@Component({
  selector: 'app-store-icon',
  imports: [MatIconModule],
  templateUrl: './store-icon.html',
  styleUrl: './store-icon.scss',
  host: { 'aria-hidden': 'true' },
})
export class StoreIcon {
  readonly name = input.required<StoreIconName>();
  protected readonly paths = ICON_PATHS;
}
