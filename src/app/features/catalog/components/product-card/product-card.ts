import { CurrencyPipe, NgOptimizedImage } from '@angular/common';
import { Component, input, output } from '@angular/core';
import { IconButton } from '../../../../shared/components/icon-button/icon-button';
import { MatCardModule } from '@angular/material/card';
import { STORE_CONFIG } from '../../../../core/config/store.config';
import { CATALOG_COPY } from '../../catalog.copy';
import { Product } from '../../models/product';
@Component({
  selector: 'app-product-card',
  imports: [CurrencyPipe, NgOptimizedImage, MatCardModule, IconButton],
  templateUrl: './product-card.html',
  styleUrl: './product-card.scss',
})
export class ProductCard {
  readonly product = input.required<Product>();
  readonly priority = input(false);
  readonly addToCart = output<string>();
  protected readonly config = STORE_CONFIG;
  protected readonly copy = CATALOG_COPY;
}
