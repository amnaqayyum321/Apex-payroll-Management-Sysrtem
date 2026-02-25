import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewCandidateList } from './view-candidate-list';

describe('ViewCandidateList', () => {
  let component: ViewCandidateList;
  let fixture: ComponentFixture<ViewCandidateList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewCandidateList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewCandidateList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
