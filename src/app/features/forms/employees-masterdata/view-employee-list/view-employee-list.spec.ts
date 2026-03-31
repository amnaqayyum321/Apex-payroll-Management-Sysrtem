import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewEmployeeList } from './view-employee-list';

describe('ViewEmployeeList', () => {
  let component: ViewEmployeeList;
  let fixture: ComponentFixture<ViewEmployeeList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewEmployeeList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewEmployeeList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
