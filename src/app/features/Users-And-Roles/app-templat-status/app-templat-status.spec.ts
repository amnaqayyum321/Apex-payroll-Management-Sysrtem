import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppTemplatStatus } from './app-templat-status';

describe('AppTemplatStatus', () => {
  let component: AppTemplatStatus;
  let fixture: ComponentFixture<AppTemplatStatus>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppTemplatStatus]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AppTemplatStatus);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
