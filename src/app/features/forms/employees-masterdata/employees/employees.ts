import { Component, HostListener, OnInit } from '@angular/core';
import { FormsService } from '../../Services/forms';
import { ToastrService } from 'ngx-toastr';
import { LoaderService } from '../../../../core/services/management-services/loader.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { UsersAndRolesService } from '../../../Users-And-Roles/Services/user-roles';

// ─── Interfaces ───────────────────────────────────────────────────────────────

interface Qualification {
  lineNumber: number;
  qualificationName: string;
  institutionName: string;
  passingYear: number | null;
  grade: string;
  resultStatus: string;
  status: string;
  remarks: string;
}

interface Skill {
  lineNumber: number;
  skillName: string;
  proficiencyLevel: string;
  yearsOfExperience: number | null;
  lastUsedYear: number | null;
  status: string;
  remarks: string;
}

interface Experience {
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

interface Leave {
  leaveTypeName: string;
  leaveTypePublicId: string;
  totalLeavesPerYear: string;
  remarks: string;
  active: boolean;
}
interface BankAccount {
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

interface EmployeeDocument {
  lineNumber: number;
  idTypePublicId: string;
  documentNumber: string;
  issuedDate: string;
  expiryDate: string;
  fileUrl: string;
  status: string;
  remarks: string;
}

interface Belonging {
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

interface FamilyMember {
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

interface Position {
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
interface Tab {
  id: string;
  title: string;
}

@Component({
  selector: 'app-employees',
  imports: [FormsModule, CommonModule, RouterModule],
  templateUrl: './employees.html',
  styleUrl: './employees.scss',
})
export class Employees implements OnInit {
  code: string = '';
  userFirstName: string = '';
  userLastName: string = '';
  email: string = '';
  mobileNumber: string = '';
  employmentStatus: string = '';
  onboardingStatus: string = '';
  employeeType: string = '';
  dateOfBirth: string = '';
  dateOfJoining: string = '';
  dateOfLeaving: string = '';
  remarks: string = '';
  currentPage: number = 0;
  pageSize: number = 100;
  departmentList: any;
  designationList: any;
  companyBranchList: any;
  EmployeeGradeList: any;
  EmployeeCategoryList: any;
  JobTitleList: any;
  IdTypeList: any;
  belongingList: any;
  shiftList: any;
  WorkScheduleList: any[] = [];
  EmployeeList: any[] = [];
  qualifications: Qualification[] = [];
  roleList: any;
  skills: Skill[] = [];
  skillsForm = {
    skillName: '',
    proficiencyLevel: '',
    yearsOfExperience: null as number | null,
    lastUsedYear: null as number | null,
    remarks: '',
    status: 'ACTIVE',
  };
  experiences: Experience[] = [];
  expform = {
    lineNumber: '',
    organizationName: '',
    roleName: '',
    startDate: '',
    endDate: '',
    currentlyWorking: '',
    responsibilities: '',
    status: 'ACTIVE',
    remarks: '',
  };
  Leaves: Leave[] = [];
  leaveForm = {
    leaveTypeName: '',
    leaveTypePublicId: '',
    totalLeavesPerYear: '',
    remarks: '',
    active: false,
  };

  qualificationForm = {
    qualificationName: '',
    institutionName: '',
    passingYear: null as number | null,
    grade: '',
    resultStatus: '',
    status: 'ACTIVE',
    remarks: '',
  };
  bankAccountForm = {
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
  bankAccounts: BankAccount[] = [];
  documents: EmployeeDocument[] = [];
  documentForm = {
    idTypePublicId: '',
    documentNumber: '',
    issuedDate: '',
    expiryDate: '',
    fileUrl: '',
    remarks: '',
    status: 'ACTIVE',
  };
  belongings: Belonging[] = [];
  belongingForm = {
    belongingname: '',
    belongingTypePublicId: '',
    serialNumber: '',
    issuedDate: '',
    returnDate: '',
    conditionStatus: '',
    remarks: '',
    status: 'ACTIVE',
  };
  familyMembers: FamilyMember[] = [];
  familyMemberForm = {
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
  positions: Position[] = [];
  positionForm = {
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

  userPublicId: string = '';
  userEmail: string = '';
  userPassword: string = '';
  roleCode: string = '';
  userFirstNameNew: string = '';
  userLastNameNew: string = '';
  userPhoneNumber: string = '';
  activeTabId: string = 'experience';
  activeTab: string = 'experience';
  publicId: string | null = null;
  isEditMode: boolean = false;
  disabled: boolean = false;
  LeaveTypeList: any;
  sidebarTabs: Tab[] = [
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

  // Dropdown toggle states
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

  // ... aise hi baaki ke liye bhi

  // Selected values
  selectedEmploymentStatus: string = '';
  selectLeaveType: string = '';
  selectedOnboardingStatus: string = '';
  selectedEmployeeType: string = '';
  selectedProficiency: string = '';
  selectedSkillStatus: string = '';
  selectedResultStatus: string = '';
  selectedQualificationStatus: string = '';
  selectedBankStatus: string = '';
  selectedDocType: string = '';
  selectedDocStatus: string = '';
  selectedBelongingType: string = '';
  selectedConditionStatus: string = '';
  selectedRelation: string = '';

  selectedFamilyMemberStatus: string = '';
  selectedPositionStatus: string = '';
  selectedBelongingStatus: string = '';
  selectedExperienceStatus: string = '';
  selectedDepartment: any = null;
  selectedDesignation: any = null;
  selcetedBranch: any = null;
  selectedReportingManager: any = null;
  SlectedEmployeeCategory: any = null;
  selectedEmployeeGrade: any = null;
  selectedJobTitle: any = null;
  selectedShift: any = null;
  selectedWorkSchedule: any = null;
  // ... baaki ke liye bhi

  // Options arrays
  employmentStatusOptions = ['ONBOARDING', 'PROBATION', 'ACTIVE', 'NOTICE_PERIOD', 'INACTIVE'];
  onboardingStatusOptions = ['NOT_STARTED', 'IN_PROGRESS', 'COMPLETED'];
  employeeTypeOptions = ['CONTRACT', 'PERMANENT', 'INTERNEE', 'TRAINEE'];
  proficiencyOptions = ['BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'EXPERT'];
  statusOptions = ['ACTIVE', 'INACTIVE', 'CANCELLED'];
  resultStatusOptions = ['PASS', 'FAIL', 'AWAITING'];
  docTypeOptions = ['NATIONAL_ID', 'PASSPORT', 'DRIVING_LICENSE', 'VISA', 'OTHER'];
  belongingTypeOptions = ['LAPTOP', 'MOBILE', 'ACCESS_CARD', 'VEHICLE', 'OTHER'];
  conditionStatusOptions = ['NEW', 'GOOD', 'FAIR', 'POOR', 'DAMAGED'];
  relationOptions = ['FATHER', 'MOTHER', 'SPOUSE', 'CHILD', 'SIBLING', 'OTHER'];

  constructor(
    private loader: LoaderService,
    private formSv: FormsService,
    private usersv: UsersAndRolesService,
    private toastr: ToastrService,
    private router: Router,
    private route: ActivatedRoute,
  ) {}

  ngOnInit() {
    this.publicId = this.route.snapshot.paramMap.get('id');
    if (this.publicId) {
      this.isEditMode = true;
      this.loadSingleEmployee(this.publicId);
    }
    this.loadDepartment();
    this.loadDesignation();
    this.loadCompanyBranch();
    this.loadEmployeeGrade();
    this.loadEmployeeCategory();
    this.loadJobTitle();
    this.loadshift();
    this.loadEmployee();
    this.loadWorkSchedule();
    this.getRole();
    this.GetIdType();
    this.getBelongingType();
    this.getLeaveType();
  }
  setTab(tab: string) {
    this.activeTab = tab;
    this.activeTabId = tab;
  }

  addQualification() {
    this.qualifications.push({
      lineNumber: this.qualifications.length + 1,
      qualificationName: this.qualificationForm.qualificationName,
      institutionName: this.qualificationForm.institutionName,
      passingYear: this.qualificationForm.passingYear,
      grade: this.qualificationForm.grade,
      resultStatus: this.qualificationForm.resultStatus,
      status: this.qualificationForm.status,
      remarks: this.qualificationForm.remarks,
    });
    this.resetQualificationForm();
  }

  resetQualificationForm() {
    this.qualificationForm = {
      qualificationName: '',
      institutionName: '',
      passingYear: null,
      grade: '',
      resultStatus: '',
      remarks: '',
      status: '',
    };
  }
  removeQualification(index: number) {
    this.qualifications.splice(index, 1);
    this.reindexArray(this.qualifications);
  }

  addSkill() {
    this.skills.push({
      lineNumber: this.skills.length + 1,
      skillName: this.skillsForm.skillName,
      proficiencyLevel: this.skillsForm.proficiencyLevel,
      yearsOfExperience: this.skillsForm.yearsOfExperience,
      lastUsedYear: this.skillsForm.lastUsedYear,
      status: this.skillsForm.status,
      remarks: this.skillsForm.remarks,
    });
    this.resetSkillForm();
  }

  resetSkillForm() {
    this.skillsForm = {
      skillName: '',
      proficiencyLevel: '',
      yearsOfExperience: null,
      lastUsedYear: null,
      remarks: '',
      status: '',
    };
  }

  removeSkill(index: number) {
    this.skills.splice(index, 1);
    this.reindexArray(this.skills);
  }

  addExperience() {
    this.experiences.push({
      lineNumber: this.experiences.length + 1,
      organizationName: this.expform.organizationName,
      roleName: this.expform.roleName,
      startDate: this.expform.startDate,
      endDate: this.expform.endDate,
      currentlyWorking: !!this.expform.currentlyWorking,
      responsibilities: this.expform.responsibilities,
      status: this.expform.status,
      remarks: this.expform.remarks,
    });
    this.resetExpForm();
  }
  removeExperience(index: number) {
    this.experiences.splice(index, 1);
    this.reindexArray(this.experiences);
  }
  resetExpForm() {
    this.expform = {
      lineNumber: '',
      organizationName: '',
      roleName: '',
      startDate: '',
      endDate: '',
      currentlyWorking: '',
      responsibilities: '',
      status: '',
      remarks: '',
    };
  }

  addBankAccount() {
    this.bankAccounts.push({
      lineNumber: this.bankAccounts.length + 1,
      bankName: this.bankAccountForm.bankName,
      branchCode: this.bankAccountForm.branchCode,
      accountNumber: this.bankAccountForm.accountNumber,
      accountHolderName: this.bankAccountForm.accountHolderName,
      iban: this.bankAccountForm.iban,
      swiftCode: this.bankAccountForm.swiftCode,
      isPrimaryAccount:
        this.bankAccounts.length === 0 ? true : this.bankAccountForm.isPrimaryAccount,
      status: this.bankAccountForm.status,
      remarks: this.bankAccountForm.remarks,
    });
    this.resetBankAccountForm();
  }

  resetBankAccountForm() {
    this.bankAccountForm = {
      bankName: '',
      branchCode: '',
      accountNumber: '',
      accountHolderName: '',
      iban: '',
      swiftCode: '',
      isPrimaryAccount: false,
      status: '',
      remarks: '',
    };
  }

  removeBankAccount(index: number) {
    this.bankAccounts.splice(index, 1);
    this.reindexArray(this.bankAccounts);
  }

  setPrimaryAccount(index: number) {
    this.bankAccounts.forEach((acc, i) => (acc.isPrimaryAccount = i === index));
  }
  addDocument() {
    this.documents.push({
      lineNumber: this.documents.length + 1,
      idTypePublicId: this.documentForm.idTypePublicId,
      documentNumber: this.documentForm.documentNumber,
      issuedDate: this.documentForm.issuedDate,
      expiryDate: this.documentForm.expiryDate,
      fileUrl: this.documentForm.fileUrl,
      status: this.documentForm.status,
      remarks: this.documentForm.remarks,
    });
    this.resetDocumentForm();
  }

  resetDocumentForm() {
    this.documentForm = {
      idTypePublicId: '',
      documentNumber: '',
      issuedDate: '',
      expiryDate: '',
      fileUrl: '',
      status: '',
      remarks: '',
    };
  }
  removeDocument(index: number) {
    this.documents.splice(index, 1);
    this.reindexArray(this.documents);
  }

  addBelonging() {
    this.belongings.push({
      lineNumber: this.belongings.length + 1,
      belongingTypePublicId: this.belongingForm.belongingTypePublicId,
      belongingname: this.belongingForm.belongingname,
      serialNumber: this.belongingForm.serialNumber,
      issuedDate: this.belongingForm.issuedDate,
      returnDate: this.belongingForm.returnDate,
      conditionStatus: this.belongingForm.conditionStatus,
      status: this.belongingForm.status,
      remarks: this.belongingForm.remarks,
    });
    this.resetBelongingForm();
  }

  resetBelongingForm() {
    this.belongingForm = {
      belongingTypePublicId: '',
      belongingname: '',
      serialNumber: '',
      issuedDate: '',
      returnDate: '',
      conditionStatus: '',
      status: '',
      remarks: '',
    };
  }

  removeBelonging(index: number) {
    this.belongings.splice(index, 1);
    this.reindexArray(this.belongings);
  }
  addFamilyMember() {
    this.familyMembers.push({
      lineNumber: this.familyMembers.length + 1,
      memberName: this.familyMemberForm.memberName,
      relationName: this.familyMemberForm.relationName,
      dateOfBirth: this.familyMemberForm.dateOfBirth,
      occupation: this.familyMemberForm.occupation,
      contactNumber: this.familyMemberForm.contactNumber,
      passportNo: this.familyMemberForm.passportNo,
      passportExpiry: this.familyMemberForm.passportExpiry,
      visaIqamaNo: this.familyMemberForm.visaIqamaNo,
      visaIqamaExpiry: this.familyMemberForm.visaIqamaExpiry,
      isDependent: this.familyMemberForm.isDependent,
      isBeneficiary: this.familyMemberForm.isBeneficiary,
      isEmergencyContact: this.familyMemberForm.isEmergencyContact,
      status: this.familyMemberForm.status,
      remarks: this.familyMemberForm.remarks,
    });
    this.resetFamilyMemberForm();
  }

  resetFamilyMemberForm() {
    this.familyMemberForm = {
      memberName: '',
      relationName: '',
      dateOfBirth: '',
      occupation: '',
      contactNumber: '',
      passportNo: '',
      passportExpiry: '',
      visaIqamaNo: '',
      visaIqamaExpiry: '',
      status: '',
      isDependent: false,
      isBeneficiary: false,
      isEmergencyContact: false,
      remarks: '',
    };
  }

  removeFamilyMember(index: number) {
    this.familyMembers.splice(index, 1);
    this.reindexArray(this.familyMembers);
  }
  addPosition() {
    this.positions.push({
      lineNumber: this.positions.length + 1,
      departmentPublicId: this.positionForm.departmentPublicId,
      designationPublicId: this.positionForm.designationPublicId,
      branchPublicId: this.positionForm.branchPublicId,
      reportingManagerPublicId: this.positionForm.reportingManagerPublicId,
      employeeGradePublicId: this.positionForm.employeeGradePublicId,
      employeeCategoryPublicId: this.positionForm.employeeCategoryPublicId,
      jobTitlePublicId: this.positionForm.jobTitlePublicId,
      shiftPublicId: this.positionForm.shiftPublicId,
      workSchedulePublicId: this.positionForm.workSchedulePublicId,
      positionCode: this.positionForm.positionCode,
      positionName: this.positionForm.positionName,
      effectiveFrom: this.positionForm.effectiveFrom,
      effectiveTo: this.positionForm.effectiveTo,
      isPrimaryPosition: this.positions.length === 0 ? true : this.positionForm.isPrimaryPosition,
      status: this.positionForm.status,
      remarks: this.positionForm.remarks,
    });
    this.resetPositionForm();
  }

  resetPositionForm() {
    this.positionForm = {
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
      remarks: '',
      status: '',
    };
  }

  removePosition(index: number) {
    this.positions.splice(index, 1);
    this.reindexArray(this.positions);
  }

  setPrimaryPosition(index: number) {
    this.positions.forEach((pos, i) => (pos.isPrimaryPosition = i === index));
  }

  private reindexArray(arr: { lineNumber: number }[]) {
    arr.forEach((item, i) => (item.lineNumber = i + 1));
  }
  private validateCoreFields(): boolean {
    if (
      !this.code ||
      !this.userFirstName ||
      !this.email ||
      !this.employmentStatus ||
      !this.employeeType
    ) {
      this.toastr.error('Please fill in all required fields', 'Validation Error');
      return false;
    }
    return true;
  }

  private validateNewUserFields(): boolean {
    if (!this.roleCode || !this.userPassword) {
      this.toastr.error('Please fill in Role Code and Password', 'Validation Error');
      return false;
    }
    if (this.userPassword.length < 8) {
      this.toastr.error('Password must be at least 8 characters', 'Validation Error');
      return false;
    }
    return true;
  }

  // private buildEmployeePayload() {
  //   return {
  //     code: this.code,
  //     userFirstName: this.userFirstName,
  //     userLastName: this.userLastName,
  //     email: this.email,
  //     mobileNumber: this.mobileNumber,
  //     employmentStatus: this.employmentStatus,
  //     onboardingStatus: this.onboardingStatus,
  //     employeeType: this.employeeType,
  //     dateOfBirth: this.dateOfBirth || null,
  //     dateOfJoining: this.dateOfJoining || null,
  //     dateOfLeaving: this.dateOfLeaving || null,
  //     remarks: this.remarks,
  //     qualifications: this.qualifications,
  //     skills: this.skills,
  //     experiences: this.experiences,
  //     bankAccounts: this.bankAccounts,
  //     documents: this.documents,
  //     belongings: this.belongings,
  //     familyMembers: this.familyMembers,
  //     positions: this.positions,
  //   };
  // }
  private buildEmployeePayload() {
    return {
      code: this.code,
      userFirstName: this.userFirstName,
      userLastName: this.userLastName,
      email: this.email,
      mobileNumber: this.mobileNumber,
      employmentStatus: this.employmentStatus,
      onboardingStatus: this.onboardingStatus,
      employeeType: this.employeeType,
      dateOfBirth: this.dateOfBirth || null,
      dateOfJoining: this.dateOfJoining || null,
      dateOfLeaving: this.dateOfLeaving || null,
      remarks: this.remarks,
      qualifications: this.qualifications,
      skills: this.skills,
      experiences: this.experiences.map((exp) => ({
        ...exp,
        endDate: exp.endDate || null,
      })),
      bankAccounts: this.bankAccounts,
      documents: this.documents.map((doc) => ({
        ...doc,
        idTypePublicId:
          typeof doc.idTypePublicId === 'object'
            ? ((doc.idTypePublicId as any)?.publicId ?? null)
            : doc.idTypePublicId,
      })),
      belongings: this.belongings,
      familyMembers: this.familyMembers,
      positions: this.positions.map((pos) => ({
        ...pos,
        isPrimaryPosition: (pos as any).primaryPosition ?? pos.isPrimaryPosition,
      })),
      leaveEntitlements: this.Leaves.map((leave) => ({
        leaveTypePublicId:
          typeof leave.leaveTypePublicId === 'object'
            ? ((leave.leaveTypePublicId as any)?.publicId ?? null)
            : leave.leaveTypePublicId,
        totalLeavesPerYear: Number(leave.totalLeavesPerYear),
        remarks: leave.remarks,
        active: leave.active,
      })),
    };
  }

  onSubmit() {
    if (this.isEditMode) {
      this.updateEmployee();
    } else {
      this.createEmployee();
    }
  }

  createEmployee() {
    if (!this.validateCoreFields()) return;
    if (!this.validateNewUserFields()) return;

    const payload = {
      employee: this.buildEmployeePayload(),
      userPublicId: this.userPublicId || null,
      user: {
        email: this.email,
        password: this.userPassword,
        roleCode: this.roleCode,
        firstName: this.userFirstName,
        lastName: this.userLastName,
        phoneNumber: this.mobileNumber,
      },
    };

    this.loader.show();
    this.disabled = true;
    console.log('final Paylaod', JSON.stringify(payload, null, 2));
    this.formSv.PostManualEmployee(payload).subscribe({
      next: () => {
        this.loader.hide();
        this.toastr.success('Employee created successfully', 'Success');
        this.resetForm();
        setTimeout(() => this.router.navigate(['/panel/forms/view-all-employees']), 1500);
      },
      error: (error: any) => {
        this.loader.hide();
        this.disabled = false;
        this.toastr.error(error?.error?.message || 'Failed to create Employee.', 'Error');
      },
    });
  }

  loadSingleEmployee(publicId: string) {
    this.loader.show();
    this.formSv.GetEmployeesListById(publicId).subscribe({
      next: (res: any) => {
        console.log('FULL API RESPONSE:', JSON.stringify(res, null, 2));
        this.loader.hide();
        const d = res.data?.employee ?? res.data ?? {};
        const nameParts = (d.fullName ?? '').trim().split(' ');
        this.userFirstName = nameParts[0] ?? '';
        this.userLastName = nameParts.slice(1).join(' ') ?? '';
        this.code = d.code ?? '';
        this.email = d.email ?? '';
        this.mobileNumber = d.mobileNumber ?? '';
        this.employmentStatus = d.employmentStatus ?? '';
        this.onboardingStatus = d.onboardingStatus ?? '';
        this.employeeType = d.employeeType ?? '';
        this.dateOfBirth = d.dateOfBirth ?? '';
        this.dateOfJoining = d.dateOfJoining ?? '';
        this.dateOfLeaving = d.dateOfLeaving ?? '';
        this.remarks = d.remarks ?? '';
        this.qualifications = d.qualifications ?? [];
        this.skills = d.skills ?? [];
        this.experiences = d.experiences ?? [];
        this.bankAccounts = d.bankAccounts ?? [];
        this.documents = d.documents ?? [];
        this.belongings = d.belongings ?? [];
        this.familyMembers = d.familyMembers ?? [];
        this.positions = d.positions ?? [];
        this.Leaves = d.leaveEntitlements ?? [];
      },
      error: () => {
        this.loader.hide();
        this.toastr.error('Failed to load Employee', 'Error');
      },
    });
  }

  updateEmployee() {
    if (!this.validateCoreFields()) return;
    const payload = this.buildEmployeePayload();

    this.loader.show();
    this.disabled = true;
    console.log('Final Update Payload', JSON.stringify(payload, null, 2));

    this.formSv.UpdateEmployeesList(this.publicId!, payload).subscribe({
      next: () => {
        this.loader.hide();
        this.disabled = false;
        this.toastr.success('Employee updated successfully', 'Success');
        setTimeout(() => this.router.navigate(['/panel/forms/view-all-employees']), 1500);
      },
      error: (error: any) => {
        this.loader.hide();
        this.disabled = false;
        console.error('Full error:', error?.error);
        this.toastr.error(error?.error?.message || 'Failed to update Employee.', 'Error');
      },
    });
  }

  resetForm() {
    this.code = '';
    this.userFirstName = '';
    this.userLastName = '';
    this.email = '';
    this.mobileNumber = '';
    this.employmentStatus = '';
    this.onboardingStatus = '';
    this.employeeType = '';
    this.dateOfBirth = '';
    this.dateOfJoining = '';
    this.dateOfLeaving = '';
    this.remarks = '';

    this.qualifications = [];
    this.skills = [];
    this.experiences = [];
    this.bankAccounts = [];
    this.documents = [];
    this.belongings = [];
    this.familyMembers = [];
    this.positions = [];
    this.Leaves = [];
    this.userPublicId = '';
    this.userEmail = '';
    this.userPassword = '';
    this.roleCode = '';
    this.userFirstNameNew = '';
    this.userLastNameNew = '';
    this.userPhoneNumber = '';
    this.disabled = false;
  }

  cancel() {
    this.router.navigate(['/panel/forms/view-all-employees']);
  }
  isNotExpired(dateStr: string): boolean {
    if (!dateStr) return true;
    return new Date(dateStr) >= new Date();
  }
  loadDepartment() {
    this.formSv.GetDepartment(this.currentPage, this.pageSize).subscribe(
      (res: any) => {
        if (res.success) {
          this.departmentList = res.data;
          console.log('deaprtment Lsit', res);
        }
      },
      (err: any) => {
        console.log(err);
      },
    );
  }
  loadDesignation() {
    this.formSv.getAllDesignations(this.currentPage, this.pageSize).subscribe(
      (res: any) => {
        if (res.success) {
          this.designationList = res.data;
          console.log('designation Lsit', res);
        }
      },
      (err: any) => {
        console.log(err);
      },
    );
  }
  loadCompanyBranch() {
    this.formSv.getAllComapnyBranches(this.currentPage, this.pageSize).subscribe(
      (res: any) => {
        if (res.success) {
          this.companyBranchList = res.data;
          console.log('companyBranch Lsit', res);
        }
      },
      (err: any) => {
        console.log(err);
      },
    );
  }
  loadEmployeeGrade() {
    this.formSv.GetEmployeeGrade(this.currentPage, this.pageSize).subscribe(
      (res: any) => {
        if (res.success) {
          this.EmployeeGradeList = res.data;
          console.log('EmployeeGrade Lsit', res);
        }
      },
      (err: any) => {
        console.log(err);
      },
    );
  }
  loadEmployeeCategory() {
    this.formSv.GetEmployeeCaterogy(this.currentPage, this.pageSize).subscribe(
      (res: any) => {
        if (res.success) {
          this.EmployeeCategoryList = res.data;
          console.log('EmployeeCategory Lsit', res);
        }
      },
      (err: any) => {
        console.log(err);
      },
    );
  }
  loadJobTitle() {
    this.formSv.GetJobTitle(this.currentPage, this.pageSize).subscribe(
      (res: any) => {
        if (res.success) {
          this.JobTitleList = res.data;
          console.log('JobTitle Lsit', res);
        }
      },
      (err: any) => {
        console.log(err);
      },
    );
  }
  loadshift() {
    this.formSv.getAllShifts(this.currentPage, this.pageSize).subscribe(
      (res: any) => {
        if (res.success) {
          this.shiftList = res.data;
          console.log('shift Lsit', res);
        }
      },
      (err: any) => {
        console.log(err);
      },
    );
  }
  loadWorkSchedule() {
    this.formSv.getAllWorkSchedules(this.currentPage, this.pageSize).subscribe(
      (res: any) => {
        if (res.success) {
          this.WorkScheduleList = res.data;
          console.log('WorkSchedule Lsit', res);
        }
      },
      (err: any) => {
        console.log(err);
      },
    );
  }
  loadEmployee() {
    this.formSv.GetEmployees(this.currentPage, this.pageSize).subscribe(
      (res: any) => {
        if (res.success) {
          this.EmployeeList = res.data;
          console.log('employee Lsit', res);
        }
      },
      (err: any) => {
        console.log(err);
      },
    );
  }
  tabPage: number = 0;
  tabsPerPage: number = 7;

  get visibleTabs(): Tab[] {
    const start = this.tabPage * this.tabsPerPage;
    return this.sidebarTabs.slice(start, start + this.tabsPerPage);
  }

  get hasNextPage(): boolean {
    return (this.tabPage + 1) * this.tabsPerPage < this.sidebarTabs.length;
  }

  get hasPrevPage(): boolean {
    return this.tabPage > 0;
  }

  nextTabPage() {
    if (this.hasNextPage) this.tabPage++;
  }

  prevTabPage() {
    if (this.hasPrevPage) this.tabPage--;
  }
  getRole() {
    this.usersv.getRoles(this.currentPage, this.pageSize).subscribe(
      (res: any) => {
        if (res.success) {
          this.roleList = res.data;
          console.log('role List', res);
        }
      },
      (err: any) => {
        console.log(err);
      },
    );
  }

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

      default:
        break;
    }
  }

  // Select methods
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
    this.belongingForm.status = status;
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
    this.isBelongingTypeOpen = false;
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
    this.selectedDesignation = designation; // ✅ variable use karo
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

  // @HostListener for closing dropdowns on outside click
  @HostListener('document:click', ['$event'])
  closeAllDropdowns(event: Event) {
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
    this.isBelongingTypeOpen = false;
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
  }
  GetIdType() {
    this.formSv.GetIDType(this.currentPage, this.pageSize).subscribe(
      (res: any) => {
        if (res.success) {
          this.IdTypeList = res.data;
          console.log('Id Type List', res);
        }
      },
      (err: any) => {
        console.log(err);
      },
    );
  }
  getBelongingType() {
    this.formSv.GetBelongingTypes(this.currentPage, this.pageSize).subscribe(
      (res: any) => {
        if (res.success) {
          this.belongingList = res.data;
          console.log('belonging Type', res);
        }
      },
      (err: any) => {
        console.log(err);
      },
    );
  }
  getLeaveType() {
    this.formSv.GetLeaveType(this.currentPage, this.pageSize).subscribe(
      (res: any) => {
        if (res.success) {
          this.LeaveTypeList = res.data;
          console.log('Leave Type List', res);
        }
      },
      (err: any) => {
        console.log(err);
      },
    );
  }
  addLeaveForm() {
    this.Leaves.push({
      leaveTypeName: this.leaveForm.leaveTypeName,
      leaveTypePublicId: this.leaveForm.leaveTypePublicId,
      totalLeavesPerYear: this.leaveForm.totalLeavesPerYear,
      remarks: this.leaveForm.remarks,
      active: this.leaveForm.active,
    });
    this.resetLeaveForm();
  }
  resetLeaveForm() {
    this.leaveForm.leaveTypeName = '';
    this.leaveForm.leaveTypePublicId = '';
    this.leaveForm.totalLeavesPerYear = '';
    this.leaveForm.remarks = '';
    this.leaveForm.active = false;
  }
  removeLeaveForm(index: number) {
    this.Leaves.splice(index, 1);
  }
}
