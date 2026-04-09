import { Tab } from '../models/employee.interfaces';
export const EMPLOYMENT_STATUS_OPTIONS = [
  'ONBOARDING',
  'PROBATION',
  'ACTIVE',
  'NOTICE_PERIOD',
  'INACTIVE',
] as const;
export const ONBOARDING_STATUS_OPTIONS = ['NOT_STARTED', 'IN_PROGRESS', 'COMPLETED'] as const;
export const EMPLOYEE_TYPE_OPTIONS = ['CONTRACT', 'PERMANENT', 'INTERNEE', 'TRAINEE'] as const;
export const PROFICIENCY_OPTIONS = ['BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'EXPERT'] as const;
export const STATUS_OPTIONS = ['ACTIVE', 'INACTIVE', 'CANCELLED'] as const;
export const RESULT_STATUS_OPTIONS = ['PASS', 'FAIL', 'AWAITING'] as const;
export const CONDITION_STATUS_OPTIONS = ['NEW', 'GOOD', 'FAIR', 'POOR', 'DAMAGED'] as const;
export const RELATION_OPTIONS = [
  'FATHER',
  'MOTHER',
  'SPOUSE',
  'CHILD',
  'SIBLING',
  'OTHER',
] as const;

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

export const TABS_PER_PAGE = 7;
export const DEFAULT_PAGE = 0;
export const DEFAULT_PAGE_SIZE = 100;
