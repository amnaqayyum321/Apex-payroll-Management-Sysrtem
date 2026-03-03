import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CandidatesApproval } from './candidates-approval';

describe('CandidatesApproval', () => {
  let component: CandidatesApproval;
  let fixture: ComponentFixture<CandidatesApproval>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CandidatesApproval]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CandidatesApproval);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
