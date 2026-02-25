import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewCandidateApplicationList } from './view-candidate-application-list';

describe('ViewCandidateApplicationList', () => {
  let component: ViewCandidateApplicationList;
  let fixture: ComponentFixture<ViewCandidateApplicationList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewCandidateApplicationList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewCandidateApplicationList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
