import { Component } from '@angular/core';
import { FormsService } from '../../Services/forms';
import { ToastrService } from 'ngx-toastr';
import { LoaderService } from '../../../../core/services/management-services/loader.service';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-view-leave-application',
  imports: [RouterModule, CommonModule, FormsModule],
  templateUrl: './view-leave-application.html',
  styleUrl: './view-leave-application.scss',
})
export class ViewLeaveApplication {
  LeavesApplicationList: any[] = [];
  filteredLeavesApplicationList: any[] = [];
  paginatedLeavesApplicationList: any[] = [];

  totalItems: number = 0;
  totalPagesCount: number = 0;
  currentPage = 1;
  itemsPerPage = 7;

  searchTerm: string = '';
  statusFilter: string = ''; // DRAFT | APPROVED | PENDING | REJECTED | ''
  leaveModeFilter: string = ''; // FULL_DAY | HALF_DAY | SHORT_LEAVE | ''

  publicId: string | null = null;
  isEditMode = false;

  constructor(
    private formsService: FormsService,
    private toastr: ToastrService,
    private loader: LoaderService,
  ) {}

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

  // Unique leave modes from loaded data for dropdown
  get uniqueLeaveModes(): string[] {
    const modes = this.LeavesApplicationList.map((l) => l.leaveMode).filter(Boolean);
    return [...new Set(modes)];
  }

  ngOnInit() {
    this.loadLeaves();
  }

  loadLeaves() {
    this.loader.show();
    const backendPage = this.currentPage - 1;
    this.formsService.GetLeaveApplication(backendPage, this.itemsPerPage, 'ALL').subscribe({
      next: (response: any) => {
        this.loader.hide();
        this.LeavesApplicationList = response.data;
        this.totalItems = response.paginator.totalItems;
        this.totalPagesCount = response.paginator.totalPages;
        this.currentPage = response.paginator.currentPage + 1;
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
    this.applyFilter();
  }

  onStatusChange() {
    this.currentPage = 1;
    this.applyFilter();
  }

  onLeaveModeChange() {
    this.currentPage = 1;
    this.applyFilter();
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
    this.applyFilter();
  }

  formatRoleName(role: string): string {
    if (!role) return '';
    return role
      .toLowerCase()
      .replace(/_/g, ' ')
      .replace(/\b\w/g, (c) => c.toUpperCase());
  }
}
