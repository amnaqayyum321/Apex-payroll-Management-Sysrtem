import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewTemplateApproval } from './view-template-approval';

describe('ViewTemplateApproval', () => {
  let component: ViewTemplateApproval;
  let fixture: ComponentFixture<ViewTemplateApproval>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewTemplateApproval]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewTemplateApproval);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
