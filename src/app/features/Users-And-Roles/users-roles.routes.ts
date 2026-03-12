import { Routes } from '@angular/router';
import { CreateRole } from './roles/create-role/create-role';
import { ViewRoles } from './roles/view-roles/view-roles';
import { ViewPermissions } from './roles/view-permissions/view-permissions';
import { CreateUser } from './users/create-user/create-user';
import { ViewUsers } from './users/view-users/view-users';
import { ApprovalTemplate } from './approval-template/approval-template';
import { ViewTemplateApproval } from './view-template-approval/view-template-approval';

export const routes: Routes = [
  {
    path: 'create-role',
    component: CreateRole,
  },
  {
    path: 'view-roles',
    component: ViewRoles,
  },
  {
    path: 'view-permissions',
    component: ViewPermissions,
  },
  {
    path: 'create-user',
    component: CreateUser,
  },
  {
    path: 'view-users',
    component: ViewUsers,
  },
  { path: 'approval-template', component: ApprovalTemplate },
  { path: 'approval-template/:id', component: ApprovalTemplate },
  { path: 'view-template-approval', component: ViewTemplateApproval },
];
