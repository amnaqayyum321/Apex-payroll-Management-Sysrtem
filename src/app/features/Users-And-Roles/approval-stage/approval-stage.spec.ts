import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApprovalStage } from './approval-stage';

describe('ApprovalStage', () => {
  let component: ApprovalStage;
  let fixture: ComponentFixture<ApprovalStage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ApprovalStage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ApprovalStage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
