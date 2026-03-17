import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewApprovalStages } from './view-approval-stages';

describe('ViewApprovalStages', () => {
  let component: ViewApprovalStages;
  let fixture: ComponentFixture<ViewApprovalStages>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewApprovalStages]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewApprovalStages);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
