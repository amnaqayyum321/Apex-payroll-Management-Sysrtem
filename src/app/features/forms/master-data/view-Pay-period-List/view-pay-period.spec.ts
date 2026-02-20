import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewPayPeriod } from './view-pay-period';

describe('PayPeriod', () => {
  let component: ViewPayPeriod;
  let fixture: ComponentFixture<ViewPayPeriod>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewPayPeriod],
    }).compileComponents();

    fixture = TestBed.createComponent(ViewPayPeriod);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
