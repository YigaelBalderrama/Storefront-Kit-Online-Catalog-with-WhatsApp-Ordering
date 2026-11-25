import { AuthService } from './core/auth/auth.service';
import { AUTH_COPY } from './core/auth/auth.copy';
import { RouterLink } from '@angular/router';
import { Component, inject } from '@angular/core';
import { Cart } from './features/cart';
import { StoreHeader } from './shared/components/store-header/store-header';
import { RouterOutlet } from '@angular/router';
@Component({
  selector: 'app-root',
  imports: [RouterOutlet, StoreHeader, RouterLink],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected readonly auth = inject(AuthService);
  protected readonly copy = AUTH_COPY;
  protected readonly cart = inject(Cart);
}
