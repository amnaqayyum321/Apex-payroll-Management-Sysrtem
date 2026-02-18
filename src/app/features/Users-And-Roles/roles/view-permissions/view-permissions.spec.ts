import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewPermissions } from './view-permissions';

describe('ViewPermissions', () => {
  let component: ViewPermissions;
  let fixture: ComponentFixture<ViewPermissions>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewPermissions]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewPermissions);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
