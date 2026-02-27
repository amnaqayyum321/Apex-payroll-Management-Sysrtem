import { Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { LoaderService } from '../../../../core/services/management-services/loader.service';
import { OnboardingService } from '../../Services/onboarding';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-requisitions-approval',
  imports:[CommonModule,FormsModule],
  templateUrl: './requisitions-approval.html',
  styleUrl: './requisitions-approval.scss'
})
export class RequisitionsApproval {

  requisitionList: any[] = [];
  selectedReq: any;
  selectedStatus: string = '';
  allowedStatuses: string[] = [];
  showModal = false;
  totalItems: number = 0;
  totalPagesCount: number = 0;
  currentPage = 1;
  itemsPerPage = 7;

  STATUS_FLOW: any = {
    DRAFT: ['SUBMITTED', 'CANCELLED', 'CLOSED'],
    SUBMITTED: ['APPROVED', 'REJECTED'],
    APPROVED: ['OPEN', 'CLOSED'],
    OPEN: ['CLOSED'],
    REJECTED: [],
    CLOSED: [],
    CANCELLED: []
  };

  constructor(
    private toastr: ToastrService,
    private loader: LoaderService,
    private onboardingService: OnboardingService
  ) {}

  ngOnInit() {
    this.loadRequisition();
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
    this.loadRequisition();
  }

  loadRequisition() {
    this.loader.show();
    // Use the pagination parameters (backend typically uses 0-based indexing)
    const backendPage = this.currentPage - 1;
    this.onboardingService.getAllJobRequisition(backendPage, this.itemsPerPage).subscribe({
      next: (res: any) => {
        this.loader.hide();
        this.requisitionList = res.data;
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

  openApprovalModal(req: any) {
    this.selectedReq = req;
    this.allowedStatuses = this.STATUS_FLOW[req.status] || [];
    this.selectedStatus = '';
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
  }

  updateStatus() {
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
      .updateRequisitionStatus(this.selectedReq.publicId, this.selectedStatus)
      .subscribe({
        next: (res: any) => {
          this.loader.hide();
          this.toastr.success('Status updated successfully');
          this.showModal = false;
          this.loadRequisition(); // Reload to get updated data
        },
        error: () => {
          this.loader.hide();
          this.toastr.error('Status update failed');
        }
      });
  }

  getBreadcrumbs(status: string) {
    const fullFlow = ['DRAFT', 'SUBMITTED', 'APPROVED', 'OPEN', 'CLOSED'];
    const rejectFlow = ['DRAFT', 'SUBMITTED', 'REJECTED'];
    const cancelFlow = ['DRAFT', 'CANCELLED'];

    if (status === 'REJECTED') return rejectFlow;
    if (status === 'CANCELLED') return cancelFlow;

    return fullFlow.slice(0, fullFlow.indexOf(status) + 1);
  }
}