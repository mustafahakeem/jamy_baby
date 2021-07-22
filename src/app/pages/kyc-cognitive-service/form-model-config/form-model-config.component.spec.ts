import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormModelConfigComponent } from './form-model-config.component';

describe('FormModelConfigComponent', () => {
  let component: FormModelConfigComponent;
  let fixture: ComponentFixture<FormModelConfigComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormModelConfigComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormModelConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
