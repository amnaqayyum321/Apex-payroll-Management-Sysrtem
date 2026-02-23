import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewLeaveTypeList } from './view-leave-type-list';

describe('ViewLeaveTypeList', () => {
  let component: ViewLeaveTypeList;
  let fixture: ComponentFixture<ViewLeaveTypeList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewLeaveTypeList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewLeaveTypeList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
