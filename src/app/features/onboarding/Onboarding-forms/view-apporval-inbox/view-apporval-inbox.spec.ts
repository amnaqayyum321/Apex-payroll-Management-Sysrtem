import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewApporvalInbox } from './view-apporval-inbox';

describe('ViewApporvalInbox', () => {
  let component: ViewApporvalInbox;
  let fixture: ComponentFixture<ViewApporvalInbox>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewApporvalInbox]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewApporvalInbox);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
