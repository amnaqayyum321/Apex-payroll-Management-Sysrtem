import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewRoles } from './view-roles';

describe('ViewRoles', () => {
  let component: ViewRoles;
  let fixture: ComponentFixture<ViewRoles>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewRoles]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewRoles);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
