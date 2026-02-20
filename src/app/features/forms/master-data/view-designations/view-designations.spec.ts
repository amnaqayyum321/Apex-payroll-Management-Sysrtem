import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewDesignations } from './view-designations';

describe('ViewDesignations', () => {
  let component: ViewDesignations;
  let fixture: ComponentFixture<ViewDesignations>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewDesignations]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewDesignations);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
