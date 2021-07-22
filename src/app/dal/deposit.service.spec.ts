/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { DepositService } from './deposit.service';

describe('DepositService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DepositService]
    });
  });

  it('should ...', inject([DepositService], (service: DepositService) => {
    expect(service).toBeTruthy();
  }));
});
