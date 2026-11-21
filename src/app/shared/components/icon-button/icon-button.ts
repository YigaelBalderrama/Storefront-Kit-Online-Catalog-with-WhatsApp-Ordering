import { Component, input, output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { StoreIcon, StoreIconName } from '../store-icon/store-icon';
@Component({
  selector: 'app-icon-button',
  imports: [MatButtonModule, MatTooltipModule, StoreIcon],
  templateUrl: './icon-button.html',
  styleUrl: './icon-button.scss',
})
export class IconButton {
  readonly icon = input.required<StoreIconName>();
  readonly label = input.required<string>();
  readonly tooltip = input<string>();
  readonly disabled = input(false);
  readonly activated = output<void>();
  protected activate(): void {
    if (!this.disabled()) this.activated.emit();
  }
}
