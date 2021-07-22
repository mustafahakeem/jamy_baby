import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormModelListComponent } from './form-model-list.component';

describe('FormModelListComponent', () => {
  let component: FormModelListComponent;
  let fixture: ComponentFixture<FormModelListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormModelListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormModelListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
