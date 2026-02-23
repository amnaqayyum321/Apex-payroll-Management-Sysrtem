import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewProjectList } from './view-project-list';

describe('ViewProjectList', () => {
  let component: ViewProjectList;
  let fixture: ComponentFixture<ViewProjectList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewProjectList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewProjectList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
