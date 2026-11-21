import { Component, computed, input, output } from '@angular/core';
import { IconButton } from '../icon-button/icon-button';
import { PAGINATOR_COPY } from './paginator.copy';
@Component({
  selector: 'app-paginator',
  imports: [IconButton],
  templateUrl: './paginator.html',
  styleUrl: './paginator.scss',
})
export class Paginator {
  readonly total = input.required<number>();
  readonly page = input.required<number>();
  readonly pageSize = input.required<number>();
  readonly pageChanged = output<number>();
  protected readonly pages = computed(() => Math.max(1, Math.ceil(this.total() / this.pageSize())));
  protected readonly copy = PAGINATOR_COPY;
}
