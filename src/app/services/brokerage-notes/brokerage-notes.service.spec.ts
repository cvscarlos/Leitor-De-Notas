import { TestBed } from '@angular/core/testing';

import { BrokerageNotesService } from './brokerage-notes.service';

describe('BrokerageNotesService', () => {
  let service: BrokerageNotesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BrokerageNotesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
