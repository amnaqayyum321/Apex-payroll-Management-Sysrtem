import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewEmployeesGradeList } from './view-employees-grade-list';

describe('ViewEmployeesGradeList', () => {
  let component: ViewEmployeesGradeList;
  let fixture: ComponentFixture<ViewEmployeesGradeList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewEmployeesGradeList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewEmployeesGradeList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
