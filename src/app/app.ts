import { Component, inject } from '@angular/core';
import { Cart } from './features/cart';
import { StoreHeader } from './shared/components/store-header/store-header';
import { RouterOutlet } from '@angular/router';
@Component({
  selector: 'app-root',
  imports: [RouterOutlet, StoreHeader],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected readonly cart = inject(Cart);
}
