import { Product } from '../../catalog';
export interface CartLine {
  readonly product: Product;
  readonly quantity: number;
  readonly subtotal: number;
  readonly available: number;
}
