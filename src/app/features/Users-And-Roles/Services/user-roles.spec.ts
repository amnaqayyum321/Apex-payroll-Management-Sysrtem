import { TestBed } from '@angular/core/testing';

import { UserRoles } from './user-roles';

describe('UserRoles', () => {
  let service: UserRoles;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserRoles);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
