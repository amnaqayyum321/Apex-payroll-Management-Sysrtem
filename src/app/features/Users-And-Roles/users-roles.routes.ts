import { Routes } from '@angular/router';
import { CreateRole } from './roles/create-role/create-role';
import { ViewRoles } from './roles/view-roles/view-roles';
import { ViewPermissions } from './roles/view-permissions/view-permissions';
import { CreateUser } from './users/create-user/create-user';
import { ViewUsers } from './users/view-users/view-users';

export const routes: Routes = [

  {
    path: 'create-role',
    component: CreateRole
  },
  {
    path: 'view-roles',
    component: ViewRoles
  },
  {
    path: 'view-permissions',
    component: ViewPermissions
  },
  {
    path: 'create-user',
    component: CreateUser
  }
  ,
  {
    path: 'view-users',
    component: ViewUsers
  }
];

