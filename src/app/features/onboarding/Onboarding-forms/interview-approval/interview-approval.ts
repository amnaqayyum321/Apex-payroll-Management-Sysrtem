import { Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { LoaderService } from '../../../../core/services/management-services/loader.service';
import { OnboardingService } from '../../Services/onboarding';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-interview-approval',
  imports: [CommonModule, FormsModule],
  templateUrl: './interview-approval.html',
  styleUrl: './interview-approval.scss',
})
export class InterviewApproval {
  interviewList: any[] = [];
   filteredInterviewList: any[] = [];
  paginatedInterviewList: any[] = [];
  selectedInterview: any;
  selectedStatus: string = '';
  allowedStatuses: string[] = [];
  showModal = false;
  totalItems: number = 0;
  totalPagesCount: number = 0;
  currentPage = 1;
  itemsPerPage = 7;
   searchTerm: string = '';
  statusFilter: string = '';

  // ✅ FIXED: Correct flow confirmed by backend
  // RESCHEDULE is NOT a status — going back to SCHEDULED means reschedule
  // Flow: SCHEDULED → IN_PROGRESS → SCHEDULED(reschedule) → IN_PROGRESS → COMPLETED → PASS/FAIL
  STATUS_FLOW: any = {
    SCHEDULED: ['IN_PROGRESS', 'CANCELLED'],
    IN_PROGRESS: ['COMPLETED', 'SCHEDULED', 'CANCELLED'], // SCHEDULED = reschedule
    COMPLETED: ['PASS', 'FAIL'],
    PASS: [],
    FAIL: [],
    CANCELLED: [],
  };

  constructor(
    private toastr: ToastrService,
    private loader: LoaderService,
    private onboardingService: OnboardingService,
  ) {}

  ngOnInit() {
    this.loadInterviews();
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

  loadInterviews() {
    this.loader.show();
 const backendPage = this.currentPage - 1;
  const pageSize = this.isAnyFilterActive ? 9999 : this.itemsPerPage;
  const page = this.isAnyFilterActive ? 0 : backendPage;
      this.onboardingService.getAllInterviews(page, pageSize).subscribe({
      next: (res: any) => {
        this.loader.hide();
        this.interviewList = res.data.sort(
        (a: any, b: any) =>
          new Date(b.createdDate).getTime() -
          new Date(a.createdDate).getTime()
      );
        this.totalItems = res.paginator.totalItems;
        this.totalPagesCount = res.paginator.totalPages;
        this.currentPage =this.isAnyFilterActive
        ? 1
        : res.paginator.currentPage + 1;

      this.applyFilter();
    },
      error: () => {
        this.loader.hide();
        this.toastr.error('Failed to load interviews');
      },
    });
  }

  openApprovalModal(interview: any) {
    this.selectedInterview = interview;
    this.allowedStatuses = this.STATUS_FLOW[interview.status] || [];
    this.selectedStatus = '';
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
    this.selectedInterview = null;
    this.selectedStatus = '';
  }

  updateStatus() {
    if (!this.selectedStatus) {
      this.toastr.warning('Please select a status');
      return;
    }

    if (!this.allowedStatuses.includes(this.selectedStatus)) {
      this.toastr.error('Invalid status transition!');
      return;
    }

    this.loader.show();
    this.onboardingService
      .updateInterviewsStatus(this.selectedInterview.publicId, this.selectedStatus)
      .subscribe({
        next: () => {
          this.loader.hide();
          this.toastr.success('Interview status updated successfully');
          this.closeModal();
          this.loadInterviews();
        },
        error: (err: any) => {
          this.loader.hide();
          const msg = err?.error?.message || 'Status update failed';
          this.toastr.error(msg);
        },
      });
  }

  getBreadcrumbs(status: string): string[] {
    const mainFlow = ['SCHEDULED', 'IN_PROGRESS', 'COMPLETED', 'PASS'];
    const failFlow = ['SCHEDULED', 'IN_PROGRESS', 'COMPLETED', 'FAIL'];
    const cancelFlow = ['SCHEDULED', 'CANCELLED'];

    if (status === 'FAIL') return failFlow;
    if (status === 'CANCELLED') return cancelFlow;

    const idx = mainFlow.indexOf(status);
    return idx >= 0 ? mainFlow.slice(0, idx + 1) : [status];
  }

  getStatusLabel(status: string): string {
    if (status === 'SCHEDULED' && this.selectedInterview?.status === 'IN_PROGRESS') {
      return 'RESCHEDULE';
    }
    return status;
  }

  hasNextStatus(status: string): boolean {
    return (this.STATUS_FLOW[status]?.length ?? 0) > 0;
  }


   changePage(page: number) {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    this.loadInterviews();
  }

  onItemsPerPageChange() {
    this.currentPage = 1;
    this.loadInterviews();
  }

  onSearch() {
    this.currentPage = 1;
    this.loadInterviews();
  }

  onStatusChange() {
    this.currentPage = 1;
    this.
    loadInterviews();
  }

 applyFilter() {
  const term = this.searchTerm.toLowerCase().trim();

  this.filteredInterviewList = this.interviewList.filter((item) => {
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
      this.totalItems = this.filteredInterviewList.length;
      const start = (this.currentPage - 1) * this.itemsPerPage;
      this.paginatedInterviewList = this.
      filteredInterviewList.slice(
        start,
        start + this.itemsPerPage,
      );
    } else {
      this.totalItems = this.totalPagesCount * this.itemsPerPage;
      this.paginatedInterviewList = this.interviewList;
    }
  }

  resetFilters() {
    this.searchTerm = '';
    this.statusFilter = '';
    this.currentPage = 1;
    this.loadInterviews();
  }


}
