import { TestBed, inject } from '@angular/core/testing';

import { KycCognitiveService } from './kyc-cognitive.service';

describe('KycCognitiveService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [KycCognitiveService]
    });
  });

  it('should be created', inject([KycCognitiveService], (service: KycCognitiveService) => {
    expect(service).toBeTruthy();
  }));
});
