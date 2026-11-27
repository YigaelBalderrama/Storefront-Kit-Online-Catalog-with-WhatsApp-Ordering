import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { AuthService } from '../../core/auth/auth.service';
import { routes } from '../../app.routes';

describe('Event routes', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideRouter(routes),
        { provide: AuthService, useValue: { validateSession: () => true } },
      ],
    });
  });

  it('loads the event page at /eventos', async () => {
    const harness = await RouterTestingHarness.create('/eventos');
    await harness.fixture.whenStable();

    expect(harness.routeNativeElement?.tagName.toLowerCase()).toBe('app-event-page');
  });

  it('loads the blank special event page at /eventos/especial', async () => {
    const harness = await RouterTestingHarness.create('/eventos/especial');
    await harness.fixture.whenStable();

    expect(harness.routeNativeElement?.tagName.toLowerCase()).toBe('app-special-event-page');
    expect(harness.routeNativeElement?.textContent?.trim()).toBe('');
  });
});
