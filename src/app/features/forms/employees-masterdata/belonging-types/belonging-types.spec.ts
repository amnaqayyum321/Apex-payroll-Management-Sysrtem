import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BelongingTypes } from './belonging-types';

describe('BelongingTypes', () => {
  let component: BelongingTypes;
  let fixture: ComponentFixture<BelongingTypes>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BelongingTypes]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BelongingTypes);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
