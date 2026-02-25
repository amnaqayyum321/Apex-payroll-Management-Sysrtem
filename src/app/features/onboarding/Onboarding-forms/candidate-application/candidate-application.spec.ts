import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CandidateApplication } from './candidate-application';

describe('CandidateApplication', () => {
  let component: CandidateApplication;
  let fixture: ComponentFixture<CandidateApplication>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CandidateApplication]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CandidateApplication);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
