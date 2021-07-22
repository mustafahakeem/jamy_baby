import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KycCustomerDetailComponent } from './kyc-customer-detail.component';

describe('KycCustomerDetailComponent', () => {
  let component: KycCustomerDetailComponent;
  let fixture: ComponentFixture<KycCustomerDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KycCustomerDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KycCustomerDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
