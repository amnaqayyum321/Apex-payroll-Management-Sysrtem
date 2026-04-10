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
  Qualification,
  Skill,
  Experience,
  BankAccount,
  EmployeeDocument,
  Belonging,
  FamilyMember,
  Position,
  Leave,
} from '../models/employee.interfaces';

export function mapQualificationToForm(qual: Qualification): QualificationForm {
  return {
    qualificationName: qual.qualificationName,
    institutionName: qual.institutionName,
    passingYear: qual.passingYear,
    grade: qual.grade,
    resultStatus: qual.resultStatus,
    status: qual.status,
    remarks: qual.remarks,
  };
}

export function mapSkillToForm(skill: Skill): SkillForm {
  return {
    skillName: skill.skillName,
    proficiencyLevel: skill.proficiencyLevel,
    yearsOfExperience: skill.yearsOfExperience,
    lastUsedYear: skill.lastUsedYear,
    status: skill.status,
    remarks: skill.remarks,
  };
}

export function mapExperienceToForm(exp: Experience): ExperienceForm {
  return {
    lineNumber: '',
    organizationName: exp.organizationName,
    roleName: exp.roleName,
    startDate: exp.startDate,
    endDate: exp.endDate,
    currentlyWorking: exp.currentlyWorking ? 'true' : 'false',
    responsibilities: exp.responsibilities,
    status: exp.status,
    remarks: exp.remarks,
  };
}

export function mapBankAccountToForm(acc: BankAccount): BankAccountForm {
  return {
    bankName: acc.bankName,
    branchCode: acc.branchCode,
    accountNumber: acc.accountNumber,
    accountHolderName: acc.accountHolderName,
    iban: acc.iban,
    swiftCode: acc.swiftCode,
    isPrimaryAccount: acc.isPrimaryAccount,
    status: acc.status,
    remarks: acc.remarks,
  };
}

export function mapDocumentToForm(doc: EmployeeDocument): EmployeeDocumentForm {
  return {
    idTypePublicId: doc.idTypePublicId,
    documentNumber: doc.documentNumber,
    issuedDate: doc.issuedDate,
    expiryDate: doc.expiryDate,
    fileUrl: doc.fileUrl,
    status: doc.status,
    remarks: doc.remarks,
  };
}

export function mapBelongingToForm(b: Belonging): BelongingForm {
  return {
    belongingname: b.belongingname,
    belongingTypePublicId: b.belongingTypePublicId,
    serialNumber: b.serialNumber,
    issuedDate: b.issuedDate,
    returnDate: b.returnDate,
    conditionStatus: b.conditionStatus,
    status: b.status,
    remarks: b.remarks,
  };
}

export function mapFamilyMemberToForm(fm: FamilyMember): FamilyMemberForm {
  return {
    memberName: fm.memberName,
    relationName: fm.relationName,
    dateOfBirth: fm.dateOfBirth,
    occupation: fm.occupation,
    contactNumber: fm.contactNumber,
    passportNo: fm.passportNo,
    passportExpiry: fm.passportExpiry,
    visaIqamaNo: fm.visaIqamaNo,
    visaIqamaExpiry: fm.visaIqamaExpiry,
    isDependent: fm.isDependent,
    isBeneficiary: fm.isBeneficiary,
    isEmergencyContact: fm.isEmergencyContact,
    status: fm.status,
    remarks: fm.remarks,
  };
}

export function mapPositionToForm(pos: Position): PositionForm {
  return {
    departmentPublicId: pos.departmentPublicId,
    designationPublicId: pos.designationPublicId,
    branchPublicId: pos.branchPublicId,
    reportingManagerPublicId: pos.reportingManagerPublicId,
    employeeGradePublicId: pos.employeeGradePublicId,
    employeeCategoryPublicId: pos.employeeCategoryPublicId,
    jobTitlePublicId: pos.jobTitlePublicId,
    shiftPublicId: pos.shiftPublicId,
    workSchedulePublicId: pos.workSchedulePublicId,
    positionCode: pos.positionCode,
    positionName: pos.positionName,
    effectiveFrom: pos.effectiveFrom,
    effectiveTo: pos.effectiveTo,
    isPrimaryPosition: pos.isPrimaryPosition,
    status: pos.status,
    remarks: pos.remarks,
  };
}

export function mapLeaveToForm(leave: Leave): LeaveForm {
  return {
    leaveTypeName: leave.leaveTypeName,
    leaveTypePublicId: leave.leaveTypePublicId,
    totalLeavesPerYear: leave.totalLeavesPerYear,
    remarks: leave.remarks,
    active: leave.active,
  };
}

// Position ke liye dropdown objects resolve karne ka helper
export function resolvePositionDropdowns(
  pos: Position,
  lists: {
    departmentList: any[];
    designationList: any[];
    companyBranchList: any[];
    EmployeeList: any[];
    EmployeeGradeList: any[];
    EmployeeCategoryList: any[];
    JobTitleList: any[];
    shiftList: any[];
    WorkScheduleList: any[];
  },
) {
  return {
    selectedDepartment:
      lists.departmentList?.find((d) => d.publicId === pos.departmentPublicId) ?? null,
    selectedDesignation:
      lists.designationList?.find((d) => d.publicId === pos.designationPublicId) ?? null,
    selcetedBranch: lists.companyBranchList?.find((b) => b.publicId === pos.branchPublicId) ?? null,
    selectedReportingManager:
      lists.EmployeeList?.find((e) => e.employeePublicId === pos.reportingManagerPublicId) ?? null,
    selectedEmployeeGrade:
      lists.EmployeeGradeList?.find((g) => g.publicId === pos.employeeGradePublicId) ?? null,
    SlectedEmployeeCategory:
      lists.EmployeeCategoryList?.find((c) => c.publicId === pos.employeeCategoryPublicId) ?? null,
    selectedJobTitle: lists.JobTitleList?.find((j) => j.publicId === pos.jobTitlePublicId) ?? null,
    selectedShift: lists.shiftList?.find((s) => s.publicId === pos.shiftPublicId) ?? null,
    selectedWorkSchedule:
      lists.WorkScheduleList?.find((ws) => ws.publicId === pos.workSchedulePublicId) ?? null,
  };
}
