import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OffersApproval } from './offers-approval';

describe('OffersApproval', () => {
  let component: OffersApproval;
  let fixture: ComponentFixture<OffersApproval>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OffersApproval]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OffersApproval);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
