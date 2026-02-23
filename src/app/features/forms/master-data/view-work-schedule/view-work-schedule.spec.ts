import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewWorkSchedule } from './view-work-schedule';

describe('ViewWorkSchedule', () => {
  let component: ViewWorkSchedule;
  let fixture: ComponentFixture<ViewWorkSchedule>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewWorkSchedule]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewWorkSchedule);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
