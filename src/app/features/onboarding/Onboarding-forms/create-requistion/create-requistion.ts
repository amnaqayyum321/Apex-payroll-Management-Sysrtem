import { Component } from '@angular/core';
import { LoaderService } from '../../../../core/services/management-services/loader.service';
import { OnboardingService } from '../../Services/onboarding';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsService } from '../../../forms/Services/forms';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { retry } from 'rxjs';

@Component({
  selector: 'app-create-requistion',
  imports: [CommonModule, FormsModule],
  templateUrl: './create-requistion.html',
  styleUrl: './create-requistion.scss',
})
export class CreateRequistion {
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
          console.log('employee List', res);
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
  onHiringManagerModeChange() {
    this.hiringManagerPublicId = '';
  }
  createRequisition() {
    if (
      !this.code ||
      !this.name ||
      !this.departmentPublicId ||
      !this.designationPublicId ||
      !this.remarks
    ) {
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
        this.toastr.success('Requesition created successfully', 'Success');
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
  }
  cancel() {
    this.router.navigate(['/panel/onboarding/view-req-list']);
  }
  loadSingleRequistion(publicId: string) {
    this.loader.show();
    this.onBoardingSV.getJobRequisitionById(publicId!).subscribe({
      next: (res: any) => {
        console.log('API response:', res.data);
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
        this.hiringManagerMode = this.hiringManagerPublicId ? 'SELECTED' : 'SELF';
        this.remarks = data.remarks;
      },
      error: () => {
        this.loader.hide();
        this.toastr.error('Failed to load Requisition');
      },
    });
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
          console.log('Compnay Branch List', res);
        }
      },
      (error: any) => {
        console.log(error);
      },
    );
  }
  GetDepartment() {
    this.FormSV.GetDepartment(this.currentPage, this.pageSize).subscribe(
      (res: any) => {
        if (res.success) {
          this.DepartmentList = res.data;
          console.log('Department List', res);
        }
      },
      (error: any) => {
        console.log(error);
      },
    );
  }
  GetDesignation() {
    this.FormSV.getAllDesignations(this.currentPage, this.pageSize).subscribe(
      (res: any) => {
        if (res.success) {
          this.DesignationList = res.data;
          console.log('Compnay Branch List', res);
        }
      },
      (error: any) => {
        console.log(error);
      },
    );
  }
}
