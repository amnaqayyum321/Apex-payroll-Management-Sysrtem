// ─────────────────────────────────────────────────────────────────────────────
// employees/state/employee-form.defaults.ts
// Factory functions that return fresh, empty form objects.
// Using functions (not constants) ensures every reset gets its own object —
// no accidental shared-reference bugs.
// ─────────────────────────────────────────────────────────────────────────────

import {
  QualificationForm,
  SkillForm,
  ExperienceForm,
  BankAccountForm,
  EmployeeDocumentForm,
  BelongingForm,
  FamilyMemberForm,
  PositionForm,
  LeaveForm,
} from '../models/employee.interfaces';

export const defaultQualificationForm = (): QualificationForm => ({
  qualificationName: '',
  institutionName: '',
  passingYear: null,
  grade: '',
  resultStatus: '',
  status: 'ACTIVE',
  remarks: '',
});

export const defaultSkillForm = (): SkillForm => ({
  skillName: '',
  proficiencyLevel: '',
  yearsOfExperience: null,
  lastUsedYear: null,
  status: 'ACTIVE',
  remarks: '',
});

export const defaultExperienceForm = (): ExperienceForm => ({
  lineNumber: '',
  organizationName: '',
  roleName: '',
  startDate: '',
  endDate: '',
  currentlyWorking: '',
  responsibilities: '',
  status: 'ACTIVE',
  remarks: '',
});

export const defaultBankAccountForm = (): BankAccountForm => ({
  bankName: '',
  branchCode: '',
  accountNumber: '',
  accountHolderName: '',
  iban: '',
  swiftCode: '',
  isPrimaryAccount: false,
  status: 'ACTIVE',
  remarks: '',
});

export const defaultDocumentForm = (): EmployeeDocumentForm => ({
  idTypePublicId: '',
  documentNumber: '',
  issuedDate: '',
  expiryDate: '',
  fileUrl: '',
  status: 'ACTIVE',
  remarks: '',
});

export const defaultBelongingForm = (): BelongingForm => ({
  belongingname: '',
  belongingTypePublicId: '',
  serialNumber: '',
  issuedDate: '',
  returnDate: '',
  conditionStatus: '',
  status: 'ACTIVE',
  remarks: '',
});

export const defaultFamilyMemberForm = (): FamilyMemberForm => ({
  memberName: '',
  relationName: '',
  dateOfBirth: '',
  occupation: '',
  contactNumber: '',
  passportNo: '',
  passportExpiry: '',
  visaIqamaNo: '',
  visaIqamaExpiry: '',
  isDependent: false,
  isBeneficiary: false,
  isEmergencyContact: false,
  status: 'ACTIVE',
  remarks: '',
});

export const defaultPositionForm = (): PositionForm => ({
  departmentPublicId: '',
  designationPublicId: '',
  branchPublicId: '',
  reportingManagerPublicId: '',
  employeeGradePublicId: '',
  employeeCategoryPublicId: '',
  jobTitlePublicId: '',
  shiftPublicId: '',
  workSchedulePublicId: '',
  positionCode: '',
  positionName: '',
  effectiveFrom: '',
  effectiveTo: '',
  isPrimaryPosition: false,
  status: 'ACTIVE',
  remarks: '',
});

export const defaultLeaveForm = (): LeaveForm => ({
  leaveTypeName: '',
  leaveTypePublicId: '',
  totalLeavesPerYear: '',
  remarks: '',
  active: false,
});
