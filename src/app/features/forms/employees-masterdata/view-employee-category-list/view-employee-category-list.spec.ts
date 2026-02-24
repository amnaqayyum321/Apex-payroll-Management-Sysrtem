import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewEmployeeCategoryList } from './view-employee-category-list';

describe('ViewEmployeeCategoryList', () => {
  let component: ViewEmployeeCategoryList;
  let fixture: ComponentFixture<ViewEmployeeCategoryList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewEmployeeCategoryList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewEmployeeCategoryList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
