import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeesGrade } from './employees-grade';

describe('EmployeesGrade', () => {
  let component: EmployeesGrade;
  let fixture: ComponentFixture<EmployeesGrade>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmployeesGrade]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmployeesGrade);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
