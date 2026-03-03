import { Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { LoaderService } from '../../../../core/services/management-services/loader.service';
import { OnboardingService } from '../../Services/onboarding';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-candidates-approval',
  imports: [CommonModule,FormsModule],
  templateUrl: './candidates-approval.html',
  styleUrl: './candidates-approval.scss',
})
export class CandidatesApproval {
 applicationList: any[] = [];
selectedApp: any;
selectedStatus: string = '';
allowedStatuses: string[] = [];
showModal = false;
  totalItems: number = 0;
  totalPagesCount: number = 0;
  currentPage = 1;
  itemsPerPage = 7;

APPLICATION_STATUS_FLOW: any = {
  APPLIED: ['SHORTLISTED', 'REJECTED', 'WITHDRAWN'],
  SHORTLISTED: ['INTERVIEW_SCHEDULED', 'REJECTED', 'WITHDRAWN'],
  INTERVIEW_SCHEDULED: ['INTERVIEWED', 'REJECTED', 'WITHDRAWN'],
  INTERVIEWED: ['SELECTED', 'REJECTED', 'WITHDRAWN'],
  SELECTED: ['FINAL_SCREENING', 'REJECTED', 'WITHDRAWN'],
  FINAL_SCREENING: ['OFFER_MADE', 'REJECTED', 'WITHDRAWN'],
  OFFER_MADE: ['HIRED', 'OFFER_EXPIRED', 'WITHDRAWN'],
  HIRED: [],
  REJECTED: [],
  OFFER_EXPIRED: [],
  WITHDRAWN: []
};

  constructor(
    private toastr: ToastrService,
    private loader: LoaderService,
    private onboardingService: OnboardingService
  ) {}

  ngOnInit() {
 this.loadApplications();  }

  openStatusModal(app: any) {
  this.selectedApp = app;
  this.allowedStatuses = this.APPLICATION_STATUS_FLOW[app.status] || [];
  this.selectedStatus = '';
  this.showModal = true;
}

  get totalPages() {
    return this.totalPagesCount || Math.ceil(this.totalItems / this.itemsPerPage);
  }

  get totalPagesArray() {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  changePage(page: number) {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    this.loadApplications();
  }

  loadApplications() {
    this.loader.show();
    // Use the pagination parameters (backend typically uses 0-based indexing)
    const backendPage = this.currentPage - 1;
    this.onboardingService.getAllCandidateApplications(backendPage, this.itemsPerPage).subscribe({
      next: (res: any) => {
        this.loader.hide();
        this.applicationList  = res.data;
        this.totalItems = res.paginator.totalItems;
        this.totalPagesCount = res.paginator.totalPages;
        this.currentPage = res.paginator.currentPage + 1; // Convert back to 1-based for UI
      },
      error: () => {
        this.loader.hide();
        this.toastr.error('Failed to load requisitions');
      }
    });
  }

 

  closeModal() {
    this.showModal = false;
  }

  updateApplicationStatus() {

  if (!this.selectedStatus) {
    this.toastr.warning('Please select status');
    return;
  }

  if (!this.allowedStatuses.includes(this.selectedStatus)) {
    this.toastr.error('Invalid status transition!');
    return;
  }

  this.loader.show();

  this.onboardingService
    .updateApplicationStatus(this.selectedApp.publicId, this.selectedStatus)
    .subscribe({
      next: () => {
        this.loader.hide();
        this.toastr.success('Application status updated');
        this.showModal = false;
        this.loadApplications();
      },
      error: () => {
        this.loader.hide();
        this.toastr.error('Status update failed');
      }
    });
}


 getApplicationBreadcrumbs(status: string) {

  const mainFlow = [
    'APPLIED',
    'SHORTLISTED',
    'INTERVIEW_SCHEDULED',
    'INTERVIEWED',
    'SELECTED',
    'FINAL_SCREENING',
    'OFFER_MADE',
    'HIRED'
  ];

  const index = mainFlow.indexOf(status);

  if (index !== -1) {
    return mainFlow.slice(0, index + 1);
  }

  if (status === 'REJECTED') return ['APPLIED', 'REJECTED'];
  if (status === 'WITHDRAWN') return ['APPLIED', 'WITHDRAWN'];
  if (status === 'OFFER_EXPIRED') return ['OFFER_MADE', 'OFFER_EXPIRED'];

  return [];
}

}
