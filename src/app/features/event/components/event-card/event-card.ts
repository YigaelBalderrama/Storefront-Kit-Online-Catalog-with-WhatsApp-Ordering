import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { EVENT_COPY } from '../../event.copy';
import { Event } from '../../models/event';

@Component({
  selector: 'app-event-card',
  imports: [MatCardModule, MatIconModule],
  templateUrl: './event-card.html',
  styleUrl: './event-card.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EventCard {
  readonly event = input.required<Event>();
  protected readonly copy = EVENT_COPY;
}
