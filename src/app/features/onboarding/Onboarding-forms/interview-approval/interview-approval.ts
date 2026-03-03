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
  selectedInterview: any;
  selectedStatus: string = '';
  allowedStatuses: string[] = [];
  showModal = false;
  totalItems: number = 0;
  totalPagesCount: number = 0;
  currentPage = 1;
  itemsPerPage = 7;

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

  changePage(page: number) {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    this.loadInterviews();
  }

  loadInterviews() {
    this.loader.show();
    const backendPage = this.currentPage - 1;
    this.onboardingService.getAllInterviews(backendPage, this.itemsPerPage).subscribe({
      next: (res: any) => {
        this.loader.hide();
        this.interviewList = res.data;
        this.totalItems = res.paginator.totalItems;
        this.totalPagesCount = res.paginator.totalPages;
        this.currentPage = res.paginator.currentPage + 1;
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
}
