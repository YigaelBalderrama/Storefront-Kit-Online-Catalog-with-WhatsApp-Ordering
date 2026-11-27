import { Provider, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { EVENT_COPY } from '../../event.copy';
import { Event } from '../../models/event';
import { EventService } from '../../services/event';
import { SpecialEventPage } from './special-event-page';

async function createSpecialEventPage(providers: Provider[] = []) {
  await TestBed.configureTestingModule({
    imports: [SpecialEventPage],
    providers,
  }).compileComponents();
  const fixture = TestBed.createComponent(SpecialEventPage);
  await fixture.whenStable();
  return fixture;
}

describe('SpecialEventPage', () => {
  it('creates', async () => {
    const fixture = await createSpecialEventPage();

    expect(fixture.componentInstance).toBeTruthy();
  });

  it('renders one event card per special event in the service', async () => {
    const fixture = await createSpecialEventPage();
    const events = TestBed.inject(EventService).getAllSpecial();

    expect((fixture.nativeElement as HTMLElement).querySelectorAll('app-event-card')).toHaveLength(
      events.length,
    );
  });

  it('passes special event data to the first and last cards', async () => {
    const fixture = await createSpecialEventPage();
    const events = TestBed.inject(EventService).getAllSpecial();
    const cards = (fixture.nativeElement as HTMLElement).querySelectorAll('app-event-card');

    expect(cards[0]?.querySelector('h2')?.textContent?.trim()).toBe(events[0].id);
    expect(cards[0]?.querySelector('mat-card-content')?.textContent).toContain(
      events[0].description,
    );
    expect(cards[0]?.textContent).toContain(EVENT_COPY.noDate);
    expect(cards[cards.length - 1]?.querySelector('h2')?.textContent?.trim()).toBe(
      events[events.length - 1].id,
    );
    expect(cards[cards.length - 1]?.querySelector('mat-card-content')?.textContent).toContain(
      events[events.length - 1].description,
    );
  });

  it('shows the empty state when the service has no special events', async () => {
    const emptyService = { specialEvents: signal<readonly Event[]>([]).asReadonly() };
    const fixture = await createSpecialEventPage([
      { provide: EventService, useValue: emptyService },
    ]);
    const element: HTMLElement = fixture.nativeElement;

    expect(element.querySelectorAll('app-event-card')).toHaveLength(0);
    expect(element.querySelector('[role="status"]')?.textContent).toContain(
      'No hay eventos especiales disponibles',
    );
  });

  it('uses list and listitem semantics', async () => {
    const fixture = await createSpecialEventPage();
    const element: HTMLElement = fixture.nativeElement;

    expect(element.querySelector('[role="list"]')).not.toBeNull();
    expect(element.querySelectorAll('[role="listitem"]')).toHaveLength(
      TestBed.inject(EventService).specialCount(),
    );
  });
});
