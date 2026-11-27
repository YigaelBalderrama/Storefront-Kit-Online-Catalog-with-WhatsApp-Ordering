import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { Component, computed, inject, input, output } from '@angular/core';
import { NavigationEnd, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';
import { filter } from 'rxjs';
import { STORE_HEADER_COPY } from './store-header.copy';
@Component({
  selector: 'app-store-header',
  imports: [
    RouterLink,
    RouterLinkActive,
    MatButtonModule,
    MatTooltipModule,
    MatMenuModule,
    MatIconModule,
  ],
  templateUrl: './store-header.html',
  styleUrl: './store-header.scss',
})
export class StoreHeader {
  readonly logout = output<void>();
  readonly count = input.required<number>();
  private readonly router = inject(Router);
  private readonly navigationEnd = toSignal(
    this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd),
    ),
    { initialValue: null },
  );
  protected readonly eventsRouteActive = computed(() => {
    this.navigationEnd();
    return this.router.isActive(this.router.parseUrl('/eventos'), {
      paths: 'subset',
      queryParams: 'ignored',
      matrixParams: 'ignored',
      fragment: 'ignored',
    });
  });
  protected readonly copy = STORE_HEADER_COPY;
}
