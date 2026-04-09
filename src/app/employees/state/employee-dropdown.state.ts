export class EmployeeDropdownState {
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

  selectedEmploymentStatus = '';
  selectLeaveType = '';
  selectedOnboardingStatus = '';
  selectedEmployeeType = '';
  selectedProficiency = '';
  selectedSkillStatus = '';
  selectedResultStatus = '';
  selectedQualificationStatus = '';
  selectedBankStatus = '';
  selectedDocType = '';
  selectedDocStatus = '';
  selectedBelongingType = '';
  selectedConditionStatus = '';
  selectedRelation = '';
  selectedFamilyMemberStatus = '';
  selectedPositionStatus = '';
  selectedBelongingStatus = '';
  selectedExperienceStatus = '';
  selectedDepartment: any = null;
  selectedDesignation: any = null;
  selcetedBranch: any = null;
  selectedReportingManager: any = null;
  SlectedEmployeeCategory: any = null;
  selectedEmployeeGrade: any = null;
  selectedJobTitle: any = null;
  selectedShift: any = null;
  selectedWorkSchedule: any = null;

  closeAll(): void {
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

  toggle(dropdownName: string): void {
    this.closeAll();
    switch (dropdownName) {
      case 'employmentStatus':
        this.isEmploymentStatusOpen = true;
        break;
      case 'onboardingStatus':
        this.isOnboardingStatusOpen = true;
        break;
      case 'employeeType':
        this.isEmployeeTypeOpen = true;
        break;
      case 'proficiency':
        this.isProficiencyOpen = true;
        break;
      case 'skillStatus':
        this.isSkillStatusOpen = true;
        break;
      case 'resultStatus':
        this.isResultStatusOpen = true;
        break;
      case 'qualificationStatus':
        this.isQualificationStatusOpen = true;
        break;
      case 'bankStatus':
        this.isBankStatusOpen = true;
        break;
      case 'docType':
        this.isDocTypeOpen = true;
        break;
      case 'docStatus':
        this.isDocStatusOpen = true;
        break;
      case 'belongingType':
        this.isBelongingTypeOpen = true;
        break;
      case 'conditionStatus':
        this.isConditionStatusOpen = true;
        break;
      case 'relation':
        this.isRelationOpen = true;
        break;
      case 'familyMemberStatus':
        this.isFamilyMemberStatusOpen = true;
        break;
      case 'positionStatus':
        this.isPositionStatusOpen = true;
        break;
      case 'belongingStatus':
        this.isBelongingStatusOpen = true;
        break;
      case 'experienceStatus':
        this.isExperienceStatusOpen = true;
        break;
      case 'department':
        this.isDepartmentOpen = true;
        break;
      case 'designation':
        this.isDesignatiomOpen = true;
        break;
      case 'reportingManager':
        this.isReportingManagerOpen = true;
        break;
      case 'branch':
        this.isBranchOpen = true;
        break;
      case 'employeeCategory':
        this.isEmployeeCategoryOpen = true;
        break;
      case 'employeeGrade':
        this.isEmployeeGradeOpen = true;
        break;
      case 'jobTitle':
        this.isJobTitleOpen = true;
        break;
      case 'shift':
        this.isShiftOpen = true;
        break;
      case 'workSchedule':
        this.isWorkScheduleOpen = true;
        break;
      case 'LeaveType':
        this.isLeaveTypeOpen = true;
        break;
    }
  }
}
