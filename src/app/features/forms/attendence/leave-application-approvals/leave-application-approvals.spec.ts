import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeaveApplicationApprovals } from './leave-application-approvals';

describe('LeaveApplicationApprovals', () => {
  let component: LeaveApplicationApprovals;
  let fixture: ComponentFixture<LeaveApplicationApprovals>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LeaveApplicationApprovals]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LeaveApplicationApprovals);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
