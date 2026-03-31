import { Component, OnInit } from '@angular/core';
import { FormsService } from '../../Services/forms';
import { ToastrService } from 'ngx-toastr';
import { LoaderService } from '../../../../core/services/management-services/loader.service';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-view-leave-application',
  imports: [RouterModule, CommonModule, FormsModule],
  templateUrl: './view-leave-application.html',
  styleUrl: './view-leave-application.scss',
})
export class ViewLeaveApplication implements OnInit {
  LeavesApplicationList: any[] = [];
  filteredLeavesApplicationList: any[] = [];
  paginatedLeavesApplicationList: any[] = [];

  totalItems: number = 0;
  totalPagesCount: number = 0;
  currentPage = 1;
  itemsPerPage = 7;

  selectedLeave: any = null;
  isStatusModalOpen: boolean = false;

  searchTerm: string = '';
  statusFilter: string = '';
  leaveModeFilter: string = '';

  // ── Approval Modal State ──────────────────────────────────────
  selectedStatus: string = '';
  isSubmitting: boolean = false;
  isSuccess: boolean = false;

  statusOptions = [
    { value: 'DRAFT', label: 'Draft', icon: 'fas fa-pen' },
    { value: 'PENDING_APPROVAL', label: 'Pending Approval', icon: 'fas fa-clock' },
  ];
  // ─────────────────────────────────────────────────────────────

  constructor(
    private formsService: FormsService,
    private toastr: ToastrService,
    private loader: LoaderService,
    private router: Router,
  ) {}

  // ── Pagination Getters ────────────────────────────────────────
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
    return !!this.searchTerm || !!this.statusFilter || !!this.leaveModeFilter;
  }

  get uniqueLeaveModes(): string[] {
    const modes = this.LeavesApplicationList.map((l) => l.leaveMode).filter(Boolean);
    return [...new Set(modes)];
  }
  // ─────────────────────────────────────────────────────────────

  ngOnInit() {
    this.loadLeaves();
  }

  // ── Table Actions ─────────────────────────────────────────────
  openStatusModal(leave: any) {
    this.selectedLeave = leave;
    this.selectedStatus = leave?.status ?? '';
    this.isSuccess = false;
    this.isStatusModalOpen = true;
  }

  closeStatusModal() {
    this.isStatusModalOpen = false;
    this.selectedLeave = null;
    this.selectedStatus = '';
    this.isSuccess = false;
    this.isSubmitting = false;
  }
  // ─────────────────────────────────────────────────────────────

  // ── Data Loading ──────────────────────────────────────────────
  loadLeaves() {
    this.loader.show();
    const backendPage = this.currentPage - 1;

    // Agar filter active hai to saari items fetch karo
    const pageSize = this.isAnyFilterActive ? 9999 : this.itemsPerPage;
    const page = this.isAnyFilterActive ? 0 : backendPage;

    this.formsService.GetLeaveApplication(page, pageSize, 'ALL').subscribe({
      next: (response: any) => {
        this.loader.hide();
        this.LeavesApplicationList = response.data.sort(
          (a: any, b: any) => new Date(a.createdDate).getTime() - new Date(b.createdDate).getTime(),
        );
        this.totalItems = response.paginator.totalItems;
        this.totalPagesCount = response.paginator.totalPages;

        if (!this.isAnyFilterActive) {
          this.currentPage = response.paginator.currentPage + 1;
        }

        this.applyFilter();
      },
      error: () => {
        this.loader.hide();
        this.toastr.error('Error fetching leaves Application list');
      },
    });
  }

  changePage(page: number) {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    this.loadLeaves();
  }

  onItemsPerPageChange() {
    this.currentPage = 1;
    this.loadLeaves();
  }
  onSearch() {
    this.currentPage = 1;
    this.loadLeaves();
  }

  onStatusChange() {
    this.currentPage = 1;
    this.loadLeaves();
  }

  onLeaveModeChange() {
    this.currentPage = 1;
    this.loadLeaves();
  }

  applyFilter() {
    const term = this.searchTerm.toLowerCase().trim();

    this.filteredLeavesApplicationList = this.LeavesApplicationList.filter((item) => {
      const matchesSearch =
        !term ||
        item.name?.toLowerCase().includes(term) ||
        item.leaveTypeName?.toLowerCase().includes(term);
      const matchesStatus = !this.statusFilter || item.status === this.statusFilter;
      const matchesLeaveMode = !this.leaveModeFilter || item.leaveMode === this.leaveModeFilter;
      return matchesSearch && matchesStatus && matchesLeaveMode;
    });

    this.updatePaginatedList();
  }
  updatePaginatedList() {
    if (this.isAnyFilterActive) {
      this.totalItems = this.filteredLeavesApplicationList.length;
      const start = (this.currentPage - 1) * this.itemsPerPage;
      this.paginatedLeavesApplicationList = this.filteredLeavesApplicationList.slice(
        start,
        start + this.itemsPerPage,
      );
    } else {
      this.totalItems = this.totalPagesCount * this.itemsPerPage;
      this.paginatedLeavesApplicationList = this.LeavesApplicationList;
    }
  }
  resetFilters() {
    this.searchTerm = '';
    this.statusFilter = '';
    this.leaveModeFilter = '';
    this.currentPage = 1;
    this.loadLeaves();
  }
  getStatusClass(status: string): string {
    const map: any = {
      DRAFT: 'status-draft',
      PENDING: 'status-pending',
      PENDING_APPROVAL: 'status-pending',
      APPROVED: 'status-approved',
      REJECTED: 'status-rejected',
    };
    return map[status] || '';
  }

  onSubmitStatus(): void {
    if (this.isSubmitting || !this.selectedLeave?.publicId || !this.selectedStatus) return;

    this.isSubmitting = true;
    this.formsService
      .updateLeaveStatus(this.selectedLeave.publicId, this.selectedStatus, '')
      .subscribe({
        next: () => {
          this.isSubmitting = false;
          this.isSuccess = true;
          setTimeout(() => {
            this.isSuccess = false;
            this.loadLeaves();
            this.closeStatusModal();
          }, 2000);
        },
        error: (err: any) => {
          this.isSubmitting = false;
          this.toastr.error('Failed to update status');
          console.error('Status update failed:', err);
        },
      });
  }
  // ─────────────────────────────────────────────────────────────

  formatRoleName(role: string): string {
    if (!role) return '';
    return role
      .toLowerCase()
      .replace(/_/g, ' ')
      .replace(/\b\w/g, (c) => c.toUpperCase());
  }
  isDisabled(app: any): boolean {
    return (
      app.status === 'APPROVED' || app.status === 'REJECTED' || app.status === 'PENDING_APPROVAL'
    );
  }
  goToEdit(app: any) {
    this.router.navigate(['/panel/forms/leave-application', app.publicId]);
  }
}
