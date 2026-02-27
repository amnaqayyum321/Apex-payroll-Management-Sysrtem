import { Component, OnInit } from '@angular/core';
import { OnboardingService } from '../../Services/onboarding';
import { LoaderService } from '../../../../core/services/management-services/loader.service';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-candidate-application',
  imports: [CommonModule,FormsModule],
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

  candidates: any[] = [];
  requisitions: any[] = [];

  publicId: string | null = null;
  isEditMode = false;

  currentPage = 0;
  pageSize = 100;

  constructor(
    private onboarding: OnboardingService,
    private loader: LoaderService,
    private toastr: ToastrService,
    private router: Router,

    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.loadCandidates();
    this.loadRequisitions();

    this.publicId = this.route.snapshot.paramMap.get('id');
    if (this.publicId) {
      this.isEditMode = true;
      this.loadSingleApplication();
    }
  }

  loadCandidates() {
    this.onboarding.getAllCandidate(0, 100, 'ALL')
      .subscribe(res => this.candidates = res.data);
  }

  loadRequisitions() {
    this.onboarding.getAllJobRequisition(0, 100)
      .subscribe(res => this.requisitions = res.data);
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
        this.applicationDate = data.applicationDate;
        this.expectedDoj = data.expectedDoj;
        this.remarks = data.remarks;
      });
  }

  resetForm() {
    this.code = '';
    this.candidatePublicId = '';
    this.requisitionPublicId = '';
    this.applicationDate = '';
    this.expectedDoj = '';
    this.remarks = '';
  }

  cancel() {
    this.router.navigate(['/panel/onboarding/view-candidate-application-list']);
  }
}


