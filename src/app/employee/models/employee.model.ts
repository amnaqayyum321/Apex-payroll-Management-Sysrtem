export interface Qualification {
  lineNumber: number;
  qualificationName: string;
  institutionName: string;
  passingYear: number | null;
  grade: string;
  resultStatus: string;
  status: string;
  remarks: string;
}

export interface Skill {
  lineNumber: number;
  skillName: string;
  proficiencyLevel: string;
  yearsOfExperience: number | null;
  lastUsedYear: number | null;
  status: string;
  remarks: string;
}

export interface Experience {
  lineNumber: number;
  organizationName: string;
  roleName: string;
  startDate: string;
  endDate: string;
  currentlyWorking: boolean;
  responsibilities: string;
  status: string;
  remarks: string;
}

export interface Leave {
  leaveTypeName: string;
  leaveTypePublicId: string;
  totalLeavesPerYear: string;
  remarks: string;
  active: boolean;
}

export interface BankAccount {
  lineNumber: number;
  bankName: string;
  branchCode: string;
  accountNumber: string;
  accountHolderName: string;
  iban: string;
  swiftCode: string;
  isPrimaryAccount: boolean;
  status: string;
  remarks: string;
}

export interface EmployeeDocument {
  lineNumber: number;
  idTypePublicId: string;
  idTypeName: string;
  documentNumber: string;
  issuedDate: string;
  expiryDate: string;
  fileUrl: string;
  status: string;
  remarks: string;
}

export interface Belonging {
  lineNumber: number;
  belongingname: string;
  belongingTypePublicId: string;
  serialNumber: string;
  issuedDate: string;
  returnDate: string;
  conditionStatus: string;
  status: string;
  remarks: string;
}

export interface FamilyMember {
  lineNumber: number;
  memberName: string;
  relationName: string;
  dateOfBirth: string;
  occupation: string;
  contactNumber: string;
  passportNo: string;
  passportExpiry: string;
  visaIqamaNo: string;
  visaIqamaExpiry: string;
  isDependent: boolean;
  isBeneficiary: boolean;
  isEmergencyContact: boolean;
  status: string;
  remarks: string;
}

export interface Position {
  lineNumber: number;
  departmentPublicId: string;
  designationPublicId: string;
  branchPublicId: string;
  reportingManagerPublicId: string;
  employeeGradePublicId: string;
  employeeCategoryPublicId: string;
  jobTitlePublicId: string;
  shiftPublicId: string;
  workSchedulePublicId: string;
  positionCode: string;
  positionName: string;
  effectiveFrom: string;
  effectiveTo: string;
  isPrimaryPosition: boolean;
  status: string;
  remarks: string;
}

export interface Tab {
  id: string;
  title: string;
}
