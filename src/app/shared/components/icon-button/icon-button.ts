import { Component, input, output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatIconModule } from '@angular/material/icon';
import { MATERIAL_ICONS, MaterialIconName } from './icon-button.icons';
@Component({
  selector: 'app-icon-button',
  imports: [MatButtonModule, MatTooltipModule, MatIconModule],
  templateUrl: './icon-button.html',
  styleUrl: './icon-button.scss',
})
export class IconButton {
  protected readonly icons = MATERIAL_ICONS;
  readonly icon = input.required<MaterialIconName>();
  readonly label = input.required<string>();
  readonly tooltip = input<string>();
  readonly disabled = input(false);
  readonly activated = output<void>();
  protected activate(): void {
    if (!this.disabled()) this.activated.emit();
  }
}
