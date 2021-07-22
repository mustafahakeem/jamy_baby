import { TestBed, inject } from '@angular/core/testing';

import { LendingService } from './lending.service';

describe('LendingService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LendingService]
    });
  });

  it('should be created', inject([LendingService], (service: LendingService) => {
    expect(service).toBeTruthy();
  }));
});
