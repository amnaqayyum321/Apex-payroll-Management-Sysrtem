import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewPayElementList } from './view-pay-element-list';

describe('ViewPayElementList', () => {
  let component: ViewPayElementList;
  let fixture: ComponentFixture<ViewPayElementList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewPayElementList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewPayElementList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
