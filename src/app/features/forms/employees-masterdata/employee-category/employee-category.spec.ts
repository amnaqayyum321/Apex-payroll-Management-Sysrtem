import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeCategory } from './employee-category';

describe('EmployeeCategory', () => {
  let component: EmployeeCategory;
  let fixture: ComponentFixture<EmployeeCategory>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmployeeCategory]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmployeeCategory);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
