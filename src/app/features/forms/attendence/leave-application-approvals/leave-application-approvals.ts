import { Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { LoaderService } from '../../../../core/services/management-services/loader.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FormsService } from '../../Services/forms';

@Component({
  selector: 'app-leave-application-approvals',
  imports: [CommonModule, FormsModule],
  standalone: true,
  templateUrl: './leave-application-approvals.html',
  styleUrl: './leave-application-approvals.scss',
})
export class LeaveApplicationApprovals {
  leaveList: any[] = [];          // Original data from API (current page)
  filteredLeaveList: any[] = [];  // After search/status filter
  paginatedLeaveList: any[] = []; // After slicing for current page (same as filtered when no filters active)

  selectedLeave: any;
  selectedStatus: string = '';
  remarks: string = '';
  allowedStatuses: string[] = [];
  showModal = false;

  showHistoryModal = false;
  historyData: any;

  // Pagination & filters
  currentPage = 1;
  totalPagesCount = 0;
  totalItems = 0;
  itemsPerPage = 7;

  searchTerm: string = '';
  statusFilter: string = '';

  STATUS_FLOW: any = {
    DRAFT: ['PENDING_APPROVAL'],
    PENDING_APPROVAL: ['CANCELLED', 'DELETED'],
    APPROVED: [],
    REJECTED: [],
    CANCELLED: [],
    DELETED: [],
  };

  constructor(
    private toastr: ToastrService,
    private loader: LoaderService,
    private leaveService: FormsService
  ) {}

  ngOnInit() {
    this.loadLeaves();
  }

  // ----- Helpers for template -----
  get totalPages(): number {
    return this.totalPagesCount || Math.ceil(this.totalItems / this.itemsPerPage);
  }

  get totalPagesArray(): number[] {
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

  // ----- Data loading (backend paginated) -----
  loadLeaves() {
    this.loader.show();
    const backendPage = this.currentPage - 1;

    this.leaveService.getMyLeaves(backendPage, this.itemsPerPage).subscribe({
      next: (res: any) => {
        this.loader.hide();
        this.leaveList = res.data;
        this.totalItems = res.paginator.totalItems;
        this.totalPagesCount = res.paginator.totalPages;
        this.currentPage = res.paginator.currentPage + 1;
        this.applyFilter(); // Apply search/status on the newly loaded page
      },
      error: () => {
        this.loader.hide();
        this.toastr.error('Failed to load leaves');
      },
    });
  }

  // ----- Pagination controls -----
  changePage(page: number) {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    this.loadLeaves(); // Reload from backend with new page
  }

  onItemsPerPageChange() {
    this.currentPage = 1;
    this.loadLeaves(); // Reload with new itemsPerPage
  }

  // ----- Filtering (client‑side on current page) -----
  onSearch() {
    this.currentPage = 1;
    this.applyFilter();
  }

  onStatusChange() {
    this.currentPage = 1;
    this.applyFilter();
  }

  applyFilter() {
    const term = this.searchTerm.toLowerCase().trim();

    this.filteredLeaveList = this.leaveList.filter((item) => {
      const matchesSearch =
        !term ||
        item.name?.toLowerCase().includes(term) ||
        item.code?.toLowerCase().includes(term);

      const matchesStatus = !this.statusFilter || item.status === this.statusFilter;

      return matchesSearch && matchesStatus;
    });

    this.updatePaginatedList();
  }

  updatePaginatedList() {
    if (this.isAnyFilterActive) {
      // When filters active, totalItems = filtered list length
      this.totalItems = this.filteredLeaveList.length;
      const start = (this.currentPage - 1) * this.itemsPerPage;
      this.paginatedLeaveList = this.filteredLeaveList.slice(
        start,
        start + this.itemsPerPage
      );
    } else {
      // No filters: use backend pagination metadata
      this.totalItems = this.totalPagesCount * this.itemsPerPage;
      this.paginatedLeaveList = this.leaveList;
    }
  }

  resetFilters() {
    this.searchTerm = '';
    this.statusFilter = '';
    this.currentPage = 1;
    this.applyFilter();
    // If no filters, reload original page to restore correct pagination counts
    if (!this.isAnyFilterActive) {
      this.loadLeaves();
    }
  }

  // ----- Status badge styling -----
  getStatusClass(status: string): string {
    switch (status) {
      case 'DRAFT':
        return 'draft-badge';
      case 'PENDING_APPROVAL':
        return 'pending-badge';
      case 'APPROVED':
        return 'approved-badge';
      case 'REJECTED':
        return 'rejected-badge';
      case 'CANCELLED':
        return 'cancelled-badge';
      case 'DELETED':
        return 'deleted-badge';
      default:
        return 'status-badge';
    }
  }

  // ----- Modal methods (unchanged) -----
  openModal(leave: any) {
    this.selectedLeave = leave;
    this.allowedStatuses = this.STATUS_FLOW[leave.status] || [];
    this.selectedStatus = '';
    this.remarks = '';
    this.showModal = true;
  }

  updateStatus() {
    if (!this.selectedStatus) {
      this.toastr.warning('Select status');
      return;
    }

    this.loader.show();
    this.leaveService
      .updateLeaveStatus(this.selectedLeave.publicId, this.selectedStatus, this.remarks)
      .subscribe({
        next: () => {
          this.loader.hide();
          this.toastr.success('Status updated');
          this.showModal = false;
          this.loadLeaves();
        },
        error: () => {
          this.loader.hide();
          this.toastr.error('Update failed');
        },
      });
  }

  openHistory(leave: any) {
    this.loader.show();
    this.leaveService.getLeaveHistory(leave.publicId).subscribe({
      next: (res: any) => {
        this.loader.hide();
        this.historyData = res.data;
        this.showHistoryModal = true;
      },
      error: () => {
        this.loader.hide();
        this.toastr.error('History load failed');
      },
    });
  }

  closeModal() {
    this.showModal = false;
  }

  closeHistoryModal() {
    this.showHistoryModal = false;
  }
}