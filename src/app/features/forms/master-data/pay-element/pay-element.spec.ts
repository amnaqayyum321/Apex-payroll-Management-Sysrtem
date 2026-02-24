import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PayElement } from './pay-element';

describe('PayElement', () => {
  let component: PayElement;
  let fixture: ComponentFixture<PayElement>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PayElement]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PayElement);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
