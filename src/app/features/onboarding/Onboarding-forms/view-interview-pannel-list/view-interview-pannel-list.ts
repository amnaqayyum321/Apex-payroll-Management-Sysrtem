import { Component } from '@angular/core';
import { OnboardingService } from '../../Services/onboarding';
import { ToastrService } from 'ngx-toastr';
import { LoaderService } from '../../../../core/services/management-services/loader.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-view-interview-pannel-list',
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './view-interview-pannel-list.html',
  styleUrl: './view-interview-pannel-list.scss',
})
export class ViewInterviewPannelList {
  // All panels (full list when filtering, page data otherwise)
  InterviewPanelList: any[] = [];
  // Filtered result (after search/status)
  filteredInterviewPanelList: any[] = [];
  // Current page data to display
  paginatedInterviewPanelList: any[] = [];

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
      // Fetch all panels to enable client‑side filtering
      this.Onboarding.getAllInterviewPanel(0, 9999).subscribe({
        next: (response: any) => {
          this.loader.hide();
          this.InterviewPanelList = response.data;
          this.totalPagesCount = Math.ceil(this.InterviewPanelList.length / this.itemsPerPage);
          this.applyFilter();
        },
        error: (error) => {
          this.loader.hide();
          this.toastr.error('Error fetching interview panels list');
        },
      });
    } else {
      // Normal server‑side pagination
      const backendPage = this.currentPage - 1;
      this.Onboarding.getAllInterviewPanel(backendPage, this.itemsPerPage).subscribe({
        next: (response: any) => {
          this.loader.hide();
          this.InterviewPanelList = response.data;
          this.totalItems = response.paginator.totalItems;
          this.totalPagesCount = response.paginator.totalPages;
          this.currentPage = response.paginator.currentPage + 1; // Backend 0‑indexed
          this.applyFilter(); // will just assign without extra filtering
        },
        error: (error) => {
          this.loader.hide();
          this.toastr.error('Error fetching interview panels list');
        },
      });
    }
  }

  // Apply search and status filters to the current data set
  applyFilter() {
    const term = this.searchTerm.toLowerCase().trim();

    if (this.isAnyFilterActive) {
      // Client‑side filtering on the full list
      this.filteredInterviewPanelList = this.InterviewPanelList.filter((item) => {
        const matchesSearch =
          !term ||
          item.name?.toLowerCase().includes(term) ||
          item.code?.toLowerCase().includes(term);

        const matchesStatus =
          !this.statusFilter || String(item.isActive) === this.statusFilter;

        return matchesSearch && matchesStatus;
      });

      this.totalItems = this.filteredInterviewPanelList.length;
      this.totalPagesCount = Math.ceil(this.totalItems / this.itemsPerPage);
      this.updatePaginatedList();
    } else {
      // No filters – just use the server‑side page data
      this.filteredInterviewPanelList = this.InterviewPanelList;
      this.paginatedInterviewPanelList = this.filteredInterviewPanelList;
    }
  }

  // Slice the filtered list for the current page (only used when filters active)
  updatePaginatedList() {
    if (this.isAnyFilterActive) {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      this.paginatedInterviewPanelList = this.filteredInterviewPanelList.slice(
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