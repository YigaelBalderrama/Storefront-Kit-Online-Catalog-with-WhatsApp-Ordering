import { Provider } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { EVENTS } from '../data/events';
import { SPECIAL_EVENTS } from '../data/specialEvents';
import { EventService, EVENTS_SOURCE, SPECIAL_EVENTS_SOURCE } from './event';

function createService(providers: Provider[] = []): EventService {
  TestBed.configureTestingModule({ providers: [EventService, ...providers] });
  return TestBed.inject(EventService);
}

describe('EventService', () => {
  it('creates', () => {
    expect(createService()).toBeTruthy();
  });

  it('exposes computed state for regular events', () => {
    const service = createService();

    expect(service.hasEvents()).toBe(true);
    expect(service.isEmpty()).toBe(false);
    expect(service.count()).toBe(EVENTS.length);
  });

  it('returns a copy of all regular events without exposing the source array', () => {
    const service = createService();
    const events = service.getAll();

    expect(events).toEqual(EVENTS);
    expect(events).not.toBe(EVENTS);
    expect(service.events()).not.toBe(EVENTS);
  });

  it('finds a regular event by id and returns undefined when it is absent', () => {
    const service = createService();

    expect(service.getById(EVENTS[0].id)).toEqual(EVENTS[0]);
    expect(service.getById('missing-event')).toBeUndefined();
  });

  it('exposes computed state for special events', () => {
    const service = createService();

    expect(service.hasSpecialEvents()).toBe(true);
    expect(service.isSpecialEmpty()).toBe(false);
    expect(service.specialCount()).toBe(SPECIAL_EVENTS.length);
  });

  it('returns a copy of all special events without exposing the source array', () => {
    const service = createService();
    const events = service.getAllSpecial();

    expect(events).toEqual(SPECIAL_EVENTS);
    expect(events).not.toBe(SPECIAL_EVENTS);
    expect(service.specialEvents()).not.toBe(SPECIAL_EVENTS);
  });

  it('finds a special event by id and returns undefined when it is absent', () => {
    const service = createService();

    expect(service.getSpecialById(SPECIAL_EVENTS[0].id)).toEqual(SPECIAL_EVENTS[0]);
    expect(service.getSpecialById('missing-event')).toBeUndefined();
  });

  it('treats empty regular and special sources as empty', () => {
    const service = createService([
      { provide: EVENTS_SOURCE, useValue: [] },
      { provide: SPECIAL_EVENTS_SOURCE, useValue: [] },
    ]);

    expect(service.hasEvents()).toBe(false);
    expect(service.isEmpty()).toBe(true);
    expect(service.count()).toBe(0);
    expect(service.getAll()).toEqual([]);
    expect(service.hasSpecialEvents()).toBe(false);
    expect(service.isSpecialEmpty()).toBe(true);
    expect(service.specialCount()).toBe(0);
    expect(service.getAllSpecial()).toEqual([]);
  });

  it('treats null and undefined sources as empty', () => {
    const service = createService([
      { provide: EVENTS_SOURCE, useValue: null },
      { provide: SPECIAL_EVENTS_SOURCE, useValue: undefined },
    ]);

    expect(service.hasEvents()).toBe(false);
    expect(service.isEmpty()).toBe(true);
    expect(service.count()).toBe(0);
    expect(service.getAll()).toEqual([]);
    expect(service.hasSpecialEvents()).toBe(false);
    expect(service.isSpecialEmpty()).toBe(true);
    expect(service.specialCount()).toBe(0);
    expect(service.getAllSpecial()).toEqual([]);
  });

  it('treats non-array sources as empty', () => {
    const service = createService([
      { provide: EVENTS_SOURCE, useValue: { events: EVENTS } },
      { provide: SPECIAL_EVENTS_SOURCE, useValue: { events: SPECIAL_EVENTS } },
    ]);

    expect(service.hasEvents()).toBe(false);
    expect(service.count()).toBe(0);
    expect(service.hasSpecialEvents()).toBe(false);
    expect(service.specialCount()).toBe(0);
  });
});
