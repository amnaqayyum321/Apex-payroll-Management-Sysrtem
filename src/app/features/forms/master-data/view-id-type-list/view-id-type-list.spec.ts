import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewIDTypeList } from './view-id-type-list';

describe('ViewIDTypeList', () => {
  let component: ViewIDTypeList;
  let fixture: ComponentFixture<ViewIDTypeList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewIDTypeList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewIDTypeList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
