import { AuthService } from './core/auth/auth.service';
import { provideAppConfig } from './core/config/app-config';
import { TestBed } from '@angular/core/testing';
import { App } from './app';
import { provideRouter } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { routes } from './app.routes';
import { appConfig } from './app.config';
import { EventCard } from './features/event/components/event-card/event-card';
import { EVENTS } from './features/event/data/events';
import { Event as StoreEvent } from './features/event/models/event';
import { EventPage } from './features/event/pages/event-page/event-page';

describe('App', () => {
  beforeEach(async () => {
    localStorage.clear();
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [
        ...appConfig.providers,
        provideRouter(routes),
        provideAppConfig({
          apiBaseUrl: '/api',
          useMockBackend: true,
          mockLatencyMs: 0,
          tokenStorageKey: 'test-token',
        }),
      ],
    }).compileComponents();
    await TestBed.inject(AuthService).login('admin@example.com', 'Admin123!');
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('opens the protected catalog', async () => {
    const harness = await RouterTestingHarness.create('/catalogo');
    await harness.fixture.whenStable();
    expect(harness.routeNativeElement?.querySelector('h1')?.textContent).toContain(
      'Encuentra tu próximo favorito',
    );
    expect(harness.routeNativeElement?.querySelectorAll('app-product-card').length).toBe(3);
    expect(harness.routeNativeElement?.textContent).toContain('Página 1 de 2');
    await harness.navigateByUrl('/catalogo?pagina=2&cantidad=3');
    await harness.fixture.whenStable();
    expect(harness.routeNativeElement?.textContent).toContain('Agotado');
    expect(harness.routeNativeElement?.textContent).toContain('Página 2 de 2');
  });

  it('filters sections from the URL and handles an unknown section', async () => {
    const harness = await RouterTestingHarness.create('/catalogo?seccion=Hogar&pagina=9');
    await harness.fixture.whenStable();
    expect(harness.routeNativeElement?.querySelectorAll('app-product-card').length).toBe(2);
    expect(harness.routeNativeElement?.querySelector('#products-title')?.textContent).toBe('Hogar');
    expect(harness.routeNativeElement?.querySelector('app-paginator')).toBeNull();
    await harness.navigateByUrl('/catalogo?seccion=unknown');
    await harness.fixture.whenStable();
    expect(harness.routeNativeElement?.querySelectorAll('app-product-card').length).toBe(3);
    expect(harness.routeNativeElement?.querySelector('#products-title')?.textContent).toBe(
      'Todos los productos',
    );
  });

  it('combines categories and supports clearing and selecting all categories', async () => {
    const harness = await RouterTestingHarness.create('/catalogo?seccion=Hogar&seccion=Moda');
    await harness.fixture.whenStable();
    expect(harness.routeNativeElement?.querySelectorAll('app-product-card').length).toBe(3);
    expect(harness.routeNativeElement?.querySelector('#products-title')?.textContent).toBe(
      'Hogar, Moda',
    );
    const all = harness.routeNativeElement?.querySelector<HTMLInputElement>('mat-checkbox input');
    expect(all?.indeterminate).toBe(true);
    all?.click();
    await harness.fixture.whenStable();
    expect(harness.routeNativeElement?.querySelector('#products-title')?.textContent).toBe(
      'Todos los productos',
    );
    all?.click();
    await harness.fixture.whenStable();
    expect(harness.routeNativeElement?.querySelectorAll('app-product-card').length).toBe(0);
    expect(harness.routeNativeElement?.textContent).toContain('Selecciona una o más secciones');
    await harness.navigateByUrl('/catalogo?seccion=');
    await harness.fixture.whenStable();
    expect(harness.routeNativeElement?.querySelectorAll('app-product-card').length).toBe(0);
  });
});

describe('Features / Events', () => {
  describe('EventCard', () => {
    beforeEach(async () => {
      await TestBed.configureTestingModule({ imports: [EventCard] }).compileComponents();
    });

    it('creates with an event', async () => {
      const event: StoreEvent = EVENTS[0];
      const fixture = TestBed.createComponent(EventCard);
      fixture.componentRef.setInput('event', event);
      await fixture.whenStable();

      expect(fixture.componentInstance).toBeTruthy();
    });

    it('displays the event title, day, description, and logo', async () => {
      const event: StoreEvent = EVENTS[0];
      const fixture = TestBed.createComponent(EventCard);
      fixture.componentRef.setInput('event', event);
      await fixture.whenStable();

      const element: HTMLElement = fixture.nativeElement;
      expect(element.querySelector('h2')?.textContent?.trim()).toBe(event.id);
      expect(element.querySelector('mat-card-subtitle')?.textContent).toContain(event.days);
      expect(element.querySelector('mat-card-content')?.textContent).toContain(event.description);
      expect(
        element.querySelector<HTMLImageElement>('.event-card__logo')?.getAttribute('src'),
      ).toBe(event.imageLogo);
    });

    it('renders the event image with its source and descriptive alt text', async () => {
      const event: StoreEvent = EVENTS[0];
      const fixture = TestBed.createComponent(EventCard);
      fixture.componentRef.setInput('event', event);
      await fixture.whenStable();

      const image = (fixture.nativeElement as HTMLElement).querySelector<HTMLImageElement>(
        '.event-card__image',
      );
      expect(image?.getAttribute('src')).toBe(event.image);
      expect(image?.getAttribute('alt')).toContain(event.id);
    });

    it('shows the placeholder when the event has no main image', async () => {
      const eventWithoutImage: StoreEvent = { ...EVENTS[0], image: '' };
      const fixture = TestBed.createComponent(EventCard);
      fixture.componentRef.setInput('event', eventWithoutImage);
      await fixture.whenStable();

      const element: HTMLElement = fixture.nativeElement;
      expect(element.querySelector('.event-card__placeholder')).not.toBeNull();
      expect(element.querySelector('.event-card__image')).toBeNull();
    });

    it('updates the DOM when the event input changes', async () => {
      const fixture = TestBed.createComponent(EventCard);
      fixture.componentRef.setInput('event', EVENTS[0]);
      await fixture.whenStable();

      fixture.componentRef.setInput('event', EVENTS[1]);
      await fixture.whenStable();

      const element: HTMLElement = fixture.nativeElement;
      expect(element.querySelector('h2')?.textContent?.trim()).toBe(EVENTS[1].id);
      expect(element.querySelector('mat-card-subtitle')?.textContent).toContain(EVENTS[1].days);
    });
  });

  describe('EventPage', () => {
    beforeEach(async () => {
      await TestBed.configureTestingModule({ imports: [EventPage] }).compileComponents();
    });

    it('creates', async () => {
      const fixture = TestBed.createComponent(EventPage);
      await fixture.whenStable();

      expect(fixture.componentInstance).toBeTruthy();
    });

    it('renders one event card per event in the list', async () => {
      const fixture = TestBed.createComponent(EventPage);
      await fixture.whenStable();

      expect(
        (fixture.nativeElement as HTMLElement).querySelectorAll('app-event-card'),
      ).toHaveLength(EVENTS.length);
    });

    it('passes the first and last events to their cards', async () => {
      const fixture = TestBed.createComponent(EventPage);
      await fixture.whenStable();

      const cards = (fixture.nativeElement as HTMLElement).querySelectorAll('app-event-card');
      const firstCard = cards[0];
      const lastCard = cards[cards.length - 1];

      expect(firstCard?.querySelector('h2')?.textContent?.trim()).toBe(EVENTS[0].id);
      expect(firstCard?.querySelector('mat-card-subtitle')?.textContent).toContain(EVENTS[0].days);
      expect(lastCard?.querySelector('h2')?.textContent?.trim()).toBe(EVENTS[EVENTS.length - 1].id);
      expect(lastCard?.querySelector('mat-card-subtitle')?.textContent).toContain(
        EVENTS[EVENTS.length - 1].days,
      );
    });

    it('shows the empty state without event cards when its list is empty', async () => {
      const fixture = TestBed.createComponent(EventPage);
      Object.defineProperty(fixture.componentInstance, 'events', {
        configurable: true,
        value: [] satisfies readonly StoreEvent[],
      });
      await fixture.whenStable();

      const element: HTMLElement = fixture.nativeElement;
      expect(element.querySelectorAll('app-event-card')).toHaveLength(0);
      expect(element.querySelector('[role="status"]')?.textContent).toContain(
        'No hay eventos disponibles',
      );
    });

    it('uses list and listitem semantics', async () => {
      const fixture = TestBed.createComponent(EventPage);
      await fixture.whenStable();

      const element: HTMLElement = fixture.nativeElement;
      expect(element.querySelector('[role="list"]')).not.toBeNull();
      expect(element.querySelectorAll('[role="listitem"]')).toHaveLength(EVENTS.length);
    });
  });
});
