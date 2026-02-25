import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InterviewFeedback } from './interview-feedback';

describe('InterviewFeedback', () => {
  let component: InterviewFeedback;
  let fixture: ComponentFixture<InterviewFeedback>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InterviewFeedback]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InterviewFeedback);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
