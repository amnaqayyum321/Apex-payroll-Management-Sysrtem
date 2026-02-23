import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewShifts } from './view-shifts';

describe('ViewShifts', () => {
  let component: ViewShifts;
  let fixture: ComponentFixture<ViewShifts>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewShifts]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewShifts);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
