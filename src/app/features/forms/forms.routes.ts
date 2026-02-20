import { Routes } from '@angular/router';
import { LeaveApplication } from './attendence/leave-application/leave-application';
import { LeavesMasterData } from './attendence/leaves-master-data/leaves-master-data';
import { Shifts } from './attendence/shifts/shifts';
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
import { ViewDepartmentList } from './master-data/View-Department/view-department-list/view-department-list';
import { ViewCompanyBranches } from './master-data/view-company-branches/view-company-branches';

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
    path: 'shifts',
    component: Shifts,
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
    path: 'projects',
    component: Projects,
  },
  { path: 'work-schedule', component: WorkSchedule },
  { path: 'view-designations', component: ViewDesignations },

  {
    path: 'designation/:id',
    component: Designation,
  },

  { path: 'work-schedule', component: WorkSchedule },
  { path: 'view-department-list', component: ViewDepartmentList },
  { path: 'view-company-branches', component: ViewCompanyBranches },

  

];
