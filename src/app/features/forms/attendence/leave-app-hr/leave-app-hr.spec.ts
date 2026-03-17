import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeaveAppHr } from './leave-app-hr';

describe('LeaveAppHr', () => {
  let component: LeaveAppHr;
  let fixture: ComponentFixture<LeaveAppHr>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LeaveAppHr]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LeaveAppHr);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
