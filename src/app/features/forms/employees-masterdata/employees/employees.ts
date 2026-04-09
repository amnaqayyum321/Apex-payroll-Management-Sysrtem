// ─────────────────────────────────────────────────────────────────────────────
// employees/employees.component.ts  (main component — lean orchestrator)
// ─────────────────────────────────────────────────────────────────────────────

import { Component, HostListener, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

import { FormsService } from '../../Services/forms';
import { LoaderService } from '../../../../core/services/management-services/loader.service';
import { UsersAndRolesService } from '../../../Users-And-Roles/Services/user-roles';

// ── Domain types ──────────────────────────────────────────────────────────────
import {
  Qualification,
  Skill,
  Experience,
  Leave,
  BankAccount,
  EmployeeDocument,
  Belonging,
  FamilyMember,
  Position,
  Tab,
  QualificationForm,
  SkillForm,
  ExperienceForm,
  BankAccountForm,
  EmployeeDocumentForm,
  BelongingForm,
  FamilyMemberForm,
  PositionForm,
  LeaveForm,
} from '../../../../employees/models/employee.interfaces';

// ── Constants ─────────────────────────────────────────────────────────────────
import {
  EMPLOYMENT_STATUS_OPTIONS,
  ONBOARDING_STATUS_OPTIONS,
  EMPLOYEE_TYPE_OPTIONS,
  PROFICIENCY_OPTIONS,
  STATUS_OPTIONS,
  RESULT_STATUS_OPTIONS,
  CONDITION_STATUS_OPTIONS,
  RELATION_OPTIONS,
  SIDEBAR_TABS,
  TABS_PER_PAGE,
  DEFAULT_PAGE,
  DEFAULT_PAGE_SIZE,
} from '../../../../employees/constants/employee.constants';
import { EmployeeDropdownState } from '../../../../employees/state/employee-dropdown.state';
import {
  defaultQualificationForm,
  defaultSkillForm,
  defaultExperienceForm,
  defaultBankAccountForm,
  defaultDocumentForm,
  defaultBelongingForm,
  defaultFamilyMemberForm,
  defaultPositionForm,
  defaultLeaveForm,
} from '../../../../employees/state/employee-form.defaults';

// ── Utils ─────────────────────────────────────────────────────────────────────
import {
  reindexArray,
  isNotExpired,
  setSinglePrimary,
} from '../../../../employees/utils/employee-list.helpers';
import { buildEmployeePayload } from '../../../../employees/utils/employee-payload.builder';

@Component({
  selector: 'app-employees',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterModule],
  templateUrl: './employees.html',
  styleUrl: './employees.scss',
})
export class Employees implements OnInit {
  code = '';
  userFirstName = '';
  userLastName = '';
  email = '';
  mobileNumber = '';
  employmentStatus = '';
  onboardingStatus = '';
  employeeType = '';
  dateOfBirth = '';
  dateOfJoining = '';
  dateOfLeaving = '';
  remarks = '';
  userPublicId = '';
  userEmail = '';
  userPassword = '';
  roleCode = '';
  userFirstNameNew = '';
  userLastNameNew = '';
  userPhoneNumber = '';

  currentPage = DEFAULT_PAGE;
  pageSize = DEFAULT_PAGE_SIZE;

  publicId: string | null = null;
  isEditMode = false;
  disabled = false;
  sidebarTabs: Tab[] = SIDEBAR_TABS;
  activeTab = 'experience';
  activeTabId = 'experience';
  tabPage = 0;
  tabsPerPage = TABS_PER_PAGE;
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
  roleList: any;
  LeaveTypeList: any;
  readonly employmentStatusOptions = EMPLOYMENT_STATUS_OPTIONS;
  readonly onboardingStatusOptions = ONBOARDING_STATUS_OPTIONS;
  readonly employeeTypeOptions = EMPLOYEE_TYPE_OPTIONS;
  readonly proficiencyOptions = PROFICIENCY_OPTIONS;
  readonly statusOptions = STATUS_OPTIONS;
  readonly resultStatusOptions = RESULT_STATUS_OPTIONS;
  readonly conditionStatusOptions = CONDITION_STATUS_OPTIONS;
  readonly relationOptions = RELATION_OPTIONS;
  dd = new EmployeeDropdownState();

  qualifications: Qualification[] = [];
  skills: Skill[] = [];
  experiences: Experience[] = [];
  Leaves: Leave[] = [];
  bankAccounts: BankAccount[] = [];
  documents: EmployeeDocument[] = [];
  belongings: Belonging[] = [];
  familyMembers: FamilyMember[] = [];
  positions: Position[] = [];
  qualificationForm: QualificationForm = defaultQualificationForm();
  skillsForm: SkillForm = defaultSkillForm();
  expform: ExperienceForm = defaultExperienceForm();
  bankAccountForm: BankAccountForm = defaultBankAccountForm();
  documentForm: EmployeeDocumentForm = defaultDocumentForm();
  belongingForm: BelongingForm = defaultBelongingForm();
  familyMemberForm: FamilyMemberForm = defaultFamilyMemberForm();
  positionForm: PositionForm = defaultPositionForm();
  leaveForm: LeaveForm = defaultLeaveForm();

  isNotExpired = isNotExpired;

  constructor(
    private loader: LoaderService,
    private formSv: FormsService,
    private usersv: UsersAndRolesService,
    private toastr: ToastrService,
    private router: Router,
    private route: ActivatedRoute,
  ) {}
  ngOnInit(): void {
    this.publicId = this.route.snapshot.paramMap.get('id');
    if (this.publicId) {
      this.isEditMode = true;
      this.loadSingleEmployee(this.publicId);
    }
    this.loadAllLookups();
  }
  setTab(tab: string): void {
    this.activeTab = tab;
    this.activeTabId = tab;
  }

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

  nextTabPage(): void {
    if (this.hasNextPage) this.tabPage++;
  }
  prevTabPage(): void {
    if (this.hasPrevPage) this.tabPage--;
  }

  addQualification(): void {
    this.qualifications.push({
      lineNumber: this.qualifications.length + 1,
      ...this.qualificationForm,
    });
    this.qualificationForm = defaultQualificationForm();
  }

  removeQualification(index: number): void {
    this.qualifications.splice(index, 1);
    reindexArray(this.qualifications);
  }
  addSkill(): void {
    this.skills.push({ lineNumber: this.skills.length + 1, ...this.skillsForm });
    this.skillsForm = defaultSkillForm();
  }

  removeSkill(index: number): void {
    this.skills.splice(index, 1);
    reindexArray(this.skills);
  }

  addExperience(): void {
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
    this.expform = defaultExperienceForm();
  }

  removeExperience(index: number): void {
    this.experiences.splice(index, 1);
    reindexArray(this.experiences);
  }

  addBankAccount(): void {
    this.bankAccounts.push({
      lineNumber: this.bankAccounts.length + 1,
      ...this.bankAccountForm,
      isPrimaryAccount:
        this.bankAccounts.length === 0 ? true : this.bankAccountForm.isPrimaryAccount,
    });
    this.bankAccountForm = defaultBankAccountForm();
  }

  removeBankAccount(index: number): void {
    this.bankAccounts.splice(index, 1);
    reindexArray(this.bankAccounts);
  }

  setPrimaryAccount(index: number): void {
    setSinglePrimary(this.bankAccounts, index, 'isPrimaryAccount');
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // CRUD — Document
  // ═══════════════════════════════════════════════════════════════════════════

  addDocument(): void {
    this.documents.push({ lineNumber: this.documents.length + 1, ...this.documentForm });
    this.documentForm = defaultDocumentForm();
  }

  removeDocument(index: number): void {
    this.documents.splice(index, 1);
    reindexArray(this.documents);
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // CRUD — Belonging
  // ═══════════════════════════════════════════════════════════════════════════

  addBelonging(): void {
    this.belongings.push({ lineNumber: this.belongings.length + 1, ...this.belongingForm });
    this.belongingForm = defaultBelongingForm();
  }

  removeBelonging(index: number): void {
    this.belongings.splice(index, 1);
    reindexArray(this.belongings);
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // CRUD — Family Member
  // ═══════════════════════════════════════════════════════════════════════════

  addFamilyMember(): void {
    this.familyMembers.push({
      lineNumber: this.familyMembers.length + 1,
      ...this.familyMemberForm,
    });
    this.familyMemberForm = defaultFamilyMemberForm();
  }

  removeFamilyMember(index: number): void {
    this.familyMembers.splice(index, 1);
    reindexArray(this.familyMembers);
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // CRUD — Position
  // ═══════════════════════════════════════════════════════════════════════════

  addPosition(): void {
    this.positions.push({
      lineNumber: this.positions.length + 1,
      ...this.positionForm,
      isPrimaryPosition: this.positions.length === 0 ? true : this.positionForm.isPrimaryPosition,
    });
    this.positionForm = defaultPositionForm();
  }

  removePosition(index: number): void {
    this.positions.splice(index, 1);
    reindexArray(this.positions);
  }

  setPrimaryPosition(index: number): void {
    setSinglePrimary(this.positions, index, 'isPrimaryPosition');
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // CRUD — Leave
  // ═══════════════════════════════════════════════════════════════════════════

  addLeaveForm(): void {
    this.Leaves.push({ ...this.leaveForm });
    this.leaveForm = defaultLeaveForm();
  }

  removeLeaveForm(index: number): void {
    this.Leaves.splice(index, 1);
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // Submit / Create / Update
  // ═══════════════════════════════════════════════════════════════════════════

  onSubmit(): void {
    this.isEditMode ? this.updateEmployee() : this.createEmployee();
  }

  createEmployee(): void {
    if (!this.validateCoreFields() || !this.validateNewUserFields()) return;

    const payload = {
      employee: this.getEmployeePayload(),
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
    console.log('Final Payload', JSON.stringify(payload, null, 2));

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

  updateEmployee(): void {
    if (!this.validateCoreFields()) return;

    const payload = this.getEmployeePayload();
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
        this.toastr.error(error?.error?.message || 'Failed to update Employee.', 'Error');
      },
    });
  }

  cancel(): void {
    this.router.navigate(['/panel/forms/view-all-employees']);
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // Load single employee (edit mode)
  // ═══════════════════════════════════════════════════════════════════════════

  loadSingleEmployee(publicId: string): void {
    this.loader.show();
    this.formSv.GetEmployeesListById(publicId).subscribe({
      next: (res: any) => {
        this.loader.hide();
        const d = res.data?.employee ?? res.data ?? {};
        const [first, ...rest] = (d.fullName ?? '').trim().split(' ');
        this.userFirstName = first ?? '';
        this.userLastName = rest.join(' ');
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

  // ═══════════════════════════════════════════════════════════════════════════
  // Dropdown toggle / select — delegate to EmployeeDropdownState
  // ═══════════════════════════════════════════════════════════════════════════

  toggleDropdown(event: Event, name: string): void {
    event.stopPropagation();
    this.dd.toggle(name);
  }

  @HostListener('document:click')
  closeAllDropdowns(): void {
    this.dd.closeAll();
  }

  // ── Individual select handlers ────────────────────────────────────────────

  selectEmploymentStatus(status: string, e: Event) {
    e.stopPropagation();
    this.dd.selectedEmploymentStatus = status;
    this.employmentStatus = status;
    this.dd.isEmploymentStatusOpen = false;
  }
  selectOnboardingStatus(status: string, e: Event) {
    e.stopPropagation();
    this.dd.selectedOnboardingStatus = status;
    this.onboardingStatus = status;
    this.dd.isOnboardingStatusOpen = false;
  }
  selectEmployeeType(type: string, e: Event) {
    e.stopPropagation();
    this.dd.selectedEmployeeType = type;
    this.employeeType = type;
    this.dd.isEmployeeTypeOpen = false;
  }
  selectProficiency(level: string, e: Event) {
    e.stopPropagation();
    this.dd.selectedProficiency = level;
    this.skillsForm.proficiencyLevel = level;
    this.dd.isProficiencyOpen = false;
  }
  selectSkillStatus(status: string, e: Event) {
    e.stopPropagation();
    this.dd.selectedSkillStatus = status;
    this.skillsForm.status = status;
    this.dd.isSkillStatusOpen = false;
  }
  selectExperienceStatus(status: string, e: Event) {
    e.stopPropagation();
    this.dd.selectedExperienceStatus = status;
    this.expform.status = status;
    this.dd.isExperienceStatusOpen = false;
  }
  selectResultStatus(result: string, e: Event) {
    e.stopPropagation();
    this.dd.selectedResultStatus = result;
    this.qualificationForm.resultStatus = result;
    this.dd.isResultStatusOpen = false;
  }
  selectQualificationStatus(s: string, e: Event) {
    e.stopPropagation();
    this.dd.selectedQualificationStatus = s;
    this.qualificationForm.status = s;
    this.dd.isQualificationStatusOpen = false;
  }
  selectBankStatus(status: string, e: Event) {
    e.stopPropagation();
    this.dd.selectedBankStatus = status;
    this.bankAccountForm.status = status;
    this.dd.isBankStatusOpen = false;
  }
  selectDocType(type: any, e: Event) {
    e.stopPropagation();
    this.dd.selectedDocType = type.name;
    this.documentForm.idTypePublicId = type.publicId;
    this.dd.isDocTypeOpen = false;
  }
  selectDocStatus(status: string, e: Event) {
    e.stopPropagation();
    this.dd.selectedDocStatus = status;
    this.documentForm.status = status;
    this.dd.isDocStatusOpen = false;
  }
  selectConditionStatus(c: string, e: Event) {
    e.stopPropagation();
    this.dd.selectedConditionStatus = c;
    this.belongingForm.conditionStatus = c;
    this.dd.isConditionStatusOpen = false;
  }
  selectRelation(relation: string, e: Event) {
    e.stopPropagation();
    this.dd.selectedRelation = relation;
    this.familyMemberForm.relationName = relation;
    this.dd.isRelationOpen = false;
  }
  selectFamilyMemberStatus(s: string, e: Event) {
    e.stopPropagation();
    this.dd.selectedFamilyMemberStatus = s;
    this.familyMemberForm.status = s;
    this.dd.isFamilyMemberStatusOpen = false;
  }
  selectPositionStatus(s: string, e: Event) {
    e.stopPropagation();
    this.dd.selectedPositionStatus = s;
    this.positionForm.status = s;
    this.dd.isPositionStatusOpen = false;
  }
  selectBelongingStatus(s: string, e: Event) {
    e.stopPropagation();
    this.dd.selectedBelongingStatus = s;
    this.belongingForm.status = s;
    this.dd.isBelongingStatusOpen = false;
  }

  selectBelongingType(belonging: any, e: Event) {
    e.stopPropagation();
    this.dd.selectedBelongingType = belonging.name;
    this.belongingForm.belongingTypePublicId = belonging.publicId;
    this.belongingForm.belongingname = belonging.name;
    this.dd.isBelongingTypeOpen = false;
  }

  selectDepartment(dept: any, e: Event) {
    e.stopPropagation();
    this.dd.selectedDepartment = dept;
    this.positionForm.departmentPublicId = dept.publicId;
    this.dd.isDepartmentOpen = false;
  }
  selectDesignation(desig: any, e: Event) {
    e.stopPropagation();
    this.dd.selectedDesignation = desig;
    this.positionForm.designationPublicId = desig.publicId;
    this.dd.isDesignatiomOpen = false;
  }
  selectReportingManager(mgr: any, e: Event) {
    e.stopPropagation();
    this.dd.selectedReportingManager = mgr;
    this.positionForm.reportingManagerPublicId = mgr.employeePublicId;
    this.dd.isReportingManagerOpen = false;
  }
  selectBranch(branch: any, e: Event) {
    e.stopPropagation();
    this.dd.selcetedBranch = branch;
    this.positionForm.branchPublicId = branch.publicId;
    this.dd.isBranchOpen = false;
  }
  selectEmployeeGrade(grade: any, e: Event) {
    e.stopPropagation();
    this.dd.selectedEmployeeGrade = grade;
    this.positionForm.employeeGradePublicId = grade.publicId;
    this.dd.isEmployeeGradeOpen = false;
  }
  selectemployeeCatergory(cat: any, e: Event) {
    e.stopPropagation();
    this.dd.SlectedEmployeeCategory = cat;
    this.positionForm.employeeCategoryPublicId = cat.publicId;
    this.dd.isEmployeeCategoryOpen = false;
  }
  selectJobTitle(jt: any, e: Event) {
    e.stopPropagation();
    this.dd.selectedJobTitle = jt;
    this.positionForm.jobTitlePublicId = jt.publicId;
    this.dd.isJobTitleOpen = false;
  }
  selectShift(shift: any, e: Event) {
    e.stopPropagation();
    this.dd.selectedShift = shift;
    this.positionForm.shiftPublicId = shift.publicId;
    this.dd.isShiftOpen = false;
  }
  selectWorkSchedule(ws: any, e: Event) {
    e.stopPropagation();
    this.dd.selectedWorkSchedule = ws;
    this.positionForm.workSchedulePublicId = ws.publicId;
    this.dd.isWorkScheduleOpen = false;
  }
  selectedLeaveType(lt: any, e: Event) {
    e.stopPropagation();
    this.dd.selectLeaveType = lt.name;
    this.leaveForm.leaveTypeName = lt.name;
    this.leaveForm.leaveTypePublicId = lt.publicId;
    this.dd.isLeaveTypeOpen = false;
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // Private helpers
  // ═══════════════════════════════════════════════════════════════════════════

  private getEmployeePayload() {
    return buildEmployeePayload({
      code: this.code,
      userFirstName: this.userFirstName,
      userLastName: this.userLastName,
      email: this.email,
      mobileNumber: this.mobileNumber,
      employmentStatus: this.employmentStatus,
      onboardingStatus: this.onboardingStatus,
      employeeType: this.employeeType,
      dateOfBirth: this.dateOfBirth,
      dateOfJoining: this.dateOfJoining,
      dateOfLeaving: this.dateOfLeaving,
      remarks: this.remarks,
      qualifications: this.qualifications,
      skills: this.skills,
      experiences: this.experiences,
      bankAccounts: this.bankAccounts,
      documents: this.documents,
      belongings: this.belongings,
      familyMembers: this.familyMembers,
      positions: this.positions,
      leaves: this.Leaves,
    });
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

  resetForm(): void {
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

  // ─── Lookup loaders (grouped) ─────────────────────────────────────────────

  private loadAllLookups(): void {
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

  private loadDepartment(): void {
    this.formSv.GetDepartment(this.currentPage, this.pageSize).subscribe({
      next: (res: any) => {
        if (res.success) this.departmentList = res.data;
      },
      error: (err: any) => console.error(err),
    });
  }

  private loadDesignation(): void {
    this.formSv.getAllDesignations(this.currentPage, this.pageSize).subscribe({
      next: (res: any) => {
        if (res.success) this.designationList = res.data;
      },
      error: (err: any) => console.error(err),
    });
  }

  private loadCompanyBranch(): void {
    this.formSv.getAllComapnyBranches(this.currentPage, this.pageSize).subscribe({
      next: (res: any) => {
        if (res.success) this.companyBranchList = res.data;
      },
      error: (err: any) => console.error(err),
    });
  }

  private loadEmployeeGrade(): void {
    this.formSv.GetEmployeeGrade(this.currentPage, this.pageSize).subscribe({
      next: (res: any) => {
        if (res.success) this.EmployeeGradeList = res.data;
      },
      error: (err: any) => console.error(err),
    });
  }

  private loadEmployeeCategory(): void {
    this.formSv.GetEmployeeCaterogy(this.currentPage, this.pageSize).subscribe({
      next: (res: any) => {
        if (res.success) this.EmployeeCategoryList = res.data;
      },
      error: (err: any) => console.error(err),
    });
  }

  private loadJobTitle(): void {
    this.formSv.GetJobTitle(this.currentPage, this.pageSize).subscribe({
      next: (res: any) => {
        if (res.success) this.JobTitleList = res.data;
      },
      error: (err: any) => console.error(err),
    });
  }

  private loadshift(): void {
    this.formSv.getAllShifts(this.currentPage, this.pageSize).subscribe({
      next: (res: any) => {
        if (res.success) this.shiftList = res.data;
      },
      error: (err: any) => console.error(err),
    });
  }

  private loadWorkSchedule(): void {
    this.formSv.getAllWorkSchedules(this.currentPage, this.pageSize).subscribe({
      next: (res: any) => {
        if (res.success) this.WorkScheduleList = res.data;
      },
      error: (err: any) => console.error(err),
    });
  }

  private loadEmployee(): void {
    this.formSv.GetEmployees(this.currentPage, this.pageSize).subscribe({
      next: (res: any) => {
        if (res.success) this.EmployeeList = res.data;
      },
      error: (err: any) => console.error(err),
    });
  }

  private getRole(): void {
    this.usersv.getRoles(this.currentPage, this.pageSize).subscribe({
      next: (res: any) => {
        if (res.success) this.roleList = res.data;
      },
      error: (err: any) => console.error(err),
    });
  }

  private GetIdType(): void {
    this.formSv.GetIDType(this.currentPage, this.pageSize).subscribe({
      next: (res: any) => {
        if (res.success) this.IdTypeList = res.data;
      },
      error: (err: any) => console.error(err),
    });
  }

  private getBelongingType(): void {
    this.formSv.GetBelongingTypes(this.currentPage, this.pageSize).subscribe({
      next: (res: any) => {
        if (res.success) this.belongingList = res.data;
      },
      error: (err: any) => console.error(err),
    });
  }

  private getLeaveType(): void {
    this.formSv.GetLeaveType(this.currentPage, this.pageSize).subscribe({
      next: (res: any) => {
        if (res.success) this.LeaveTypeList = res.data;
      },
      error: (err: any) => console.error(err),
    });
  }
}
