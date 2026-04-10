import { Tab } from './Candidate-interfaces';

export const SIDEBAR_TABS: Tab[] = [
  { id: 'experience', title: 'Experience' },
  { id: 'skills', title: 'Skills' },
  { id: 'qualification', title: 'Qualification' },
  { id: 'attachment', title: 'Attachment' },
];

export const GENDER_OPTIONS = [
  { value: 'MALE', label: 'Male' },
  { value: 'FEMALE', label: 'Female' },
  { value: 'OTHER', label: 'Other' },
];

export const RELIGION_OPTIONS = [
  { value: 'ISLAM', label: 'Islam' },
  { value: 'CHRISTIANITY', label: 'Christianity' },
  { value: 'HINDUISM', label: 'Hinduism' },
  { value: 'BUDDHISM', label: 'Buddhism' },
  { value: 'SIKHISM', label: 'Sikhism' },
  { value: 'JUDAISM', label: 'Judaism' },
  { value: 'OTHER', label: 'Other' },
];

export const SOURCE_OPTIONS = [
  { value: 'REQUISITION', label: 'Requisition' },
  { value: 'WALK_IN', label: 'Walk In' },
  { value: 'REFERRAL', label: 'Referral' },
  { value: 'PORTAL', label: 'Portal' },
  { value: 'OTHER', label: 'Other' },
];
