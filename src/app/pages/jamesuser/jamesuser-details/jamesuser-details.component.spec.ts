import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { JamesuserDetailsComponent } from './jamesuser-details.component';

describe('JamesuserDetailsComponent', () => {
  let component: JamesuserDetailsComponent;
  let fixture: ComponentFixture<JamesuserDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JamesuserDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JamesuserDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
