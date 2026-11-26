import { Component, computed, input, output } from '@angular/core';
import { MatCheckboxModule } from '@angular/material/checkbox';

@Component({
  selector: 'app-sidebar',
  imports: [MatCheckboxModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
})
export class SidebarComponent {
  readonly heading = input.required<string>();
  readonly allSectionsLabel = input.required<string>();
  readonly sections = input.required<readonly string[]>();
  readonly selectedSections = input.required<readonly string[]>();
  readonly allSelected = input.required<boolean>();
  readonly showSections = input.required<boolean>();
  readonly sectionChange = output<{ section: string; checked: boolean }>();
  readonly allSectionsChange = output<boolean>();
  protected readonly partiallySelected = computed(
    () => this.selectedSections().length > 0 && !this.allSelected(),
  );

  protected changeSection(section: string, checked: boolean): void {
    this.sectionChange.emit({ section, checked });
  }

  protected changeAllSections(checked: boolean): void {
    this.allSectionsChange.emit(checked);
  }
}
