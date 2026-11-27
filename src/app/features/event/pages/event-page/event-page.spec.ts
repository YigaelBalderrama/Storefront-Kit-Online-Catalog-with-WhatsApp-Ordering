import { TestBed } from '@angular/core/testing';
import { EVENTS } from '../../data/events';
import { EventPage } from './event-page';

describe('EventPage', () => {
  it('renders one event card for each event', async () => {
    await TestBed.configureTestingModule({ imports: [EventPage] }).compileComponents();
    const fixture = TestBed.createComponent(EventPage);
    await fixture.whenStable();

    const cards = (fixture.nativeElement as HTMLElement).querySelectorAll('app-event-card');
    expect(cards).toHaveLength(EVENTS.length);
  });
});
