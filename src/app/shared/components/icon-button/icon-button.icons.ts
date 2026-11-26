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

export type MaterialIconName = keyof typeof MATERIAL_ICONS;
