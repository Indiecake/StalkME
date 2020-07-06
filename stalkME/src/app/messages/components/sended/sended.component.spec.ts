import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SendedComponent } from './sended.component';

describe('SendedComponent', () => {
  let component: SendedComponent;
  let fixture: ComponentFixture<SendedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SendedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SendedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
