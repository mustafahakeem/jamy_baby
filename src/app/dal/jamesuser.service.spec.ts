import { TestBed, inject } from '@angular/core/testing';

import { JamesuserService } from './jamesuser.service';

describe('JamesuserService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [JamesuserService]
    });
  });

  it('should be created', inject([JamesuserService], (service: JamesuserService) => {
    expect(service).toBeTruthy();
  }));
});
