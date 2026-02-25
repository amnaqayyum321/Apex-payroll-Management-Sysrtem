import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewInterviewPannelList } from './view-interview-pannel-list';

describe('ViewInterviewPannelList', () => {
  let component: ViewInterviewPannelList;
  let fixture: ComponentFixture<ViewInterviewPannelList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewInterviewPannelList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewInterviewPannelList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
