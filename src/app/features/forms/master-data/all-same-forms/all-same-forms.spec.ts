import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllSameForms } from './all-same-forms';

describe('AllSameForms', () => {
  let component: AllSameForms;
  let fixture: ComponentFixture<AllSameForms>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AllSameForms]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AllSameForms);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
