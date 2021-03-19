import { TestBed } from '@angular/core/testing';

import { NumberFormatService } from './number-format.service';

describe('NumberFormatService', () => {
  let service: NumberFormatService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NumberFormatService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
