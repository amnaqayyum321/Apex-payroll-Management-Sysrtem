import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewReqList } from './view-req-list';

describe('ViewReqList', () => {
  let component: ViewReqList;
  let fixture: ComponentFixture<ViewReqList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewReqList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewReqList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
