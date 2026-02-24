import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewLeaves } from './view-leaves';

describe('ViewLeaves', () => {
  let component: ViewLeaves;
  let fixture: ComponentFixture<ViewLeaves>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewLeaves]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewLeaves);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
