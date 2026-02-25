import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewInterviewsList } from './view-interviews-list';

describe('ViewInterviewsList', () => {
  let component: ViewInterviewsList;
  let fixture: ComponentFixture<ViewInterviewsList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewInterviewsList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewInterviewsList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
