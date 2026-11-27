import { Component, computed, input, output, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CATALOG_COPY } from '../../catalog.copy';

@Component({
  selector: 'app-sidebar',
  imports: [MatButtonModule, MatCheckboxModule, MatIconModule, MatTooltipModule],
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
  readonly collapsed = input(false);
  readonly sectionChange = output<{ section: string; checked: boolean }>();
  readonly allSectionsChange = output<boolean>();
  readonly collapsedChange = output<boolean>();
  protected readonly listFolded = signal(this.readStoredState('catalog-sidebar-list-folded'));
  protected readonly listEffectivelyFolded = computed(() => this.listFolded() && !this.collapsed());
  protected readonly copy = CATALOG_COPY;
  protected readonly partiallySelected = computed(
    () => this.selectedSections().length > 0 && !this.allSelected(),
  );

  protected changeSection(section: string, checked: boolean): void {
    this.sectionChange.emit({ section, checked });
  }

  protected changeAllSections(checked: boolean): void {
    this.allSectionsChange.emit(checked);
  }

  protected toggleCollapsed(): void {
    this.collapsedChange.emit(!this.collapsed());
  }

  protected toggleList(): void {
    const listFolded = !this.listFolded();
    this.listFolded.set(listFolded);
    this.storeState('catalog-sidebar-list-folded', listFolded);
  }

  private readStoredState(key: string): boolean {
    try {
      return typeof localStorage !== 'undefined' && localStorage.getItem(key) === 'true';
    } catch {
      return false;
    }
  }

  private storeState(key: string, value: boolean): void {
    try {
      if (typeof localStorage !== 'undefined') localStorage.setItem(key, String(value));
    } catch {
      return;
    }
  }
}
