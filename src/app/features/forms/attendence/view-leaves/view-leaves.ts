import { Component } from '@angular/core';
import { FormsService } from '../../Services/forms';
import { ToastrService } from 'ngx-toastr';
import { LoaderService } from '../../../../core/services/management-services/loader.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-view-leaves',
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './view-leaves.html',
  styleUrl: './view-leaves.scss',
})
export class ViewLeaves {
  LeavesList: any[] = [];
  filteredLeaveList: any[] = [];
  paginatedLeavesList: any[] = [];

  totalItems: number = 0;
  totalPagesCount: number = 0;
  currentPage = 1;
  itemsPerPage = 7;
  searchTerm: string = '';
  leavesPerYearFilter: string = ''; // NEW: Leaves Per Year filter

  constructor(
    private formsService: FormsService,
    private toastr: ToastrService,
    private loader: LoaderService,
  ) {}

  get totalPages() {
    return Math.ceil(this.totalItems / this.itemsPerPage);
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

  // NEW: Unique leaves per year values for dropdown
  get uniqueLeavesPerYear(): number[] {
    const values = this.LeavesList.map((l) => l.totalLeavesPerYear).filter(
      (v) => v !== null && v !== undefined,
    );
    return [...new Set(values)].sort((a, b) => a - b);
  }

  // NEW: Check karo koi bhi filter active hai ya nahi
  get isAnyFilterActive(): boolean {
    return !!this.searchTerm || !!this.leavesPerYearFilter;
  }

  ngOnInit() {
    this.loadLeaves();
  }

  loadLeaves() {
    this.loader.show();
    const backendPage = this.currentPage - 1;
     const pageSize = this.isAnyFilterActive ? 9999 : this.itemsPerPage;
  const page = this.isAnyFilterActive ? 0 : backendPage;
    this.formsService.getAllLeaves(page, pageSize, 'ALL').subscribe({
      next: (response: any) => {
        this.loader.hide();
        this.LeavesList = response.data.sort(
        (a: any, b: any) =>
          new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime()
      );;
        this.totalItems = response.paginator.totalItems;
        this.totalPagesCount = response.paginator.totalPages;
        this.currentPage = this.isAnyFilterActive
        ? 1
        : response.paginator.currentPage + 1;
        this.applyFilter();
      },
      error: () => {
        this.loader.hide();
        this.toastr.error('Error fetching leaves list');
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

  // NEW: Leaves Per Year filter change
  onLeavesPerYearChange() {
    this.currentPage = 1;
    this.loadLeaves();
  }

  applyFilter() {
    const term = this.searchTerm.toLowerCase().trim();
    const yearFilter = this.leavesPerYearFilter;

    this.filteredLeaveList = this.LeavesList.filter((leave) => {
      const matchesSearch =
        !term ||
        leave.employeeName?.toLowerCase().includes(term) ||
        leave.employeeCode?.toLowerCase().includes(term) ||
        leave.leaveTypeName?.toLowerCase().includes(term);

      const matchesYear = !yearFilter || String(leave.totalLeavesPerYear) === String(yearFilter);

      return matchesSearch && matchesYear;
    });

    this.updatePaginatedList();
  }

  updatePaginatedList() {
    const hasFilter = this.isAnyFilterActive;

    if (hasFilter) {
      this.totalItems = this.filteredLeaveList.length;
      const start = (this.currentPage - 1) * this.itemsPerPage;
      this.paginatedLeavesList = this.filteredLeaveList.slice(start, start + this.itemsPerPage);
    } else {
      this.totalItems = this.totalPagesCount * this.itemsPerPage;
      this.paginatedLeavesList = this.LeavesList;
    }
  }

  // NEW: Reset sab filters ek saath
  resetSearch() {
    this.searchTerm = '';
    this.leavesPerYearFilter = '';
    this.currentPage = 1;
    this.loadLeaves();
  }

  formatRoleName(role: string): string {
    if (!role) return '';
    return role
      .toLowerCase()
      .replace(/_/g, ' ')
      .replace(/\b\w/g, (c) => c.toUpperCase());
  }
}
