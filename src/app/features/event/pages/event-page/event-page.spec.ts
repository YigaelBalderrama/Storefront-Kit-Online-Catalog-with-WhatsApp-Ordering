import { Provider, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Event } from '../../models/event';
import { EventService } from '../../services/event';
import { EventPage } from './event-page';

async function createPage(providers: Provider[] = []) {
  await TestBed.configureTestingModule({ imports: [EventPage], providers }).compileComponents();
  const fixture = TestBed.createComponent(EventPage);
  await fixture.whenStable();
  return fixture;
}

describe('EventPage', () => {
  it('creates', async () => {
    const fixture = await createPage();

    expect(fixture.componentInstance).toBeTruthy();
  });

  it('renders one event card per event in the service', async () => {
    const fixture = await createPage();
    const events = TestBed.inject(EventService).getAll();

    const cards = (fixture.nativeElement as HTMLElement).querySelectorAll('app-event-card');
    expect(cards).toHaveLength(events.length);
  });

  it('passes the first and last service events to their cards', async () => {
    const fixture = await createPage();
    const events = TestBed.inject(EventService).getAll();
    const cards = (fixture.nativeElement as HTMLElement).querySelectorAll('app-event-card');

    expect(cards[0]?.querySelector('h2')?.textContent?.trim()).toBe(events[0].id);
    expect(cards[0]?.querySelector('img[alt^="Imagen del evento"]')?.getAttribute('src')).toBe(
      events[0].image,
    );
    expect(cards[cards.length - 1]?.querySelector('h2')?.textContent?.trim()).toBe(
      events[events.length - 1].id,
    );
    expect(
      cards[cards.length - 1]?.querySelector('img[alt^="Imagen del evento"]')?.getAttribute('src'),
    ).toBe(events[events.length - 1].image);
  });

  it('shows the empty state when the service has no events', async () => {
    const emptyService = { events: signal<readonly Event[]>([]).asReadonly() };
    const fixture = await createPage([{ provide: EventService, useValue: emptyService }]);
    const element: HTMLElement = fixture.nativeElement;

    expect(element.querySelectorAll('app-event-card')).toHaveLength(0);
    expect(element.querySelector('[role="status"]')?.textContent).toContain(
      'No hay eventos disponibles',
    );
  });

  it('uses list and listitem semantics', async () => {
    const fixture = await createPage();
    const element: HTMLElement = fixture.nativeElement;

    expect(element.querySelector('[role="list"]')).not.toBeNull();
    expect(element.querySelectorAll('[role="listitem"]')).toHaveLength(
      TestBed.inject(EventService).count(),
    );
  });
});
