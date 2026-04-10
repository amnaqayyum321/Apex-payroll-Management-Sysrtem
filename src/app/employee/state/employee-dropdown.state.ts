/**
 * emp.dropdown.ts
 *
 * Abstract mixin for all dropdown toggle + select methods.
 * Employees component extends EmpFormList which extends this.
 * HTML bindings stay 100% unchanged.
 *
 * NOTE: All open-flags and selected-value properties are already
 * declared in EmpFormList (shared base). This class only adds methods.
 */

export abstract class EmpDropdown {
  // ─── Open/Close Flags (must match exactly what HTML uses) ──────────────────
  isEmploymentStatusOpen = false;
  isLeaveTypeOpen = false;
  isOnboardingStatusOpen = false;
  isEmployeeTypeOpen = false;
  isProficiencyOpen = false;
  isSkillStatusOpen = false;
  isResultStatusOpen = false;
  isQualificationStatusOpen = false;
  isBankStatusOpen = false;
  isDocTypeOpen = false;
  isDocStatusOpen = false;
  isBelongingTypeOpen = false;
  isConditionStatusOpen = false;
  isRelationOpen = false;
  isDepartmentOpen = false;
  isDesignatiomOpen = false;
  isBranchOpen = false;
  isReportingManagerOpen = false;
  isEmployeeCategoryOpen = false;
  isEmployeeGradeOpen = false;
  isJobTitleOpen = false;
  isShiftOpen = false;
  isWorkScheduleOpen = false;
  isFamilyMemberStatusOpen = false;
  isPositionStatusOpen = false;
  isBelongingStatusOpen = false;
  isExperienceStatusOpen = false;

  // ─── Selected primitive values ─────────────────────────────────────────────
  selectedEmploymentStatus = '';
  selectedOnboardingStatus = '';
  selectedEmployeeType = '';

  // ─── Selected values (concrete in EmpFormList subclass) ──────────────────
  selectedResultStatus = '';
  selectedQualificationStatus = '';
  selectedProficiency = '';
  selectedSkillStatus = '';
  selectedExperienceStatus = '';
  selectedBankStatus = '';
  selectedDocType = '';
  selectedDocStatus = '';
  selectedBelongingType = '';
  selectedConditionStatus = '';
  selectedBelongingStatus = '';
  selectedRelation = '';
  selectedFamilyMemberStatus = '';
  selectedPositionStatus = '';
  selectLeaveType = '';
  selectedDepartment: any = null;
  selectedDesignation: any = null;
  selcetedBranch: any = null;
  selectedReportingManager: any = null;
  SlectedEmployeeCategory: any = null;
  selectedEmployeeGrade: any = null;
  selectedJobTitle: any = null;
  selectedShift: any = null;
  selectedWorkSchedule: any = null;

  // ─── Core employee string values (concrete in Employees component) ─────────
  abstract employmentStatus: string;
  abstract onboardingStatus: string;
  abstract employeeType: string;

  // ─── Form references (concrete in EmpFormList subclass) ───────────────────
  abstract skillsForm: { proficiencyLevel: string; status: string };
  abstract expform: { status: string };
  abstract familyMemberForm: { status: string; relationName: string };
  abstract positionForm: {
    status: string;
    departmentPublicId: string;
    designationPublicId: string;
    branchPublicId: string;
    reportingManagerPublicId: string;
    employeeGradePublicId: string;
    employeeCategoryPublicId: string;
    jobTitlePublicId: string;
    shiftPublicId: string;
    workSchedulePublicId: string;
  };
  abstract qualificationForm: { resultStatus: string; status: string };
  abstract bankAccountForm: { status: string };
  abstract documentForm: { idTypePublicId: string; idTypeName: string; status: string };
  abstract belongingForm: {
    belongingTypePublicId: string;
    belongingname: string;
    conditionStatus: string;
    status: string;
  };
  abstract leaveForm: { leaveTypeName: string; leaveTypePublicId: string };

  // ═══════════════════════════════════════════════════════════════════════════
  // TOGGLE
  // ═══════════════════════════════════════════════════════════════════════════
  toggleDropdown(event: Event, dropdownName: string) {
    event.stopPropagation();
    switch (dropdownName) {
      case 'employmentStatus':
        this.isEmploymentStatusOpen = !this.isEmploymentStatusOpen;
        break;
      case 'onboardingStatus':
        this.isOnboardingStatusOpen = !this.isOnboardingStatusOpen;
        break;
      case 'employeeType':
        this.isEmployeeTypeOpen = !this.isEmployeeTypeOpen;
        break;
      case 'proficiency':
        this.isProficiencyOpen = !this.isProficiencyOpen;
        break;
      case 'skillStatus':
        this.isSkillStatusOpen = !this.isSkillStatusOpen;
        break;
      case 'resultStatus':
        this.isResultStatusOpen = !this.isResultStatusOpen;
        break;
      case 'qualificationStatus':
        this.isQualificationStatusOpen = !this.isQualificationStatusOpen;
        break;
      case 'bankStatus':
        this.isBankStatusOpen = !this.isBankStatusOpen;
        break;
      case 'docType':
        this.isDocTypeOpen = !this.isDocTypeOpen;
        break;
      case 'docStatus':
        this.isDocStatusOpen = !this.isDocStatusOpen;
        break;
      case 'belongingType':
        this.isBelongingTypeOpen = !this.isBelongingTypeOpen;
        break;
      case 'conditionStatus':
        this.isConditionStatusOpen = !this.isConditionStatusOpen;
        break;
      case 'relation':
        this.isRelationOpen = !this.isRelationOpen;
        break;
      case 'familyMemberStatus':
        this.isFamilyMemberStatusOpen = !this.isFamilyMemberStatusOpen;
        break;
      case 'positionStatus':
        this.isPositionStatusOpen = !this.isPositionStatusOpen;
        break;
      case 'belongingStatus':
        this.isBelongingStatusOpen = !this.isBelongingStatusOpen;
        break;
      case 'experienceStatus':
        this.isExperienceStatusOpen = !this.isExperienceStatusOpen;
        break;
      case 'department':
        this.isDepartmentOpen = !this.isDepartmentOpen;
        break;
      case 'designation':
        this.isDesignatiomOpen = !this.isDesignatiomOpen;
        break;
      case 'reportingManager':
        this.isReportingManagerOpen = !this.isReportingManagerOpen;
        break;
      case 'branch':
        this.isBranchOpen = !this.isBranchOpen;
        break;
      case 'employeeCategory':
        this.isEmployeeCategoryOpen = !this.isEmployeeCategoryOpen;
        break;
      case 'employeeGrade':
        this.isEmployeeGradeOpen = !this.isEmployeeGradeOpen;
        break;
      case 'jobTitle':
        this.isJobTitleOpen = !this.isJobTitleOpen;
        break;
      case 'shift':
        this.isShiftOpen = !this.isShiftOpen;
        break;
      case 'workSchedule':
        this.isWorkScheduleOpen = !this.isWorkScheduleOpen;
        break;
      case 'LeaveType':
        this.isLeaveTypeOpen = !this.isLeaveTypeOpen;
        break;
    }
  }

  closeAllDropdowns(_event: Event) {
    this.isEmploymentStatusOpen = false;
    this.isOnboardingStatusOpen = false;
    this.isEmployeeTypeOpen = false;
    this.isProficiencyOpen = false;
    this.isSkillStatusOpen = false;
    this.isPositionStatusOpen = false;
    this.isBelongingTypeOpen = false;
    this.isFamilyMemberStatusOpen = false;
    this.isExperienceStatusOpen = false;
    this.isResultStatusOpen = false;
    this.isQualificationStatusOpen = false;
    this.isBankStatusOpen = false;
    this.isDocTypeOpen = false;
    this.isDocStatusOpen = false;
    this.isConditionStatusOpen = false;
    this.isRelationOpen = false;
    this.isDepartmentOpen = false;
    this.isDesignatiomOpen = false;
    this.isBranchOpen = false;
    this.isLeaveTypeOpen = false;
    this.isReportingManagerOpen = false;
    this.isEmployeeCategoryOpen = false;
    this.isEmployeeGradeOpen = false;
    this.isJobTitleOpen = false;
    this.isShiftOpen = false;
    this.isWorkScheduleOpen = false;
    this.isBelongingStatusOpen = false;
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // SELECT METHODS  (exact same names as original — HTML unchanged)
  // ═══════════════════════════════════════════════════════════════════════════

  selectEmploymentStatus(status: string, event: Event) {
    event.stopPropagation();
    this.selectedEmploymentStatus = status;
    this.employmentStatus = status;
    this.isEmploymentStatusOpen = false;
  }

  selectOnboardingStatus(status: string, event: Event) {
    event.stopPropagation();
    this.selectedOnboardingStatus = status;
    this.onboardingStatus = status;
    this.isOnboardingStatusOpen = false;
  }

  selectEmployeeType(type: string, event: Event) {
    event.stopPropagation();
    this.selectedEmployeeType = type;
    this.employeeType = type;
    this.isEmployeeTypeOpen = false;
  }

  selectProficiency(level: string, event: Event) {
    event.stopPropagation();
    this.selectedProficiency = level;
    this.skillsForm.proficiencyLevel = level;
    this.isProficiencyOpen = false;
  }

  selectSkillStatus(status: string, event: Event) {
    event.stopPropagation();
    this.selectedSkillStatus = status;
    this.skillsForm.status = status;
    this.isSkillStatusOpen = false;
  }

  selectExperienceStatus(status: string, event: Event) {
    event.stopPropagation();
    this.selectedExperienceStatus = status;
    this.expform.status = status;
    this.isExperienceStatusOpen = false;
  }

  selectFamilyMemberStatus(status: string, event: Event) {
    event.stopPropagation();
    this.selectedFamilyMemberStatus = status;
    this.familyMemberForm.status = status;
    this.isFamilyMemberStatusOpen = false;
  }

  selectPositionStatus(status: string, event: Event) {
    event.stopPropagation();
    this.selectedPositionStatus = status;
    this.positionForm.status = status;
    this.isPositionStatusOpen = false;
  }

  selectResultStatus(result: string, event: Event) {
    event.stopPropagation();
    this.selectedResultStatus = result;
    this.qualificationForm.resultStatus = result;
    this.isResultStatusOpen = false;
  }

  selectBelongingStatus(status: string, event: Event) {
    event.stopPropagation();
    this.selectedBelongingStatus = status;
    this.belongingForm.status = status;
    this.isBelongingStatusOpen = false;
  }

  selectQualificationStatus(status: string, event: Event) {
    event.stopPropagation();
    this.selectedQualificationStatus = status;
    this.qualificationForm.status = status;
    this.isQualificationStatusOpen = false;
  }

  selectBankStatus(status: string, event: Event) {
    event.stopPropagation();
    this.selectedBankStatus = status;
    this.bankAccountForm.status = status;
    this.isBankStatusOpen = false;
  }

  selectDocType(type: any, event: Event) {
    event.stopPropagation();
    this.selectedDocType = type.name;
    this.documentForm.idTypePublicId = type.publicId;
    this.documentForm.idTypeName = type.name;
    this.isDocTypeOpen = false;
  }

  selectDocStatus(status: string, event: Event) {
    event.stopPropagation();
    this.selectedDocStatus = status;
    this.documentForm.status = status;
    this.isDocStatusOpen = false;
  }

  selectBelongingType(belonging: any, event: Event) {
    event.stopPropagation();
    this.selectedBelongingType = belonging.name;
    this.belongingForm.belongingTypePublicId = belonging.publicId;
    this.belongingForm.belongingname = belonging.name;
    this.isBelongingTypeOpen = false;
  }

  selectConditionStatus(condition: string, event: Event) {
    event.stopPropagation();
    this.selectedConditionStatus = condition;
    this.belongingForm.conditionStatus = condition;
    this.isConditionStatusOpen = false;
  }

  selectRelation(relation: string, event: Event) {
    event.stopPropagation();
    this.selectedRelation = relation;
    this.familyMemberForm.relationName = relation;
    this.isRelationOpen = false;
  }

  selectDepartment(department: any, event: Event) {
    event.stopPropagation();
    this.selectedDepartment = department;
    this.positionForm.departmentPublicId = department.publicId;
    this.isDepartmentOpen = false;
  }

  selectDesignation(designation: any, event: Event) {
    event.stopPropagation();
    this.selectedDesignation = designation;
    this.positionForm.designationPublicId = designation.publicId;
    this.isDesignatiomOpen = false;
  }

  selectReportingManager(manager: any, event: Event) {
    event.stopPropagation();
    this.selectedReportingManager = manager;
    this.positionForm.reportingManagerPublicId = manager.employeePublicId;
    this.isReportingManagerOpen = false;
  }

  selectBranch(branch: any, event: Event) {
    event.stopPropagation();
    this.selcetedBranch = branch;
    this.positionForm.branchPublicId = branch.publicId;
    this.isBranchOpen = false;
  }

  selectEmployeeGrade(employeeGrade: any, event: Event) {
    event.stopPropagation();
    this.selectedEmployeeGrade = employeeGrade;
    this.positionForm.employeeGradePublicId = employeeGrade.publicId;
    this.isEmployeeGradeOpen = false;
  }

  selectedLeaveType(leaveType: any, event: Event) {
    event.stopPropagation();
    this.selectLeaveType = leaveType.name;
    this.leaveForm.leaveTypeName = leaveType.name;
    this.leaveForm.leaveTypePublicId = leaveType.publicId;
    this.isLeaveTypeOpen = false;
  }

  selectemployeeCatergory(employeeCategory: any, event: Event) {
    event.stopPropagation();
    this.SlectedEmployeeCategory = employeeCategory;
    this.positionForm.employeeCategoryPublicId = employeeCategory.publicId;
    this.isEmployeeCategoryOpen = false;
  }

  selectJobTitle(jobTitle: any, event: Event) {
    event.stopPropagation();
    this.selectedJobTitle = jobTitle;
    this.positionForm.jobTitlePublicId = jobTitle.publicId;
    this.isJobTitleOpen = false;
  }

  selectShift(shift: any, event: Event) {
    event.stopPropagation();
    this.selectedShift = shift;
    this.positionForm.shiftPublicId = shift.publicId;
    this.isShiftOpen = false;
  }

  selectWorkSchedule(workSchedule: any, event: Event) {
    event.stopPropagation();
    this.selectedWorkSchedule = workSchedule;
    this.positionForm.workSchedulePublicId = workSchedule.publicId;
    this.isWorkScheduleOpen = false;
  }
}
