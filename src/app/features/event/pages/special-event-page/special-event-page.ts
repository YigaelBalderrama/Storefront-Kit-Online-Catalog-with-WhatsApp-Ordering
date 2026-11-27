import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-special-event-page',
  templateUrl: './special-event-page.html',
  styleUrl: './special-event-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SpecialEventPage {}
