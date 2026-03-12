import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApprovalInbox } from './approval-inbox';

describe('ApprovalInbox', () => {
  let component: ApprovalInbox;
  let fixture: ComponentFixture<ApprovalInbox>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ApprovalInbox]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ApprovalInbox);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
