import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewInterviewFeedbackList } from './view-interview-feedback-list';

describe('ViewInterviewFeedbackList', () => {
  let component: ViewInterviewFeedbackList;
  let fixture: ComponentFixture<ViewInterviewFeedbackList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewInterviewFeedbackList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewInterviewFeedbackList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
