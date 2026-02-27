import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequisitionsApproval } from './requisitions-approval';

describe('RequisitionsApproval', () => {
  let component: RequisitionsApproval;
  let fixture: ComponentFixture<RequisitionsApproval>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RequisitionsApproval]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RequisitionsApproval);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
