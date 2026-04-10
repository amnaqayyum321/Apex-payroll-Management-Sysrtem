export const DEFAULT_SKILLS_FORM = {
  skillName: '',
  proficiencyLevel: '',
  yearsOfExperience: null as number | null,
  lastUsedYear: null as number | null,
  remarks: '',
  status: 'ACTIVE',
};

export const DEFAULT_EXP_FORM = {
  lineNumber: '',
  organizationName: '',
  roleName: '',
  startDate: '',
  endDate: '',
  currentlyWorking: false,
  responsibilities: '',
  status: 'ACTIVE',
  remarks: '',
};

export const DEFAULT_LEAVE_FORM = {
  leaveTypeName: '',
  leaveTypePublicId: '',
  totalLeavesPerYear: '',
  remarks: '',
  active: false,
};

export const DEFAULT_QUALIFICATION_FORM = {
  qualificationName: '',
  institutionName: '',
  passingYear: null as number | null,
  grade: '',
  resultStatus: '',
  status: 'ACTIVE',
  remarks: '',
};

export const DEFAULT_BANK_ACCOUNT_FORM = {
  bankName: '',
  branchCode: '',
  accountNumber: '',
  accountHolderName: '',
  iban: '',
  swiftCode: '',
  isPrimaryAccount: false,
  remarks: '',
  status: 'ACTIVE',
};

export const DEFAULT_DOCUMENT_FORM = {
  idTypePublicId: '',
  idTypeName: '',
  documentNumber: '',
  issuedDate: '',
  expiryDate: '',
  fileUrl: '',
  remarks: '',
  status: 'ACTIVE',
};

export const DEFAULT_BELONGING_FORM = {
  belongingname: '',
  belongingTypePublicId: '',
  serialNumber: '',
  issuedDate: '',
  returnDate: '',
  conditionStatus: '',
  remarks: '',
  status: 'ACTIVE',
};

export const DEFAULT_FAMILY_MEMBER_FORM = {
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
  status: 'ACTIVE',
  isEmergencyContact: false,
  remarks: '',
};

export const DEFAULT_POSITION_FORM = {
  departmentPublicId: '',
  designationPublicId: '',
  branchPublicId: '',
  reportingManagerPublicId: '',
  employeeGradePublicId: '',
  employeeCategoryPublicId: '',
  jobTitlePublicId: '',
  shiftPublicId: '',
  status: 'ACTIVE',
  workSchedulePublicId: '',
  positionCode: '',
  positionName: '',
  effectiveFrom: '',
  effectiveTo: '',
  isPrimaryPosition: false,
  remarks: '',
};
