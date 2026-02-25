import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewOffersList } from './view-offers-list';

describe('ViewOffersList', () => {
  let component: ViewOffersList;
  let fixture: ComponentFixture<ViewOffersList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewOffersList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewOffersList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
