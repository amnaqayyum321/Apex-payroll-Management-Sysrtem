import { Component } from '@angular/core';
import { OnboardingService } from '../../Services/onboarding';
import { ToastrService } from 'ngx-toastr';
import { LoaderService } from '../../../../core/services/management-services/loader.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-view-offers-list',
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './view-offers-list.html',
  styleUrl: './view-offers-list.scss',
})
export class ViewOffersList {
  // All offers (full list when filtering, page data otherwise)
  OfferList: any[] = [];
  // Filtered result (after search/status)
  filteredOfferList: any[] = [];
  // Current page data to display
  paginatedOfferList: any[] = [];

  // Pagination
  totalItems: number = 0;
  totalPagesCount: number = 0;
  currentPage = 1;
  itemsPerPage = 7;

  // Filters
  searchTerm: string = '';
  statusFilter: string = ''; // 'ALL', 'DRAFT', 'SENT', 'APPROVED', 'EXPIRED', 'INACTIVE'

  // Helper to know if we are in filter mode (any filter active)
  get isAnyFilterActive(): boolean {
    return !!this.searchTerm || !!(this.statusFilter && this.statusFilter !== 'ALL');
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
    private Onboarding: OnboardingService,
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
      // Fetch all offers to enable client‑side filtering
      this.Onboarding.getAllOffer(0, 9999, undefined).subscribe({
        next: (response: any) => {
          this.loader.hide();
          this.OfferList = response?.data?.content || response?.data || [];
          this.totalPagesCount = Math.ceil(this.OfferList.length / this.itemsPerPage);
          this.applyFilter();
        },
        error: (error) => {
          this.loader.hide();
          this.toastr.error('Error fetching offers list');
        },
      });
    } else {
      // Normal server‑side pagination
      const backendPage = this.currentPage - 1;
      this.Onboarding.getAllOffer(backendPage, this.itemsPerPage, undefined).subscribe({
        next: (response: any) => {
          this.loader.hide();
          this.OfferList = response?.data?.content || response?.data || [];
          this.totalItems = response?.paginator?.totalItems || 0;
          this.totalPagesCount = response?.paginator?.totalPages || 0;
          this.currentPage = (response?.paginator?.currentPage || 0) + 1;
          this.applyFilter(); // will just assign without extra filtering
        },
        error: (error) => {
          this.loader.hide();
          this.toastr.error('Error fetching offers list');
        },
      });
    }
  }

  // Apply search and status filters to the current data set
  applyFilter() {
    const term = this.searchTerm.toLowerCase().trim();

    if (this.isAnyFilterActive) {
      // Client‑side filtering on the full list
      this.filteredOfferList = this.OfferList.filter((item) => {
        const matchesSearch =
          !term ||
          item.name?.toLowerCase().includes(term) ||
          item.code?.toLowerCase().includes(term);

        const matchesStatus =
          !this.statusFilter ||
          this.statusFilter === 'ALL' ||
          item.status === this.statusFilter;

        return matchesSearch && matchesStatus;
      });

      this.totalItems = this.filteredOfferList.length;
      this.totalPagesCount = Math.ceil(this.totalItems / this.itemsPerPage);
      this.updatePaginatedList();
    } else {
      // No filters – just use the server‑side page data
      this.filteredOfferList = this.OfferList;
      this.paginatedOfferList = this.filteredOfferList;
    }
  }

  // Slice the filtered list for the current page (only used when filters active)
  updatePaginatedList() {
    if (this.isAnyFilterActive) {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      this.paginatedOfferList = this.filteredOfferList.slice(
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
}