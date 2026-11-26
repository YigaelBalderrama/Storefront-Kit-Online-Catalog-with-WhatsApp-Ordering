import { CurrencyPipe, NgOptimizedImage } from '@angular/common';
import { Component, ElementRef, inject, signal, viewChild } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatIconModule } from '@angular/material/icon';
import { IconButton } from '../../../../shared/components/icon-button/icon-button';
import { STORE_CONFIG } from '../../../../core/config/store.config';
import { Cart } from '../../services/cart';
import { CART_COPY } from '../../cart.copy';
@Component({
  selector: 'app-cart-page',
  imports: [
    CurrencyPipe,
    NgOptimizedImage,
    RouterLink,
    MatButtonModule,
    MatTooltipModule,
    MatIconModule,
    IconButton,
  ],
  templateUrl: './cart-page.html',
  styleUrl: './cart-page.scss',
})
export class CartPage {
  private readonly heading = viewChild.required<ElementRef<HTMLHeadingElement>>('heading');
  protected readonly cart = inject(Cart);
  protected readonly copy = CART_COPY;
  protected readonly config = STORE_CONFIG;
  protected readonly message = signal('');
  protected increase(id: string): void {
    this.message.set(this.cart.add(id) ? this.copy.updated : this.copy.unavailable);
  }
  protected decrease(id: string): void {
    this.cart.decrease(id);
    if (!this.cart.lines().some((line) => line.product.id === id))
      this.heading().nativeElement.focus();
    this.message.set(this.copy.updated);
  }
  protected remove(id: string): void {
    this.cart.remove(id);
    this.heading().nativeElement.focus();
    this.message.set(this.copy.removed);
  }
  protected clear(): void {
    this.cart.clear();
    this.heading().nativeElement.focus();
    this.message.set(this.copy.cleared);
  }
}
