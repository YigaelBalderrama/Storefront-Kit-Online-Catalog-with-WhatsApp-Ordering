import { computed, inject, Injectable, InjectionToken, signal } from '@angular/core';
import { EVENTS } from '../data/events';
import { SPECIAL_EVENTS } from '../data/specialEvents';
import { Event } from '../models/event';

export const EVENTS_SOURCE = new InjectionToken<unknown>('EVENTS_SOURCE', {
  providedIn: 'root',
  factory: () => EVENTS,
});

export const SPECIAL_EVENTS_SOURCE = new InjectionToken<unknown>('SPECIAL_EVENTS_SOURCE', {
  providedIn: 'root',
  factory: () => SPECIAL_EVENTS,
});

function copyEventList(source: unknown): readonly Event[] {
  return Array.isArray(source) ? [...(source as readonly Event[])] : [];
}

@Injectable({ providedIn: 'root' })
export class EventService {
  readonly #events = signal<readonly Event[]>(copyEventList(inject(EVENTS_SOURCE)));
  readonly events = this.#events.asReadonly();
  readonly hasEvents = computed(() => Array.isArray(this.#events()) && this.#events().length > 0);
  readonly count = computed(() => (Array.isArray(this.#events()) ? this.#events().length : 0));
  readonly isEmpty = computed(() => !this.hasEvents());

  readonly #specialEvents = signal<readonly Event[]>(copyEventList(inject(SPECIAL_EVENTS_SOURCE)));
  readonly specialEvents = this.#specialEvents.asReadonly();
  readonly hasSpecialEvents = computed(
    () => Array.isArray(this.#specialEvents()) && this.#specialEvents().length > 0,
  );
  readonly specialCount = computed(() =>
    Array.isArray(this.#specialEvents()) ? this.#specialEvents().length : 0,
  );
  readonly isSpecialEmpty = computed(() => !this.hasSpecialEvents());

  getAll(): readonly Event[] {
    return Array.isArray(this.#events()) ? this.#events() : [];
  }

  getById(id: string): Event | undefined {
    return this.getAll().find((event) => event.id === id);
  }

  getAllSpecial(): readonly Event[] {
    return Array.isArray(this.#specialEvents()) ? this.#specialEvents() : [];
  }

  getSpecialById(id: string): Event | undefined {
    return this.getAllSpecial().find((event) => event.id === id);
  }
}
