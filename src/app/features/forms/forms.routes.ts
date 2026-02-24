import { Routes } from '@angular/router';
import { LeaveApplication } from './attendence/leave-application/leave-application';
import { LeavesMasterData } from './attendence/leaves-master-data/leaves-master-data';
import { Employees } from './employees-masterdata/employees/employees';
import { Company } from './master-data/company/company';
import { Department } from './master-data/department/department';
import { Designation } from './master-data/designation/designation';
import { Leaves } from './attendence/leaves/leaves';
import { LoanTypes } from './master-data/loan-types/loan-types';
import { PayPeriod } from './master-data/pay-period/pay-period';
import { Projects } from './master-data/projects/projects';
import { WorkSchedule } from './master-data/work-schedule/work-schedule';
import { ViewDesignations } from './master-data/view-designations/view-designations';
import { ViewDepartmentList } from './master-data/View-Department/view-department-list';
import { ViewPayPeriod } from './master-data/view-Pay-period-List/view-pay-period';
import { ViewCompanyBranches } from './master-data/view-company-branches/view-company-branches';
import { ViewShifts } from './attendence/view-shifts/view-shifts';
import { Shift } from './attendence/shift/shift';
import { ViewWorkSchedule } from './master-data/view-work-schedule/view-work-schedule';
import { ViewProjectList } from './master-data/view-project-list/view-project-list';

export const routes: Routes = [
  {
    path: 'leave-application',
    component: LeaveApplication,
  },
  {
    path: 'leaves-master-data',
    component: LeavesMasterData,
  },
  {
    path: 'shift',
    component: Shift,
  },
  {
    path: 'employees',
    component: Employees,
  },
  {
    path: 'company',
    component: Company,
  },
  {
    path: 'department',
    component: Department,
  },
  {
    path: 'department/:id',
    component: Department,
  },
  {
    path: 'designation',
    component: Designation,
  },
  {
    path: 'leaves',
    component: Leaves,
  },
  {
    path: 'loan-types',
    component: LoanTypes,
  },
  {
    path: 'pay-period',
    component: PayPeriod,
  },
  {
    path: 'view-Pay-period-List',
    component: ViewPayPeriod,
  },
  {
    path: 'pay-period/:id',
    component: PayPeriod,
  },
  {
    path: 'projects',
    component: Projects,
  },
  {
    path: 'projects/:id',
    component: Projects,
  },
  {
    path: 'view-projects',
    component: ViewProjectList,
  },
  { path: 'work-schedule', component: WorkSchedule },
  { path: 'view-designations', component: ViewDesignations },

  {
    path: 'designation/:id',
    component: Designation,
  },
  {
    path: 'company/:id',
    component: Company,
  },

  { path: 'work-schedule', component: WorkSchedule },
  { path: 'view-department-list', component: ViewDepartmentList },
  { path: 'view-company-branches', component: ViewCompanyBranches },
  { path: 'view-shifts', component: ViewShifts },
  { path: 'shift/:id', component: Shift },
  { path: 'work-schedule/:id', component: WorkSchedule },
  { path: 'view-work-schedule', component: ViewWorkSchedule },
];
