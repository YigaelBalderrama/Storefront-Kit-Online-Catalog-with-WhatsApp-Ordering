import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { StoreIcon } from '../store-icon/store-icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';
import { STORE_HEADER_COPY } from './store-header.copy';
@Component({
  selector: 'app-store-header',
  imports: [RouterLink, StoreIcon, MatButtonModule, MatTooltipModule],
  templateUrl: './store-header.html',
  styleUrl: './store-header.scss',
})
export class StoreHeader {
  readonly count = input.required<number>();
  protected readonly copy = STORE_HEADER_COPY;
}
