import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IDType } from './id-type';

describe('IDType', () => {
  let component: IDType;
  let fixture: ComponentFixture<IDType>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IDType]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IDType);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
