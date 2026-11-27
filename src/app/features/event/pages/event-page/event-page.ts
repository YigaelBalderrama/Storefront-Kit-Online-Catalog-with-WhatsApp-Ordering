import { ChangeDetectionStrategy, Component, inject, Signal } from '@angular/core';
import { EventCard } from '../../components/event-card/event-card';
import { Event } from '../../models/event';
import { EventService } from '../../services/event';

@Component({
  selector: 'app-event-page',
  imports: [EventCard],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './event-page.html',
  styleUrl: './event-page.scss',
})
export class EventPage {
  private readonly eventService = inject(EventService);
  protected readonly events: Signal<readonly Event[]> = this.eventService.events;
}
