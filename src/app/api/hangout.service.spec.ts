import { TestBed } from '@angular/core/testing';

import { HangoutService } from './hangout.service';

describe('HangoutService', () => {
  let service: HangoutService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HangoutService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
