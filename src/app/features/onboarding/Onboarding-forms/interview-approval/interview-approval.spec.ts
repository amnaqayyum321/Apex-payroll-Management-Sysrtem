import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InterviewApproval } from './interview-approval';

describe('InterviewApproval', () => {
  let component: InterviewApproval;
  let fixture: ComponentFixture<InterviewApproval>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InterviewApproval]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InterviewApproval);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
