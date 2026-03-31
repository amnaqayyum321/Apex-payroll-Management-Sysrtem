import { Component, OnInit } from '@angular/core';
import { FormsService } from '../../Services/forms';
import { ToastrService } from 'ngx-toastr';
import { LoaderService } from '../../../../core/services/management-services/loader.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-employees',
  imports: [FormsModule, CommonModule, RouterModule],
  templateUrl: './employees.html',
  styleUrl: './employees.scss',
})
export class Employees implements OnInit {
  // Core employee fields
  code: string = '';
  fullName: string = '';
  email: string = '';
  dateOfBirth: string = '';
  dateOfJoining: string = '';
  dateOfLeaving: string = '';
  mobileNumber: string = '';
  employmentStatus: string = '';
  onboardingStatus: string = '';
  employeeType: string = '';
  remarks: string = '';
  recruitmentBypassReason: string = '';
  recruitmentBypassAcknowledged: boolean = false;

  // Create new user fields
  userFirstName: string = '';
  userLastName: string = '';
  roleCode: string = '';
  initialPassword: string = '';

  // State
  publicId: string | null = null;
  isEditMode: boolean = false;
  disabled: boolean = false;

  constructor(
    private loader: LoaderService,
    private formSv: FormsService,
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
  }

  // ─── Validation ───────────────────────────────────────────────────────────

  private validateCoreFields(): boolean {
    if (
      !this.code ||
      !this.fullName ||
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
    if (!this.userFirstName || !this.userLastName || !this.roleCode || !this.initialPassword) {
      this.toastr.error('Please fill in all new user required fields', 'Validation Error');
      return false;
    }
    if (this.initialPassword.length < 8) {
      this.toastr.error('Initial password must be at least 8 characters', 'Validation Error');
      return false;
    }
    return true;
  }

  // ─── Submit Router ─────────────────────────────────────────────────────────

  onSubmit() {
    if (this.isEditMode) {
      this.updateEmployee();
    } else {
      this.createEmployeeWithNewUser(); // ← always new user
    }
  }

  // ─── Create Employee with New User ─────────────────────────────────────────

  createEmployeeWithNewUser() {
    if (!this.validateCoreFields()) return;
    if (!this.validateNewUserFields()) return;

    const payload = {
      code: this.code,
      fullName: this.fullName,
      email: this.email,
      mobileNumber: this.mobileNumber,
      employmentStatus: this.employmentStatus,
      onboardingStatus: this.onboardingStatus,
      employeeType: this.employeeType,
      dateOfBirth: this.dateOfBirth || null,
      dateOfJoining: this.dateOfJoining || null,
      dateOfLeaving: this.dateOfLeaving || null,
      remarks: this.remarks,
      userFirstName: this.userFirstName,
      userLastName: this.userLastName,
      roleCode: this.roleCode,
      initialPassword: this.initialPassword,
      recruitmentBypassAcknowledged: this.recruitmentBypassAcknowledged,
      recruitmentBypassReason: this.recruitmentBypassReason,
    };

    this.loader.show();
    this.disabled = true;

    this.formSv.PostEmployeeWithNewUser(payload).subscribe({
      next: () => {
        this.loader.hide();
        this.toastr.success('Employee & User created successfully', 'Success');
        this.resetForm();
        setTimeout(() => this.router.navigate(['/panel/forms/view-all-employees']), 1500);
      },
      error: (error: any) => {
        this.loader.hide();
        this.disabled = false;
        this.toastr.error(
          error?.error?.message || 'Failed to create Employee. Please try again.',
          'Error',
        );
      },
    });
  }

  // ─── Load Single Employee (Edit Mode) ──────────────────────────────────────

  loadSingleEmployee(publicId: string) {
    this.loader.show();
    this.formSv.GetEmployeesListById(publicId).subscribe({
      next: (res: any) => {
        this.loader.hide();
        const d = res.data;
        this.code = d.code ?? '';
        this.fullName = d.fullName ?? '';
        this.email = d.email ?? '';
        this.dateOfBirth = d.dateOfBirth ?? '';
        this.dateOfJoining = d.dateOfJoining ?? '';
        this.dateOfLeaving = d.dateOfLeaving ?? '';
        this.mobileNumber = d.mobileNumber ?? '';
        this.employmentStatus = d.employmentStatus ?? '';
        this.onboardingStatus = d.onboardingStatus ?? '';
        this.employeeType = d.employeeType ?? '';
        this.remarks = d.remarks ?? '';
        this.recruitmentBypassAcknowledged = d.recruitmentBypassAcknowledged ?? false;
        this.recruitmentBypassReason = d.recruitmentBypassReason ?? '';
      },
      error: () => {
        this.loader.hide();
        this.toastr.error('Failed to load Employee', 'Error');
      },
    });
  }

  // ─── Update Employee ───────────────────────────────────────────────────────

  updateEmployee() {
    if (!this.validateCoreFields()) return;

    const payload = {
      code: this.code,
      fullName: this.fullName,
      email: this.email,
      mobileNumber: this.mobileNumber,
      employmentStatus: this.employmentStatus,
      onboardingStatus: this.onboardingStatus,
      employeeType: this.employeeType,
      dateOfBirth: this.dateOfBirth || null,
      dateOfJoining: this.dateOfJoining || null,
      dateOfLeaving: this.dateOfLeaving || null,
      remarks: this.remarks,
      recruitmentBypassAcknowledged: this.recruitmentBypassAcknowledged,
      recruitmentBypassReason: this.recruitmentBypassReason,
    };

    this.loader.show();
    this.disabled = true;

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

  // ─── Reset & Cancel ────────────────────────────────────────────────────────

  resetForm() {
    this.code = '';
    this.fullName = '';
    this.email = '';
    this.dateOfBirth = '';
    this.dateOfJoining = '';
    this.dateOfLeaving = '';
    this.mobileNumber = '';
    this.employmentStatus = '';
    this.onboardingStatus = '';
    this.employeeType = '';
    this.remarks = '';
    this.recruitmentBypassAcknowledged = false;
    this.recruitmentBypassReason = '';
    this.userFirstName = '';
    this.userLastName = '';
    this.roleCode = '';
    this.initialPassword = '';
    this.disabled = false;
  }

  cancel() {
    this.router.navigate(['/panel/forms/view-all-employees']);
  }
}
