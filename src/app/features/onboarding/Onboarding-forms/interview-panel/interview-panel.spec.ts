import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InterviewPanel } from './interview-panel';

describe('InterviewPanel', () => {
  let component: InterviewPanel;
  let fixture: ComponentFixture<InterviewPanel>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InterviewPanel]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InterviewPanel);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
