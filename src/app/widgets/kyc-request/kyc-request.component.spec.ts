import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KycRequestComponent } from './kyc-request.component';

describe('KycRequestComponent', () => {
  let component: KycRequestComponent;
  let fixture: ComponentFixture<KycRequestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KycRequestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KycRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
