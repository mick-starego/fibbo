import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DisplayNodeComponent } from './display-node.component';

describe('DisplayNodeComponent', () => {
  let component: DisplayNodeComponent;
  let fixture: ComponentFixture<DisplayNodeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DisplayNodeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DisplayNodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
