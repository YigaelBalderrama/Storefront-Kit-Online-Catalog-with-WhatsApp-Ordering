import { ChangeDetectionStrategy, Component, inject, Signal } from '@angular/core';
import { EventCard } from '../../components/event-card/event-card';
import { Event } from '../../models/event';
import { EventService } from '../../services/event';

@Component({
  selector: 'app-special-event-page',
  imports: [EventCard],
  templateUrl: './special-event-page.html',
  styleUrl: './special-event-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SpecialEventPage {
  private readonly eventService = inject(EventService);
  protected readonly specialEvents: Signal<readonly Event[]> = this.eventService.specialEvents;
}
