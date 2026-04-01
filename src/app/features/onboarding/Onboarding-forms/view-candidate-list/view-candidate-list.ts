import { Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { LoaderService } from '../../../../core/services/management-services/loader.service';
import { OnboardingService } from '../../Services/onboarding';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-view-candidate-list',
  imports: [RouterModule, CommonModule, FormsModule],
  templateUrl: './view-candidate-list.html',
  styleUrl: './view-candidate-list.scss',
})
export class ViewCandidateList {
  // All candidates (full list when filtering, page data otherwise)
  CandidateList: any[] = [];
  // Filtered result (after search/status)
  filteredCandidateList: any[] = [];
  // Current page data to display
  paginatedCandidateList: any[] = [];

  // Pagination
  totalItems: number = 0;
  totalPagesCount: number = 0;
  currentPage = 1;
  itemsPerPage = 7;

  // Filters
  searchTerm: string = '';
  statusFilter: string = ''; // 'true' / 'false' / ''

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
    private OnboardingSv: OnboardingService,
    private toastr: ToastrService,
    private loader: LoaderService,
  ) {}

  ngOnInit() {
    this.loadAllCandidate();
  }

  // Main data loading – decides whether to fetch all (if filters active) or just one page
  loadAllCandidate() {
    this.loader.show();

    if (this.isAnyFilterActive) {
      // Fetch all candidates to enable client‑side filtering
      this.OnboardingSv.getAllCandidate(0, 9999).subscribe({
        next: (response: any) => {
          this.loader.hide();
          this.CandidateList = response.data;
          this.totalPagesCount = Math.ceil(this.CandidateList.length / this.itemsPerPage);
          this.applyFilter();
        },
        error: (error) => {
          this.loader.hide();
          this.toastr.error('Error fetching candidates list');
        },
      });
    } else {
      // Normal server‑side pagination
      const backendPage = this.currentPage - 1;
      this.OnboardingSv.getAllCandidate(backendPage, this.itemsPerPage).subscribe({
        next: (response: any) => {
          this.loader.hide();
          this.CandidateList = response.data;
          this.totalItems = response.paginator.totalItems;
          this.totalPagesCount = response.paginator.totalPages;
          this.currentPage = response.paginator.currentPage + 1; // Backend 0‑indexed
          this.applyFilter(); // will just assign without extra filtering
        },
        error: (error) => {
          this.loader.hide();
          this.toastr.error('Error fetching candidates list');
        },
      });
    }
  }

  // Apply search and status filters to the current data set
  applyFilter() {
    const term = this.searchTerm.toLowerCase().trim();

    if (this.isAnyFilterActive) {
      // Client‑side filtering on the full list
      this.filteredCandidateList = this.CandidateList.filter((item) => {
        const fullName = `${item.firstName} ${item.lastName}`.toLowerCase();
        const matchesSearch =
          !term ||
          fullName.includes(term) ||
          item.code?.toLowerCase().includes(term) ||
          item.email?.toLowerCase().includes(term) ||
          item.country?.toLowerCase().includes(term);

        const matchesStatus =
          !this.statusFilter || String(item.isActive) === this.statusFilter;

        return matchesSearch && matchesStatus;
      });

      this.totalItems = this.filteredCandidateList.length;
      this.totalPagesCount = Math.ceil(this.totalItems / this.itemsPerPage);
      this.updatePaginatedList();
    } else {
      // No filters – just use the server‑side page data
      this.filteredCandidateList = this.CandidateList;
      this.paginatedCandidateList = this.filteredCandidateList;
    }
  }

  // Slice the filtered list for the current page (only used when filters active)
  updatePaginatedList() {
    if (this.isAnyFilterActive) {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      this.paginatedCandidateList = this.filteredCandidateList.slice(
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
      this.loadAllCandidate();
    }
  }

  // Items per page changed
  onItemsPerPageChange() {
    this.currentPage = 1;
    if (this.isAnyFilterActive) {
      this.totalPagesCount = Math.ceil(this.totalItems / this.itemsPerPage);
      this.updatePaginatedList();
    } else {
      this.loadAllCandidate();
    }
  }

  // Search input changed
  onSearch() {
    this.currentPage = 1;
    this.loadAllCandidate();
  }

  // Status filter changed
  onStatusChange() {
    this.currentPage = 1;
    this.loadAllCandidate();
  }

  // Reset all filters
  resetFilters() {
    this.searchTerm = '';
    this.statusFilter = '';
    this.currentPage = 1;
    this.loadAllCandidate();
  }
}