import { TestBed } from '@angular/core/testing';
import { SpecialEventPage } from './special-event-page';

describe('SpecialEventPage', () => {
  it('creates', async () => {
    await TestBed.configureTestingModule({ imports: [SpecialEventPage] }).compileComponents();
    const fixture = TestBed.createComponent(SpecialEventPage);
    await fixture.whenStable();

    expect(fixture.componentInstance).toBeTruthy();
  });
});
