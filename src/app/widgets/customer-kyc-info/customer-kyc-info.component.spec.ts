import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerKycInfoComponent } from './customer-kyc-info.component';

describe('CustomerKycInfoComponent', () => {
  let component: CustomerKycInfoComponent;
  let fixture: ComponentFixture<CustomerKycInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomerKycInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerKycInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
