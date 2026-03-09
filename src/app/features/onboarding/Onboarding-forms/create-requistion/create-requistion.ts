import { Component, HostListener } from '@angular/core';
import { LoaderService } from '../../../../core/services/management-services/loader.service';
import { OnboardingService } from '../../Services/onboarding';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsService } from '../../../forms/Services/forms';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-create-requistion',
  imports: [CommonModule, FormsModule],
  templateUrl: './create-requistion.html',
  styleUrl: './create-requistion.scss',
})
export class CreateRequistion {
  // ... existing properties ...
  code: string = '';
  name: string = '';
  status: string = 'DRAFT';
  requestedDate: string = '';
  targetJoiningDate: string = '';
  roleName: string = '';
  requiredCount: number = 0;
  minExperienceYears: number = 0;
  maxExperienceYears: number = 0;
  budgetAmount: number = 0;
  currency: string = '';
  departmentPublicId: string = '';
  designationPublicId: string = '';
  companyBranchPublicId: string = '';
  hiringManagerMode: 'SELF' | 'SELECTED' = 'SELECTED';
  hiringManagerPublicId: string = '';
  remarks: string = '';
  disabled: boolean = false;
  currentPage: number = 0;
  pageSize: number = 100;
  publicId: string | null = null;
  isEditMode: boolean = false;

  employeeList: any[] = [];
  companyBranchList: any[] = [];
  DepartmentList: any[] = [];
  DesignationList: any[] = [];

  // Dropdown states
  isDepartmentDropdownOpen: boolean = false;
  isDesignationDropdownOpen: boolean = false;
  isBranchDropdownOpen: boolean = false;
  isEmployeeDropdownOpen: boolean = false;

  // Selected display names
  selectedDepartmentName: string = '';
  selectedDesignationName: string = '';
  selectedBranchName: string = '';
  selectedEmployeeName: string = '';

  constructor(
    private loader: LoaderService,
    private onBoardingSV: OnboardingService,
    private FormSV: FormsService,
    private toastr: ToastrService,
    private router: Router,
    private route: ActivatedRoute,
  ) {}

  ngOnInit() {
    this.publicId = this.route.snapshot.paramMap.get('id');
    if (this.publicId) {
      this.isEditMode = true;
    }
    this.FormSV.GetEmployees(this.currentPage, this.pageSize).subscribe({
      next: (res: any) => {
        if (res.success) {
          this.employeeList = res.data;
        }
        if (this.publicId) {
          this.loadSingleRequistion(this.publicId);
        }
      },
      error: (err: any) => {
        console.log(err);
        if (this.publicId) {
          this.loadSingleRequistion(this.publicId);
        }
      },
    });
    this.GetCompanyBranch();
    this.GetDepartment();
    this.GetDesignation();
  }

  // Dropdown toggles
  toggleDepartmentDropdown(event: Event) {
    event.stopPropagation();
    this.isDepartmentDropdownOpen = !this.isDepartmentDropdownOpen;
    this.closeOtherDropdowns('department');
  }

  toggleDesignationDropdown(event: Event) {
    event.stopPropagation();
    this.isDesignationDropdownOpen = !this.isDesignationDropdownOpen;
    this.closeOtherDropdowns('designation');
  }

  toggleBranchDropdown(event: Event) {
    event.stopPropagation();
    this.isBranchDropdownOpen = !this.isBranchDropdownOpen;
    this.closeOtherDropdowns('branch');
  }

  toggleEmployeeDropdown(event: Event) {
    event.stopPropagation();
    this.isEmployeeDropdownOpen = !this.isEmployeeDropdownOpen;
    this.closeOtherDropdowns('employee');
  }

  // Close all except the one we're toggling
  private closeOtherDropdowns(except: string) {
    if (except !== 'department') this.isDepartmentDropdownOpen = false;
    if (except !== 'designation') this.isDesignationDropdownOpen = false;
    if (except !== 'branch') this.isBranchDropdownOpen = false;
    if (except !== 'employee') this.isEmployeeDropdownOpen = false;
  }

  // Selection methods
  selectDepartment(dept: any, event: Event) {
    event.stopPropagation();
    this.departmentPublicId = dept.publicId;
    this.selectedDepartmentName = dept.name;
    this.isDepartmentDropdownOpen = false;
  }

  selectDesignation(desig: any, event: Event) {
    event.stopPropagation();
    this.designationPublicId = desig.publicId;
    this.selectedDesignationName = desig.name;
    this.isDesignationDropdownOpen = false;
  }

  selectBranch(branch: any, event: Event) {
    event.stopPropagation();
    this.companyBranchPublicId = branch.publicId;
    this.selectedBranchName = branch.name;
    this.isBranchDropdownOpen = false;
  }

  selectEmployee(emp: any, event: Event) {
    event.stopPropagation();
    this.hiringManagerPublicId = emp.publicId;
    this.selectedEmployeeName = emp.fullName;
    this.isEmployeeDropdownOpen = false;
  }

  // Close all dropdowns when clicking outside
  @HostListener('document:click')
  closeAllDropdowns() {
    this.isDepartmentDropdownOpen = false;
    this.isDesignationDropdownOpen = false;
    this.isBranchDropdownOpen = false;
    this.isEmployeeDropdownOpen = false;
  }

  onHiringManagerModeChange() {
    this.hiringManagerPublicId = '';
    this.selectedEmployeeName = '';
  }

  createRequisition() {
    if (!this.code ||
      !this.name ||
      !this.departmentPublicId ||
      !this.designationPublicId ||
      !this.remarks) {
      this.toastr.error('Please fill in all required fields');
      return;
    }
      if (this.requiredCount <= 0) {
      this.toastr.error('Required must be greater then 0');
      return;
    }
    if (this.budgetAmount <= 0) {
      this.toastr.error('budgetAmount must be greater then 0');
      return;
    }
    if (this.minExperienceYears > this.maxExperienceYears) {
      this.toastr.error('Min experience cannot be greater than Max experience');
      return;
    }
    if (new Date(this.targetJoiningDate) < new Date(this.requestedDate)) {
      this.toastr.error('Target joining date cannot be before requested date');
      return;
    }
    if (this.hiringManagerMode === 'SELECTED' && !this.hiringManagerPublicId) {
      this.toastr.error('Please select a Hiring Manager');
      return;
    }
    let payload = {
      code: this.code,
      name: this.name,
      status: this.status,
      requestedDate: this.requestedDate,
      targetJoiningDate: this.targetJoiningDate,
      roleName: this.roleName,
      requiredCount: this.requiredCount,
      minExperienceYears: this.minExperienceYears,
      maxExperienceYears: this.maxExperienceYears,
      budgetAmount: this.budgetAmount,
      currency: this.currency,
      departmentPublicId: this.departmentPublicId,
      designationPublicId: this.designationPublicId,
      companyBranchPublicId: this.companyBranchPublicId,
      hiringManagerMode: this.hiringManagerMode,
      hiringManagerPublicId:
        this.hiringManagerMode === 'SELECTED' ? this.hiringManagerPublicId : null,
      remarks: this.remarks,
    };
    this.loader.show();
    this.disabled = true;
    this.onBoardingSV.CreatenewJobRequisition(payload).subscribe({
      next: (res: any) => {
        this.loader.hide();
        this.toastr.success('Requisition created successfully', 'Success');
        this.resetRequisitionForm();
        setTimeout(() => {
          this.router.navigate(['/panel/onboarding/view-req-list']);
        }, 1500);
      },
      error: (error: any) => {
        this.loader.hide();
        this.disabled = false;
        this.toastr.error(
          error.error.message || 'Failed to create Requisition. Please try again.',
          'Error',
        );
      },
    });
  }

  resetRequisitionForm() {
    this.code = '';
    this.name = '';
    this.status = 'DRAFT';
    this.requestedDate = '';
    this.targetJoiningDate = '';
    this.roleName = '';
    this.requiredCount = 0;
    this.minExperienceYears = 0;
    this.maxExperienceYears = 0;
    this.budgetAmount = 0;
    this.currency = '';
    this.departmentPublicId = '';
    this.designationPublicId = '';
    this.companyBranchPublicId = '';
    this.hiringManagerMode = 'SELECTED';
    this.hiringManagerPublicId = '';
    this.remarks = '';
    this.disabled = false;

    // Reset dropdown display names
    this.selectedDepartmentName = '';
    this.selectedDesignationName = '';
    this.selectedBranchName = '';
    this.selectedEmployeeName = '';
  }

  cancel() {
    this.router.navigate(['/panel/onboarding/view-req-list']);
  }

  loadSingleRequistion(publicId: string) {
    this.loader.show();
    this.onBoardingSV.getJobRequisitionById(publicId).subscribe({
      next: (res: any) => {
        this.loader.hide();
        const data = res.data;
        this.code = data.code;
        this.name = data.name;
        this.status = data.status;
        this.requestedDate = data.requestedDate;
        this.targetJoiningDate = data.targetJoiningDate;
        this.roleName = data.roleName;
        this.requiredCount = data.requiredCount;
        this.minExperienceYears = data.minExperienceYears;
        this.maxExperienceYears = data.maxExperienceYears;
        this.budgetAmount = data.budgetAmount;
        this.currency = data.currency;
        this.departmentPublicId = data.departmentPublicId;
        this.designationPublicId = data.designationPublicId;
        this.companyBranchPublicId = data.companyBranchPublicId;
        this.hiringManagerMode = data.hiringManagerMode;
        this.hiringManagerPublicId = data.hiringManagerPublicId || '';
        // If hiringManagerPublicId exists, mode must be SELECTED
        this.hiringManagerMode = this.hiringManagerPublicId ? 'SELECTED' : 'SELF';
        this.remarks = data.remarks;

        // Set display names from lists
        this.setSelectedNames();
      },
      error: () => {
        this.loader.hide();
        this.toastr.error('Failed to load Requisition');
      },
    });
  }

  private setSelectedNames() {
    // Department
    const dept = this.DepartmentList.find(d => d.publicId === this.departmentPublicId);
    this.selectedDepartmentName = dept ? dept.name : '';

    // Designation
    const desig = this.DesignationList.find(d => d.publicId === this.designationPublicId);
    this.selectedDesignationName = desig ? desig.name : '';

    // Branch
    const branch = this.companyBranchList.find(b => b.publicId === this.companyBranchPublicId);
    this.selectedBranchName = branch ? branch.name : '';

    // Employee (if any)
    if (this.hiringManagerPublicId) {
      const emp = this.employeeList.find(e => e.publicId === this.hiringManagerPublicId);
      this.selectedEmployeeName = emp ? emp.fullName : '';
    }
  }

   updateRequisition() {
    const payload = {
      code: this.code,
      name: this.name,
      status: this.status,
      requestedDate: this.requestedDate,
      targetJoiningDate: this.targetJoiningDate,
      roleName: this.roleName,
      requiredCount: this.requiredCount,
      minExperienceYears: this.minExperienceYears,
      maxExperienceYears: this.maxExperienceYears,
      budgetAmount: this.budgetAmount,
      currency: this.currency,
      departmentPublicId: this.departmentPublicId,
      designationPublicId: this.designationPublicId,
      companyBranchPublicId: this.companyBranchPublicId,
      hiringManagerMode: this.hiringManagerMode,
      hiringManagerPublicId:
        this.hiringManagerMode === 'SELECTED' ? this.hiringManagerPublicId : null,
      remarks: this.remarks,
    };
    this.loader.show();
    this.onBoardingSV.updateJobRequisition(this.publicId!, payload).subscribe({
      next: () => {
        this.loader.hide();
        this.toastr.success('Requisition updated');
        this.resetRequisitionForm();
        setTimeout(() => {
          this.router.navigate(['/panel/onboarding/view-req-list']);
        }, 1500);
      },
      error: () => {
        this.loader.hide();
        this.toastr.error('Requisition Update failed');
      },
    });
  }

  GetCompanyBranch() {
    this.FormSV.getAllComapnyBranches(this.currentPage, this.pageSize).subscribe(
      (res: any) => {
        if (res.success) {
          this.companyBranchList = res.data;
        }
      },
      (error: any) => console.log(error)
    );
  }

  GetDepartment() {
    this.FormSV.GetDepartment(this.currentPage, this.pageSize).subscribe(
      (res: any) => {
        if (res.success) {
          this.DepartmentList = res.data;
        }
      },
      (error: any) => console.log(error)
    );
  }

  GetDesignation() {
    this.FormSV.getAllDesignations(this.currentPage, this.pageSize).subscribe(
      (res: any) => {
        if (res.success) {
          this.DesignationList = res.data;
        }
      },
      (error: any) => console.log(error)
    );
  }
}