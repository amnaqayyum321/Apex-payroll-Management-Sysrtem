import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewBelongingTypesList } from './view-belonging-types-list';

describe('ViewBelongingTypesList', () => {
  let component: ViewBelongingTypesList;
  let fixture: ComponentFixture<ViewBelongingTypesList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewBelongingTypesList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewBelongingTypesList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
