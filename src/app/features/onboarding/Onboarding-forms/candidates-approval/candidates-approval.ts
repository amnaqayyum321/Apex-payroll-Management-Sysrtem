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
  filteredCandidateList: any[] = [];
  paginatedCandidateList: any[] = [];
selectedApp: any;
selectedStatus: string = '';
allowedStatuses: string[] = [];
showModal = false;
  totalItems: number = 0;
  totalPagesCount: number = 0;
  currentPage = 1;
  itemsPerPage = 7;
    searchTerm: string = '';
  statusFilter: string = '';

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

  get firstItem(): number {
    return this.totalItems === 0 ? 0 : (this.currentPage - 1) * this.itemsPerPage + 1;
  }

  get lastItem(): number {
    return Math.min(this.currentPage * this.itemsPerPage, this.totalItems);
  }

  get isAnyFilterActive(): boolean {
    return !!this.searchTerm || !!this.statusFilter;
  }


  loadApplications() {
    this.loader.show();
    // Use the pagination parameters (backend typically uses 0-based indexing)
 const backendPage = this.currentPage - 1;
  const pageSize = this.isAnyFilterActive ? 9999 : this.itemsPerPage;
  const page = this.isAnyFilterActive ? 0 : backendPage;    this.onboardingService.getAllCandidateApplications(page, pageSize).subscribe({
      next: (res: any) => {
        this.loader.hide();
        this.applicationList  = res.data.sort(
        (a: any, b: any) =>
          new Date(b.createdDate).getTime() -
          new Date(a.createdDate).getTime()
      );
        this.totalItems = res.paginator.totalItems;
        this.totalPagesCount = res.paginator.totalPages;
        this.currentPage = this.isAnyFilterActive
        ? 1
        : res.paginator.currentPage + 1;

      this.applyFilter();
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



 changePage(page: number) {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    this.loadApplications();
  }

  onItemsPerPageChange() {
    this.currentPage = 1;
    this.loadApplications();
  }

  onSearch() {
    this.currentPage = 1;
    this.
    loadApplications();
  }

  onStatusChange() {
    this.currentPage = 1;
    this.
    loadApplications();
  }

 applyFilter() {
  const term = this.searchTerm.toLowerCase().trim();

  this.filteredCandidateList = this.applicationList.filter((item) => {
    const matchesSearch =
      !term ||
      item.name?.toLowerCase().includes(term) ||
      item.code?.toLowerCase().includes(term);

    const matchesStatus =
      this.statusFilter === '' || item.status === this.statusFilter;

    return matchesSearch && matchesStatus;
  });

  this.updatePaginatedList();
}
  updatePaginatedList() {
    if (this.isAnyFilterActive) {
      this.totalItems = this.filteredCandidateList.length;
      const start = (this.currentPage - 1) * this.itemsPerPage;
      this.paginatedCandidateList = this.
      filteredCandidateList.slice(
        start,
        start + this.itemsPerPage,
      );
    } else {
      this.totalItems = this.totalPagesCount * this.itemsPerPage;
      this.paginatedCandidateList = this.applicationList;
    }
  }

  resetFilters() {
    this.searchTerm = '';
    this.statusFilter = '';
    this.currentPage = 1;
    this.loadApplications();
  }


}
