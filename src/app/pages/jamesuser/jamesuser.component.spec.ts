import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JamesuserComponent } from './jamesuser.component';

describe('JamesuserComponent', () => {
  let component: JamesuserComponent;
  let fixture: ComponentFixture<JamesuserComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JamesuserComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JamesuserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
