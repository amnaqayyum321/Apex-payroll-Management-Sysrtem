import { Component } from '@angular/core';
import { OnboardingService } from '../../Services/onboarding';
import { ToastrService } from 'ngx-toastr';
import { LoaderService } from '../../../../core/services/management-services/loader.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-view-candidate-application-list',
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './view-candidate-application-list.html',
  styleUrl: './view-candidate-application-list.scss',
})
export class ViewCandidateApplicationList {
  // All applications (full list when filtering, page data otherwise)
  ProjectList: any[] = [];
  // Filtered result (after search/status)
  filteredProjectList: any[] = [];
  // Current page data to display
  paginatedProjectList: any[] = [];

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
    private onboarding: OnboardingService,
    private toastr: ToastrService,
    private loader: LoaderService,
  ) {}

  ngOnInit() {
    this.loadProject();
  }

  // Main data loading – decides whether to fetch all (if filters active) or just one page
  loadProject() {
    this.loader.show();

    if (this.isAnyFilterActive) {
      // Fetch all applications to enable client‑side filtering
      this.onboarding.getAllCandidateApplications(0, 9999).subscribe({
        next: (response: any) => {
          this.loader.hide();
          this.ProjectList = response.data;
          this.totalPagesCount = Math.ceil(this.ProjectList.length / this.itemsPerPage);
          this.applyFilter();
        },
        error: (error) => {
          this.loader.hide();
          this.toastr.error('Error fetching applications list');
        },
      });
    } else {
      // Normal server‑side pagination
      const backendPage = this.currentPage - 1;
      this.onboarding.getAllCandidateApplications(backendPage, this.itemsPerPage).subscribe({
        next: (response: any) => {
          this.loader.hide();
          this.ProjectList = response.data;
          this.totalItems = response.paginator.totalItems;
          this.totalPagesCount = response.paginator.totalPages;
          this.currentPage = response.paginator.currentPage + 1; // Backend 0‑indexed
          this.applyFilter(); // will just assign without extra filtering
        },
        error: (error) => {
          this.loader.hide();
          this.toastr.error('Error fetching applications list');
        },
      });
    }
  }

  // Apply search and status filters to the current data set
  applyFilter() {
    const term = this.searchTerm.toLowerCase().trim();

    if (this.isAnyFilterActive) {
      // Client‑side filtering on the full list
      this.filteredProjectList = this.ProjectList.filter((item) => {
        const matchesSearch =
          !term ||
          item.candidateName?.toLowerCase().includes(term) ||
          item.requisitionName?.toLowerCase().includes(term);

        const matchesStatus = !this.statusFilter || item.status === this.statusFilter;

        return matchesSearch && matchesStatus;
      });

      this.totalItems = this.filteredProjectList.length;
      this.totalPagesCount = Math.ceil(this.totalItems / this.itemsPerPage);
      this.updatePaginatedList();
    } else {
      // No filters – just use the server‑side page data
      this.filteredProjectList = this.ProjectList;
      this.paginatedProjectList = this.filteredProjectList;
    }
  }

  // Slice the filtered list for the current page (only used when filters active)
  updatePaginatedList() {
    if (this.isAnyFilterActive) {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      this.paginatedProjectList = this.filteredProjectList.slice(
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
      this.loadProject();
    }
  }

  // Items per page changed
  onItemsPerPageChange() {
    this.currentPage = 1;
    if (this.isAnyFilterActive) {
      this.totalPagesCount = Math.ceil(this.totalItems / this.itemsPerPage);
      this.updatePaginatedList();
    } else {
      this.loadProject();
    }
  }

  // Search input changed
  onSearch() {
    this.currentPage = 1;
    this.loadProject();
  }

  // Status filter changed
  onStatusChange() {
    this.currentPage = 1;
    this.loadProject();
  }

  // Reset all filters
  resetFilters() {
    this.searchTerm = '';
    this.statusFilter = '';
    this.currentPage = 1;
    this.loadProject();
  }

  // Format status for display
  formatStatus(status: string): string {
    return status.replace(/_/g, ' ');
  }

  // Get CSS class for status badge
  getStatusClass(status: string): string {
    switch (status) {
      case 'APPLIED':
        return 'badge-applied';
      case 'SHORTLISTED':
        return 'badge-shortlisted';
      case 'INTERVIEW_SCHEDULED':
      case 'INTERVIEWED':
        return 'badge-interview';
      case 'SELECTED':
      case 'HIRED':
        return 'badge-success';
      case 'FINAL_SCREENING':
        return 'badge-screening';
      case 'OFFER_MADE':
        return 'badge-offer';
      case 'REJECTED':
      case 'WITHDRAWN':
      case 'OFFER_EXPIRED':
        return 'badge-rejected';
      default:
        return 'badge-default';
    }
  }
}