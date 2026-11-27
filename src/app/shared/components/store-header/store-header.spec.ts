import { TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';
import { AuthService } from '../../../core/auth/auth.service';
import { routes } from '../../../app.routes';
import { StoreHeader } from './store-header';

describe('StoreHeader event menu', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StoreHeader],
      providers: [
        provideRouter(routes),
        { provide: AuthService, useValue: { validateSession: () => true } },
      ],
    }).compileComponents();
  });

  async function createHeader() {
    const fixture = TestBed.createComponent(StoreHeader);
    fixture.componentRef.setInput('count', 0);
    await fixture.whenStable();
    return fixture;
  }

  it('opens the two event options and exposes menu state accessibly', async () => {
    const fixture = await createHeader();
    const trigger = (fixture.nativeElement as HTMLElement).querySelector<HTMLButtonElement>(
      'button[aria-label="Abrir menú de eventos"]',
    );

    expect(trigger?.getAttribute('aria-haspopup')).toBe('menu');
    trigger?.click();
    await fixture.whenStable();

    const items = document.body.querySelectorAll<HTMLElement>('[role="menuitem"]');
    expect(trigger?.getAttribute('aria-expanded')).toBe('true');
    expect(items).toHaveLength(2);
    expect(items[0].textContent).toContain('Eventos');
    expect(items[1].textContent).toContain('Eventos especiales');
  });

  it('navigates to /eventos from the first menu option', async () => {
    const fixture = await createHeader();
    const trigger = (fixture.nativeElement as HTMLElement).querySelector<HTMLButtonElement>(
      'button[aria-label="Abrir menú de eventos"]',
    );
    trigger?.click();
    await fixture.whenStable();

    const eventsLink = document.body.querySelector<HTMLAnchorElement>(
      'a[mat-menu-item][href="/eventos"]',
    );
    expect(eventsLink?.textContent).toContain('Eventos');
    eventsLink?.click();
    await fixture.whenStable();

    expect(TestBed.inject(Router).url).toBe('/eventos');
    expect(trigger?.classList.contains('store-header__action--active')).toBe(true);
    expect(trigger?.getAttribute('aria-expanded')).toBe('false');
  });

  it('navigates to /eventos/especial and activates the book button', async () => {
    const fixture = await createHeader();
    const trigger = (fixture.nativeElement as HTMLElement).querySelector<HTMLButtonElement>(
      'button[aria-label="Abrir menú de eventos"]',
    );
    trigger?.click();
    await fixture.whenStable();

    const specialEventsLink = document.body.querySelector<HTMLAnchorElement>(
      'a[mat-menu-item][href="/eventos/especial"]',
    );
    expect(specialEventsLink?.textContent).toContain('Eventos especiales');
    specialEventsLink?.click();
    await fixture.whenStable();

    expect(TestBed.inject(Router).url).toBe('/eventos/especial');
    expect(trigger?.classList.contains('store-header__action--active')).toBe(true);
    expect(trigger?.getAttribute('aria-expanded')).toBe('false');

    trigger?.click();
    await fixture.whenStable();
    const eventsLink = document.body.querySelector<HTMLAnchorElement>(
      'a[mat-menu-item][href="/eventos"]',
    );
    const activeSpecialLink = document.body.querySelector<HTMLAnchorElement>(
      'a[mat-menu-item][href="/eventos/especial"]',
    );
    expect(eventsLink?.classList.contains('store-header__menu-item--active')).toBe(false);
    expect(activeSpecialLink?.classList.contains('store-header__menu-item--active')).toBe(true);
  });

  it('opens with the keyboard, moves between options, and returns focus on Escape', async () => {
    const fixture = await createHeader();
    const trigger = (fixture.nativeElement as HTMLElement).querySelector<HTMLButtonElement>(
      'button[aria-label="Abrir menú de eventos"]',
    );
    trigger?.focus();
    trigger?.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'Enter', keyCode: 13, bubbles: true }),
    );
    trigger?.click();
    await fixture.whenStable();

    const items = document.body.querySelectorAll<HTMLElement>('[role="menuitem"]');
    expect(trigger?.getAttribute('aria-expanded')).toBe('true');
    items[0].dispatchEvent(
      new KeyboardEvent('keydown', { key: 'ArrowDown', keyCode: 40, bubbles: true }),
    );
    await fixture.whenStable();
    expect(document.activeElement).toBe(items[1]);

    items[1].dispatchEvent(
      new KeyboardEvent('keydown', { key: 'Escape', keyCode: 27, bubbles: true }),
    );
    await fixture.whenStable();
    expect(trigger?.getAttribute('aria-expanded')).toBe('false');
    expect(document.activeElement).toBe(trigger);

    trigger?.dispatchEvent(new KeyboardEvent('keydown', { key: ' ', keyCode: 32, bubbles: true }));
    trigger?.click();
    await fixture.whenStable();
    expect(trigger?.getAttribute('aria-expanded')).toBe('true');
  });
});
