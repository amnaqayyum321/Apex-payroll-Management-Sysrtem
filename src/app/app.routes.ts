import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
// import { OfferCardComponent } from './shared/components/offer-card/offer-card.component';
// import { OffersComponent } from './features/offers/offers.component';
// import { ContactComponent } from './features/contact/contact.component';
// import { EmployesComponent } from './features/employes/employes.component';
// import { JobsComponent } from './features/jobs/jobs.component';

import { LayOutTwoComponent } from './shared/components/layouts/lay-out-two/lay-out-two.component';
import { LayOutOneComponent } from './shared/components/layouts/lay-out-one/lay-out-one.component';

// import { ViewAllFormSubmissionsComponent } from './view-all-form-submissions/view-all-form-submissions.component';

// import { ViewAllNotificationsComponent } from './view-all-notifications/view-all-notifications.component';

export const routes: Routes = [
  { path: '', redirectTo: 'log-in', pathMatch: 'full' },
  {
    path: 'panel', component: LayOutOneComponent, children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', loadChildren: () => import('./features/dashboard/dashboard-routes').then(m => m.routes) },
      { path: 'users-and-roles', loadChildren: () => import('./features/Users-And-Roles/users-roles.routes').then(m => m.routes) },
      { path: 'forms', loadChildren: () => import('./features/forms/forms.routes').then(m => m.routes) },
      {path: 'onboarding', loadChildren: () => import('./features/onboarding/onboarding.routes').then (m => m.routes) }









    ]
  },
  { path: '', loadChildren: () => import('../app/features/Auth/auth-routes').then(m => m.routes) },



];


