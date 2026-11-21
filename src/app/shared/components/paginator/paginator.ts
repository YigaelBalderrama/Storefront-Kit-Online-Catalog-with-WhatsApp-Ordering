import { Component, computed, input, output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { PAGINATOR_COPY } from './paginator.copy';
@Component({
  selector: 'app-paginator',
  imports: [MatButtonModule, MatFormFieldModule, MatSelectModule],
  templateUrl: './paginator.html',
  styleUrl: './paginator.scss',
})
export class Paginator {
  readonly total = input.required<number>();
  readonly page = input.required<number>();
  readonly pageSize = input.required<number>();
  readonly pageSizes = input.required<readonly number[]>();
  readonly pageChanged = output<number>();
  readonly sizeChanged = output<number>();
  protected readonly pages = computed(() => Math.max(1, Math.ceil(this.total() / this.pageSize())));
  protected readonly copy = PAGINATOR_COPY;
}
