import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MasterTable } from './master-table';

describe('MasterTable', () => {
  let component: MasterTable;
  let fixture: ComponentFixture<MasterTable>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MasterTable]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MasterTable);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
