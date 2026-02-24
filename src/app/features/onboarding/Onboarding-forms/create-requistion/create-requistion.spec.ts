import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateRequistion } from './create-requistion';

describe('CreateRequistion', () => {
  let component: CreateRequistion;
  let fixture: ComponentFixture<CreateRequistion>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateRequistion]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateRequistion);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
