import { Routes } from '@angular/router';
import { CreateRequistion } from './Onboarding-forms/create-requistion/create-requistion';
import { ViewReqList } from './Onboarding-forms/view-req-list/view-req-list';
import { Candidate } from './Onboarding-forms/candidate/candidate';
import { ViewCandidateList } from './Onboarding-forms/view-candidate-list/view-candidate-list';
import { Interviews } from './Onboarding-forms/interviews/interviews';
import { ViewInterviewsList } from './Onboarding-forms/view-interviews-list/view-interviews-list';
import { CandidateApplication } from './Onboarding-forms/candidate-application/candidate-application';
import { ViewCandidateApplicationList } from './Onboarding-forms/view-candidate-application-list/view-candidate-application-list';
import { InterviewPanel } from './Onboarding-forms/interview-panel/interview-panel';
import { ViewInterviewPannelList } from './Onboarding-forms/view-interview-pannel-list/view-interview-pannel-list';
import { InterviewFeedback } from './Onboarding-forms/interview-feedback/interview-feedback';
import { ViewInterviewFeedbackList } from './Onboarding-forms/view-interview-feedback-list/view-interview-feedback-list';
import { Offer } from './Onboarding-forms/offer/offer';
import { ViewOffersList } from './Onboarding-forms/view-offers-list/view-offers-list';

export const routes: Routes = [
  {
    path: 'create-requisition',
    component: CreateRequistion,
  },
  {
    path: 'create-requisition/:id',
    component: CreateRequistion,
  },
  {
    path: 'view-req-list',
    component: ViewReqList,
  },
  {
    path: 'candidate',
    component: Candidate,
  },
  {
    path: 'candidate/:id',
    component: Candidate,
  },
  {
    path: 'view-candidate-list',
    component: ViewCandidateList,
  },
  {
    path: 'interviews',
    component: Interviews,
  },
  {
    path: 'interviews/:id',
    component: Interviews,
  },
  {
    path: 'view-interviews-list',
    component: ViewInterviewsList,
  },
  {
    path: 'candidate-application',
    component: CandidateApplication,
  },
  {
    path: 'candidate-application/:id',
    component: CandidateApplication,
  },
  {
    path: 'view-candidate-application-list',
    component: ViewCandidateApplicationList,
  },
  {
    path: 'interview-panel',
    component: InterviewPanel,
  },
  {
    path: 'interview-panel/:id',
    component: InterviewPanel,
  },
  {
    path: 'view-interview-panel-list',
    component: ViewInterviewPannelList,
  },
  {
    path: 'interview-feedback',
    component: InterviewFeedback,
  },
  {
    path: 'interview-feedback/:id',
    component: InterviewFeedback,
  },
  {
    path: 'view-interview-feedback-list',
    component: ViewInterviewFeedbackList,
  },
  {
    path: 'offers',
    component: Offer,
  },
  {
    path: 'offers/:id',
    component: Offer,
  },
  {
    path: 'view-offers-list',
    component: ViewOffersList,
  },
];
