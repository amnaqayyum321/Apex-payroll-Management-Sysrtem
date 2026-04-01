import { Component, HostListener, OnInit } from '@angular/core';
import { OnboardingService } from '../../Services/onboarding';
import { LoaderService } from '../../../../core/services/management-services/loader.service';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FormsService } from '../../../forms/Services/forms';

@Component({
  selector: 'app-candidate-application',
  imports: [CommonModule, FormsModule],
  templateUrl: './candidate-application.html',
  styleUrl: './candidate-application.scss',
})
export class CandidateApplication implements OnInit {

  code = '';
  candidatePublicId = '';
  requisitionPublicId = '';
  applicationDate = '';
  expectedDoj = '';
  remarks = '';
  departmentPublicId = '';
  designationPublicId = '';
  companyBranchPublicId = '';

  departments: any[] = [];
  designations: any[] = [];
  companyBranches: any[] = [];

  candidates: any[] = [];
  requisitions: any[] = [];

  publicId: string | null = null;
  isEditMode = false;

  currentPage = 0;
  pageSize = 100;

  // Dropdown state variables
  isCandidateDropdownOpen = false;
  isRequisitionDropdownOpen = false;
  isDepartmentDropdownOpen = false;
  isDesignationDropdownOpen = false;
  isBranchDropdownOpen = false;

  // Selected labels
  selectedCandidateLabel = '';
  selectedRequisitionLabel = '';
  selectedDepartmentLabel = '';
  selectedDesignationLabel = '';
  selectedBranchLabel = '';

  constructor(
    private onboarding: OnboardingService,
    private loader: LoaderService,
    private toastr: ToastrService,
    private router: Router,
    private formsv: FormsService,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.loadCandidates();
    this.loadRequisitions();
    this.loadDepartments();
    this.loadDesignations();
    this.loadCompanyBranches();

    this.publicId = this.route.snapshot.paramMap.get('id');
    if (this.publicId) {
      this.isEditMode = true;
      this.loadSingleApplication();
    }
  }

  // Dropdown Methods
  toggleCandidateDropdown(event: Event) {
    event.stopPropagation();
    this.isCandidateDropdownOpen = !this.isCandidateDropdownOpen;
    this.closeOtherDropdowns('candidate');
  }

  selectCandidate(candidate: any, event: Event) {
    event.stopPropagation();
    this.candidatePublicId = candidate.publicId;
    this.selectedCandidateLabel = `${candidate.firstName} ${candidate.lastName}`;
    this.isCandidateDropdownOpen = false;
  }

  toggleRequisitionDropdown(event: Event) {
    event.stopPropagation();
    this.isRequisitionDropdownOpen = !this.isRequisitionDropdownOpen;
    this.closeOtherDropdowns('requisition');
  }

  selectRequisition(req: any, event: Event) {
    event.stopPropagation();
    this.requisitionPublicId = req.publicId;
    this.selectedRequisitionLabel = req.title || req.name;
    this.isRequisitionDropdownOpen = false;
  }

  toggleDepartmentDropdown(event: Event) {
    event.stopPropagation();
    this.isDepartmentDropdownOpen = !this.isDepartmentDropdownOpen;
    this.closeOtherDropdowns('department');
  }

  selectDepartment(dept: any, event: Event) {
    event.stopPropagation();
    this.departmentPublicId = dept.publicId;
    this.selectedDepartmentLabel = dept.name;
    this.isDepartmentDropdownOpen = false;
  }

  toggleDesignationDropdown(event: Event) {
    event.stopPropagation();
    this.isDesignationDropdownOpen = !this.isDesignationDropdownOpen;
    this.closeOtherDropdowns('designation');
  }

  selectDesignation(desig: any, event: Event) {
    event.stopPropagation();
    this.designationPublicId = desig.publicId;
    this.selectedDesignationLabel = desig.name;
    this.isDesignationDropdownOpen = false;
  }

  toggleBranchDropdown(event: Event) {
    event.stopPropagation();
    this.isBranchDropdownOpen = !this.isBranchDropdownOpen;
    this.closeOtherDropdowns('branch');
  }

  selectBranch(branch: any, event: Event) {
    event.stopPropagation();
    this.companyBranchPublicId = branch.publicId;
    this.selectedBranchLabel = branch.name;
    this.isBranchDropdownOpen = false;
  }

  private closeOtherDropdowns(current: string) {
    if (current !== 'candidate') this.isCandidateDropdownOpen = false;
    if (current !== 'requisition') this.isRequisitionDropdownOpen = false;
    if (current !== 'department') this.isDepartmentDropdownOpen = false;
    if (current !== 'designation') this.isDesignationDropdownOpen = false;
    if (current !== 'branch') this.isBranchDropdownOpen = false;
  }

  @HostListener('document:click', ['$event'])
  closeAllDropdowns(event?: Event) {
    this.isCandidateDropdownOpen = false;
    this.isRequisitionDropdownOpen = false;
    this.isDepartmentDropdownOpen = false;
    this.isDesignationDropdownOpen = false;
    this.isBranchDropdownOpen = false;
  }

  // Data Loading Methods
  loadCandidates() {
    this.onboarding.getAllCandidate(0, 100, 'ALL')
      .subscribe(res => this.candidates = res.data);
  }

  loadRequisitions() {
    this.onboarding.getAllJobRequisition(0, 100)
      .subscribe(res => {
        this.requisitions = res.data.filter((r: any) => r.status === 'OPEN');
      });
  }

  loadDepartments() {
    this.formsv.GetDepartment(0, 100, 'ALL')
      .subscribe(res => this.departments = res.data);
  }

  loadDesignations() {
    this.formsv.getAllDesignations(0, 100, 'ALL')
      .subscribe(res => this.designations = res.data);
  }

  loadCompanyBranches() {
    this.formsv.getAllComapnyBranches(0, 100, 'ALL')
      .subscribe(res => this.companyBranches = res.data);
  }

  createApplication() {
    if (!this.candidatePublicId || !this.requisitionPublicId) {
      this.toastr.error('Candidate and Requisition required');
      return;
    }

    const payload = {
      code: this.code,
      candidatePublicId: this.candidatePublicId,
      requisitionPublicId: this.requisitionPublicId,
      departmentPublicId: this.departmentPublicId,
      designationPublicId: this.designationPublicId,
      companyBranchPublicId: this.companyBranchPublicId,
      applicationDate: this.applicationDate,
      expectedDoj: this.expectedDoj,
      remarks: this.remarks
    };

    this.loader.show();

    this.onboarding.CreatenewCandidateApplication(payload)
      .subscribe({
        next: () => {
          this.loader.hide();
          this.toastr.success('Application Created');
          this.router.navigate(['/panel/onboarding/view-candidate-application-list']);
        },
        error: err => {
          this.loader.hide();
          this.toastr.error(err.error?.message || 'Creation Failed');
        }
      });
  }

  updateApplication() {
    const payload = {
      code: this.code,
      candidatePublicId: this.candidatePublicId,
      requisitionPublicId: this.requisitionPublicId,
      departmentPublicId: this.departmentPublicId,
      designationPublicId: this.designationPublicId,
      companyBranchPublicId: this.companyBranchPublicId,
      applicationDate: this.applicationDate,
      expectedDoj: this.expectedDoj,
      remarks: this.remarks
    };

    this.loader.show();

    this.onboarding.updateCandidateApplication(this.publicId!, payload)
      .subscribe({
        next: () => {
          this.loader.hide();
          this.toastr.success('Updated Successfully');
          this.router.navigate(['/panel/onboarding/view-candidate-application-list']);
        },
        error: err => {
          this.loader.hide();
          this.toastr.error(err.error?.message || 'Update Failed');
        }
      });
  }

  loadSingleApplication() {
    this.loader.show();

    this.onboarding.getCandidateApplicationById(this.publicId!)
      .subscribe(res => {
        this.loader.hide();
        const data = res.data;

        this.code = data.code;
        this.candidatePublicId = data.candidatePublicId;
        this.requisitionPublicId = data.requisitionPublicId;
        this.departmentPublicId = data.departmentPublicId;
        this.designationPublicId = data.designationPublicId;
        this.companyBranchPublicId = data.companyBranchPublicId;
        this.applicationDate = data.applicationDate;
        this.expectedDoj = data.expectedDoj;
        this.remarks = data.remarks;

        // Set dropdown labels
        const candidate = this.candidates.find(c => c.publicId === data.candidatePublicId);
        this.selectedCandidateLabel = candidate ? `${candidate.firstName} ${candidate.lastName}` : '';

        const requisition = this.requisitions.find(r => r.publicId === data.requisitionPublicId);
        this.selectedRequisitionLabel = requisition ? (requisition.title || requisition.name) : '';

        const department = this.departments.find(d => d.publicId === data.departmentPublicId);
        this.selectedDepartmentLabel = department ? department.name : '';

        const designation = this.designations.find(d => d.publicId === data.designationPublicId);
        this.selectedDesignationLabel = designation ? designation.name : '';

        const branch = this.companyBranches.find(b => b.publicId === data.companyBranchPublicId);
        this.selectedBranchLabel = branch ? branch.name : '';
      });
  }

  resetForm() {
    this.code = '';
    this.candidatePublicId = '';
    this.requisitionPublicId = '';
    this.departmentPublicId = '';
    this.designationPublicId = '';
    this.companyBranchPublicId = '';
    this.applicationDate = '';
    this.expectedDoj = '';
    this.remarks = '';
    this.selectedCandidateLabel = '';
    this.selectedRequisitionLabel = '';
    this.selectedDepartmentLabel = '';
    this.selectedDesignationLabel = '';
    this.selectedBranchLabel = '';
  }

  cancel() {
    this.router.navigate(['/panel/onboarding/view-candidate-application-list']);
  }
}