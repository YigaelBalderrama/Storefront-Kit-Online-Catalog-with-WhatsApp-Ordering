import { ChangeDetectionStrategy, Component } from '@angular/core';
import { EventCard } from '../../components/event-card/event-card';
import { EVENTS } from '../../data/events';
import { Event } from '../../models/event';

@Component({
  selector: 'app-event-page',
  imports: [EventCard],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './event-page.html',
  styleUrl: './event-page.scss',
})
export class EventPage {
  protected readonly events: readonly Event[] = EVENTS;
}
