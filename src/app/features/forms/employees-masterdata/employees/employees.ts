import { Component, HostListener, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';

import { FormsService } from '../../Services/forms';
import { ToastrService } from 'ngx-toastr';
import { LoaderService } from '../../../../core/services/management-services/loader.service';
import { UsersAndRolesService } from '../../../Users-And-Roles/Services/user-roles';

import { EmpLoaders } from '../../../../employee/service/Emp.loaders';
import { Tab } from '../../../../employee/models/employee.model';
import {
  EMPLOYMENT_STATUS_OPTIONS,
  ONBOARDING_STATUS_OPTIONS,
  EMPLOYEE_TYPE_OPTIONS,
  PROFICIENCY_OPTIONS,
  STATUS_OPTIONS,
  RESULT_STATUS_OPTIONS,
  DOC_TYPE_OPTIONS,
  BELONGING_TYPE_OPTIONS,
  CONDITION_STATUS_OPTIONS,
  RELATION_OPTIONS,
  SIDEBAR_TABS,
} from '../../../../employee/constant/employee.constants';
import {
  validateCoreFields,
  validateNewUserFields,
  buildEmployeePayload,
  buildCreatePayload,
  EmployeePayloadInput,
} from '../../../../employee/state/emp.payload';

@Component({
  selector: 'app-employees',
  imports: [FormsModule, CommonModule, RouterModule],
  templateUrl: './employees.html',
  styleUrl: './employees.scss',
})
export class Employees extends EmpLoaders implements OnInit {
  title: 'create' | 'edit' = 'create';
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
  publicId: string | null = null;
  isEditMode = false;
  disabled = false;
  activeTabId = 'experience';
  activeTab = 'experience';
  tabPage = 0;
  tabsPerPage = 7;
  sidebarTabs: Tab[] = SIDEBAR_TABS;
  employmentStatusOptions = EMPLOYMENT_STATUS_OPTIONS;
  onboardingStatusOptions = ONBOARDING_STATUS_OPTIONS;
  employeeTypeOptions = EMPLOYEE_TYPE_OPTIONS;
  proficiencyOptions = PROFICIENCY_OPTIONS;
  statusOptions = STATUS_OPTIONS;
  resultStatusOptions = RESULT_STATUS_OPTIONS;
  docTypeOptions = DOC_TYPE_OPTIONS;
  belongingTypeOptions = BELONGING_TYPE_OPTIONS;
  conditionStatusOptions = CONDITION_STATUS_OPTIONS;
  relationOptions = RELATION_OPTIONS;

  constructor(
    private loader: LoaderService,
    private formSv: FormsService,
    private usersv: UsersAndRolesService,
    private toastr: ToastrService,
    private router: Router,
    private route: ActivatedRoute,
  ) {
    super();
  }
  protected get _formSv(): FormsService {
    return this.formSv;
  }
  protected get _usersv(): UsersAndRolesService {
    return this.usersv;
  }
  ngOnInit() {
    this.publicId = this.route.snapshot.paramMap.get('id');
    if (this.publicId) {
      this.isEditMode = true;
      this.loadSingleEmployee(this.publicId);
    }
    this.loadAllDropdowns();
  }
  setTab(tab: string) {
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

  nextTabPage() {
    if (this.hasNextPage) this.tabPage++;
  }
  prevTabPage() {
    if (this.hasPrevPage) this.tabPage--;
  }

  isNotExpired(dateStr: string): boolean {
    if (!dateStr) return true;
    return new Date(dateStr) >= new Date();
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event) {
    this.closeAllDropdowns(event);
  }

  onSubmit() {
    this.isEditMode ? this.updateEmployee() : this.createEmployee();
  }

  private getPayloadInput(): EmployeePayloadInput {
    return {
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
      Leaves: this.Leaves,
    };
  }

  // ─── Create ────────────────────────────────────────────────────────────────
  createEmployee() {
    if (!validateCoreFields(this, this.toastr)) return;
    if (!validateNewUserFields(this.roleCode, this.userPassword, this.toastr)) return;

    const payload = buildCreatePayload(
      buildEmployeePayload(this.getPayloadInput()),
      this.userPublicId,
      this.email,
      this.userPassword,
      this.roleCode,
      this.userFirstName,
      this.userLastName,
      this.mobileNumber,
    );

    this.loader.show();
    this.disabled = true;
    console.log('final Payload', JSON.stringify(payload, null, 2));

    this.formSv.PostManualEmployee(payload).subscribe({
      next: () => {
        this.loader.hide();
        this.toastr.success('Employee created successfully', 'Success');
        this.resetFullForm();
        setTimeout(() => this.router.navigate(['/panel/forms/view-all-employees']), 1500);
      },
      error: (err: any) => {
        this.loader.hide();
        this.disabled = false;
        this.toastr.error(err?.error?.message || 'Failed to create Employee.', 'Error');
      },
    });
  }

  // ─── Update ────────────────────────────────────────────────────────────────
  updateEmployee() {
    if (!validateCoreFields(this, this.toastr)) return;

    const payload = buildEmployeePayload(this.getPayloadInput());

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
      error: (err: any) => {
        this.loader.hide();
        this.disabled = false;
        console.error('Full error:', err?.error);
        this.toastr.error(err?.error?.message || 'Failed to update Employee.', 'Error');
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

        // Core fields
        this.userFirstName = nameParts[0] ?? '';
        this.userLastName = nameParts.slice(1).join(' ') ?? '';
        this.code = d.code ?? '';
        this.email = d.email ?? '';
        this.mobileNumber = d.mobileNumber ?? '';
        this.remarks = d.remarks ?? '';
        this.dateOfBirth = d.dateOfBirth ?? '';
        this.dateOfJoining = d.dateOfJoining ?? '';
        this.dateOfLeaving = d.dateOfLeaving ?? '';

        // Sub-arrays
        this.qualifications = d.qualifications ?? [];
        this.skills = d.skills ?? [];
        this.experiences = d.experiences ?? [];
        this.bankAccounts = d.bankAccounts ?? [];
        this.documents = d.documents ?? [];
        this.belongings = d.belongings ?? [];
        this.familyMembers = d.familyMembers ?? [];
        this.positions = d.positions ?? [];
        this.Leaves = d.leaveEntitlements ?? [];

        // Dropdown sync
        this.employmentStatus = d.employmentStatus ?? '';
        this.selectedEmploymentStatus = d.employmentStatus ?? '';
        this.onboardingStatus = d.onboardingStatus ?? '';
        this.selectedOnboardingStatus = d.onboardingStatus ?? '';
        this.employeeType = d.employeeType ?? '';
        this.selectedEmployeeType = d.employeeType ?? '';
      },
      error: () => {
        this.loader.hide();
        this.toastr.error('Failed to load Employee', 'Error');
      },
    });
  }

  resetFullForm() {
    // Core
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

    // Dropdown labels
    this.selectedEmploymentStatus = '';
    this.selectedOnboardingStatus = '';
    this.selectedEmployeeType = '';

    // Arrays
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

    this.resetExpForm();
    this.resetSkillForm();
    this.resetQualificationForm();
    this.resetBankAccountForm();
    this.resetDocumentForm();
    this.resetBelongingForm();
    this.resetFamilyMemberForm();
    this.resetPositionForm();
    this.resetLeaveForm();
  }

  resetForm() {
    this.resetFullForm();
  }

  cancel() {
    this.router.navigate(['/panel/forms/view-all-employees']);
  }
}
