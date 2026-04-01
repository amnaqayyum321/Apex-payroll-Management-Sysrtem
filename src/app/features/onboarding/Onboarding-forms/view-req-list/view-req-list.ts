import { Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { LoaderService } from '../../../../core/services/management-services/loader.service';
import { OnboardingService } from '../../Services/onboarding';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-view-req-list',
  imports: [FormsModule, CommonModule, RouterModule],
  templateUrl: './view-req-list.html',
  styleUrl: './view-req-list.scss',
})
export class ViewReqList {
  // All requisitions (full list when filtering, page data otherwise)
  RequisitionList: any[] = [];
  // Filtered result (after search/status)
  filteredRequisitionList: any[] = [];
  // Current page data to display
  paginatedRequisitionList: any[] = [];

  // Pagination
  totalItems: number = 0;
  totalPagesCount: number = 0;
  currentPage = 1;
  itemsPerPage = 7;

  // Filters
  searchTerm: string = '';
  statusFilter: string = '';

  // Helper to know if we are in filter mode (any filter active)
  get isAnyFilterActive(): boolean {
    return !!this.searchTerm || !!this.statusFilter;
  }

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

  constructor(
    private toastr: ToastrService,
    private loader: LoaderService,
    private onBoardingSV: OnboardingService,
  ) {}

  ngOnInit() {
    this.loadRequisition();
  }

  // Main data loading – decides whether to fetch all (if filters active) or just one page
  loadRequisition() {
    this.loader.show();

    if (this.isAnyFilterActive) {
      // Fetch all requisitions to enable client‑side filtering
      this.onBoardingSV.getAllJobRequisition(0, 9999).subscribe({
        next: (response: any) => {
          this.loader.hide();
          this.RequisitionList = response.data;
          this.totalPagesCount = Math.ceil(this.RequisitionList.length / this.itemsPerPage);
          this.applyFilter();
        },
        error: (error) => {
          this.loader.hide();
          this.toastr.error('Error fetching requisition list');
        },
      });
    } else {
      // Normal server‑side pagination
      const backendPage = this.currentPage - 1;
      this.onBoardingSV.getAllJobRequisition(backendPage, this.itemsPerPage).subscribe({
        next: (response: any) => {
          this.loader.hide();
          this.RequisitionList = response.data;
          this.totalItems = response.paginator.totalItems;
          this.totalPagesCount = response.paginator.totalPages;
          this.currentPage = response.paginator.currentPage + 1;
          this.applyFilter(); // will just assign without extra filtering
        },
        error: (error) => {
          this.loader.hide();
          this.toastr.error('Error fetching requisition list');
        },
      });
    }
  }

  // Apply search and status filters to the current data set
  applyFilter() {
    const term = this.searchTerm.toLowerCase().trim();

    if (this.isAnyFilterActive) {
      // Client‑side filtering on the full list
      this.filteredRequisitionList = this.RequisitionList.filter((item) => {
        const matchesSearch =
          !term ||
          item.name?.toLowerCase().includes(term) ||
          item.departmentName?.toLowerCase().includes(term) ||
          item.designationName?.toLowerCase().includes(term);

        const matchesStatus =
          !this.statusFilter || item.status?.toUpperCase() === this.statusFilter;

        return matchesSearch && matchesStatus;
      });

      this.totalItems = this.filteredRequisitionList.length;
      this.totalPagesCount = Math.ceil(this.totalItems / this.itemsPerPage);
      this.updatePaginatedList();
    } else {
      // No filters – just use the server‑side page data
      this.filteredRequisitionList = this.RequisitionList;
      this.paginatedRequisitionList = this.filteredRequisitionList;
    }
  }

  // Slice the filtered list for the current page (only used when filters active)
  updatePaginatedList() {
    if (this.isAnyFilterActive) {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      this.paginatedRequisitionList = this.filteredRequisitionList.slice(
        start,
        start + this.itemsPerPage
      );
    }
  }

  // Pagination control
  changePage(page: number) {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;

    if (this.isAnyFilterActive) {
      // Just update the displayed slice
      this.updatePaginatedList();
    } else {
      // Load new page from server
      this.loadRequisition();
    }
  }

  // Items per page changed
  onItemsPerPageChange() {
    this.currentPage = 1;
    if (this.isAnyFilterActive) {
      this.totalPagesCount = Math.ceil(this.totalItems / this.itemsPerPage);
      this.updatePaginatedList();
    } else {
      this.loadRequisition();
    }
  }

  // Search input changed
  onSearch() {
    this.currentPage = 1;
    this.loadRequisition();
  }

  // Status filter changed
  onStatusChange() {
    this.currentPage = 1;
    this.loadRequisition();
  }

  // Reset all filters
  resetFilters() {
    this.searchTerm = '';
    this.statusFilter = '';
    this.currentPage = 1;
    this.loadRequisition();
  }
}