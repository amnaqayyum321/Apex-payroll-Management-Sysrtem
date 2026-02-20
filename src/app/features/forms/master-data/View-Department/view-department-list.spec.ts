import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewDepartmentList } from './view-department-list';

describe('ViewDepartmentList', () => {
  let component: ViewDepartmentList;
  let fixture: ComponentFixture<ViewDepartmentList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewDepartmentList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewDepartmentList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
