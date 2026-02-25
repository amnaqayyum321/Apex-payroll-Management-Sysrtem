import { Routes } from '@angular/router';
import { CreateRequistion } from './Onboarding-forms/create-requistion/create-requistion';
import { ViewReqList } from './Onboarding-forms/view-req-list/view-req-list';


export const routes: Routes = [
  {
    path: 'create-requisition',
    component: CreateRequistion,
  },
    {
    path: 'view-req-list',
    component: ViewReqList,
  }
  
];
