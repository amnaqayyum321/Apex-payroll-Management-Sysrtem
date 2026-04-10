import { Tab } from '../models/employee.model';

export const EMPLOYMENT_STATUS_OPTIONS = [
  'ONBOARDING',
  'PROBATION',
  'ACTIVE',
  'NOTICE_PERIOD',
  'INACTIVE',
];

export const ONBOARDING_STATUS_OPTIONS = ['NOT_STARTED', 'IN_PROGRESS', 'COMPLETED'];

export const EMPLOYEE_TYPE_OPTIONS = ['CONTRACT', 'PERMANENT', 'INTERNEE', 'TRAINEE'];

export const PROFICIENCY_OPTIONS = ['BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'EXPERT'];

export const STATUS_OPTIONS = ['ACTIVE', 'INACTIVE', 'CANCELLED'];

export const RESULT_STATUS_OPTIONS = ['PASS', 'FAIL', 'AWAITING'];

export const DOC_TYPE_OPTIONS = ['NATIONAL_ID', 'PASSPORT', 'DRIVING_LICENSE', 'VISA', 'OTHER'];

export const BELONGING_TYPE_OPTIONS = ['LAPTOP', 'MOBILE', 'ACCESS_CARD', 'VEHICLE', 'OTHER'];

export const CONDITION_STATUS_OPTIONS = ['NEW', 'GOOD', 'FAIR', 'POOR', 'DAMAGED'];

export const RELATION_OPTIONS = ['FATHER', 'MOTHER', 'SPOUSE', 'CHILD', 'SIBLING', 'OTHER'];

export const SIDEBAR_TABS: Tab[] = [
  { id: 'experience', title: 'Experience' },
  { id: 'skills', title: 'Skills' },
  { id: 'qualification', title: 'Qualification' },
  { id: 'bankAccounts', title: 'BankAccounts' },
  { id: 'documents', title: 'Documents' },
  { id: 'belongings', title: 'Belongings' },
  { id: 'familyMembers', title: 'FamilyMembers' },
  { id: 'positions', title: 'Positions' },
  { id: 'leaves', title: 'Leaves' },
];
