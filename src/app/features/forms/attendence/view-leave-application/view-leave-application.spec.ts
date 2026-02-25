import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewLeaveApplication } from './view-leave-application';

describe('ViewLeaveApplication', () => {
  let component: ViewLeaveApplication;
  let fixture: ComponentFixture<ViewLeaveApplication>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewLeaveApplication]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewLeaveApplication);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
