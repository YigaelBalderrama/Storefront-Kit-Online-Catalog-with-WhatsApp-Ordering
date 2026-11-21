import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { ProductCard } from '../../components/product-card/product-card';
import { Catalog } from '../../services/catalog';
import { CATALOG_COPY } from '../../catalog.copy';
@Component({
  selector: 'app-catalog-page',
  imports: [ProductCard, MatButtonModule],
  templateUrl: './catalog-page.html',
  styleUrl: './catalog-page.scss',
})
export class CatalogPage {
  protected readonly priorityImageCount = 3;
  protected readonly catalog = inject(Catalog);
  protected readonly copy = CATALOG_COPY;
}
