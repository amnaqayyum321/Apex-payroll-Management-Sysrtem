import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewJobTitleList } from './view-job-title-list';

describe('ViewJobTitleList', () => {
  let component: ViewJobTitleList;
  let fixture: ComponentFixture<ViewJobTitleList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewJobTitleList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewJobTitleList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
