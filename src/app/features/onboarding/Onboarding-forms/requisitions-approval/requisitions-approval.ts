import { Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { LoaderService } from '../../../../core/services/management-services/loader.service';
import { OnboardingService } from '../../Services/onboarding';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-requisitions-approval',
  imports: [CommonModule, FormsModule],
  templateUrl: './requisitions-approval.html',
  styleUrl: './requisitions-approval.scss'
})
export class RequisitionsApproval {

  requisitionList: any[] = [];
  filteredReqList: any[] = [];
  paginatedReqList: any[] = [];
  selectedReq: any;
  selectedStatus: string = '';
  allowedStatuses: string[] = [];
  showModal = false;
  totalItems: number = 0;
  totalPagesCount: number = 0;
  currentPage = 1;
  itemsPerPage = 7;
  searchTerm: string = '';
  statusFilter: string = '';

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
  ) { }

  ngOnInit() {
    this.loadRequisition();
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


  loadRequisition() {
    this.loader.show();

    const backendPage = this.currentPage - 1;
    const pageSize = this.isAnyFilterActive ? 9999 : this.itemsPerPage;
    const page = this.isAnyFilterActive ? 0 : backendPage;

    this.onboardingService.getAllJobRequisition(page, pageSize).subscribe({
      next: (res: any) => {
        this.loader.hide();

        this.requisitionList = res.data.sort(
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


  changePage(page: number) {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    this.loadRequisition();
  }

  onItemsPerPageChange() {
    this.currentPage = 1;
    this.loadRequisition();
  }

  onSearch() {
    this.currentPage = 1;
    this.loadRequisition();
  }

  onStatusChange() {
    this.currentPage = 1;
    this.loadRequisition();
  }

  applyFilter() {
    const term = this.searchTerm.toLowerCase().trim();

    this.filteredReqList = this.requisitionList.filter((item) => {
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
      this.totalItems = this.filteredReqList.length;
      const start = (this.currentPage - 1) * this.itemsPerPage;
      this.paginatedReqList = this.
        filteredReqList.slice(
          start,
          start + this.itemsPerPage,
        );
    } else {
      this.totalItems = this.totalPagesCount * this.itemsPerPage;
      this.paginatedReqList = this.requisitionList;
    }
  }

  resetFilters() {
    this.searchTerm = '';
    this.statusFilter = '';
    this.currentPage = 1;
    this.loadRequisition();
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