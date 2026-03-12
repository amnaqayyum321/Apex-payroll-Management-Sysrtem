import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApprovalTemplate } from './approval-template';

describe('ApprovalTemplate', () => {
  let component: ApprovalTemplate;
  let fixture: ComponentFixture<ApprovalTemplate>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ApprovalTemplate]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ApprovalTemplate);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
