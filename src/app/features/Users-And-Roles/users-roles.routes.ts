import { Routes } from '@angular/router';
import { CreateRole } from './roles/create-role/create-role';
import { ViewRoles } from './roles/view-roles/view-roles';
import { ViewPermissions } from './roles/view-permissions/view-permissions';
import { CreateUser } from './users/create-user/create-user';
import { ViewUsers } from './users/view-users/view-users';
import { ApprovalTemplate } from './approval-template/approval-template';
import { ViewTemplateApproval } from './view-template-approval/view-template-approval';
import { ViewApprovalStages } from './view-approval-stages/view-approval-stages';
import { ApprovalStage } from './approval-stage/approval-stage';
import { AppTemplatStatus } from './app-templat-status/app-templat-status';

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
  { path: 'view-approval-stages', component: ViewApprovalStages },
  { path: 'approval-stage', component: ApprovalStage },
  { path: 'approval-Tem-Status', component: AppTemplatStatus },
  { path: 'approval-stage/:id', component: ApprovalStage },
];
