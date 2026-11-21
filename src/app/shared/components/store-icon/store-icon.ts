import { Component, input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

export const MATERIAL_ICONS = {
  cart: 'shopping_cart',
  add: 'add',
  remove: 'remove',
  delete: 'delete',
  clear: 'remove_shopping_cart',
  back: 'chevron_left',
  next: 'chevron_right',
  retry: 'refresh',
  shop: 'storefront',
} as const;

export type StoreIconName = keyof typeof MATERIAL_ICONS;

@Component({
  selector: 'app-store-icon',
  imports: [MatIconModule],
  templateUrl: './store-icon.html',
  styleUrl: './store-icon.scss',
  host: { 'aria-hidden': 'true' },
})
export class StoreIcon {
  readonly name = input.required<StoreIconName>();
  protected readonly icons = MATERIAL_ICONS;
}
