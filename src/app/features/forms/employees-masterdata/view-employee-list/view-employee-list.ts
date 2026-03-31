import { Component } from '@angular/core';
import { FormsService } from '../../Services/forms';
import { ToastrService } from 'ngx-toastr';
import { LoaderService } from '../../../../core/services/management-services/loader.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-view-employee-list',
  imports: [FormsModule, CommonModule, RouterModule],
  templateUrl: './view-employee-list.html',
  styleUrl: './view-employee-list.scss',
})
export class ViewEmployeeList {
  EmployeeList: any[] = [];
  filteredEmployeeList: any[] = [];
  paginatedEmployeeList: any[] = [];

  totalItems: number = 0;
  totalPagesCount: number = 0;
  currentPage = 1;
  itemsPerPage = 7;

  searchTerm: string = '';
  statusFilter: string = '';

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
    return !!this.searchTerm || !!this.statusFilter;
  }

  ngOnInit() {
    this.loadEmployeeList();
  }

  loadEmployeeList() {
    this.loader.show();
    const backendPage = this.currentPage - 1;
     const pageSize = this.isAnyFilterActive ? 9999 : this.itemsPerPage;
  const page = this.isAnyFilterActive ? 0 : backendPage;
    this.formsService.GetEmployeesList(page, pageSize).subscribe({
      next: (response: any) => {
        this.loader.hide();
        this.EmployeeList = response.data.sort(
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
        this.toastr.error('Error fetching belongings list');
      },
    });
  }

  changePage(page: number) {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    this.loadEmployeeList();
  }

  onItemsPerPageChange() {
    this.currentPage = 1;
    this.loadEmployeeList();
  }

  onSearch() {
    this.currentPage = 1;
    this.loadEmployeeList();
  }

  onStatusChange() {
    this.currentPage = 1;
    this.loadEmployeeList();
  }

  applyFilter() {
    const term = this.searchTerm.toLowerCase().trim();

    this.filteredEmployeeList = this.EmployeeList.filter((item) => {
      const matchesSearch =
        !term || item.name?.toLowerCase().includes(term) || item.code?.toLowerCase().includes(term);

      const matchesStatus = this.statusFilter === '' || String(item.isActive) === this.statusFilter;

      return matchesSearch && matchesStatus;
    });

    this.updatePaginatedList();
  }

  updatePaginatedList() {
    if (this.isAnyFilterActive) {
      this.totalItems = this.filteredEmployeeList.length;
      const start = (this.currentPage - 1) * this.itemsPerPage;
      this.paginatedEmployeeList = this.filteredEmployeeList.slice(
        start,
        start + this.itemsPerPage,
      );
    } else {
      this.totalItems = this.totalPagesCount * this.itemsPerPage;
      this.paginatedEmployeeList = this.EmployeeList;
    }
  }

  resetFilters() {
    this.searchTerm = '';
    this.statusFilter = '';
    this.currentPage = 1;
    this.loadEmployeeList();
  }

  formatRoleName(role: string): string {
    if (!role) return '';
    return role
      .toLowerCase()
      .replace(/_/g, ' ')
      .replace(/\b\w/g, (c) => c.toUpperCase());
  }
}
