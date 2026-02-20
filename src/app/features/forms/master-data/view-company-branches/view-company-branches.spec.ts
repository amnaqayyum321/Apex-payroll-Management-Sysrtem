import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewCompanyBranches } from './view-company-branches';

describe('ViewCompanyBranches', () => {
  let component: ViewCompanyBranches;
  let fixture: ComponentFixture<ViewCompanyBranches>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewCompanyBranches]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewCompanyBranches);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
