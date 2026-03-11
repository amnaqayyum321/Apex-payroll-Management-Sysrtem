import { Component } from '@angular/core';
import { FormsService } from '../../Services/forms';
import { ToastrService } from 'ngx-toastr';
import { LoaderService } from '../../../../core/services/management-services/loader.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-view-employee-category-list',
  imports: [FormsModule, CommonModule, RouterModule],
  templateUrl: './view-employee-category-list.html',
  styleUrl: './view-employee-category-list.scss',
})
export class ViewEmployeeCategoryList {
  EmployeeCategoryList: any[] = [];
  filteredEmployeeCategoryList: any[] = [];
  paginatedEmployeeCategoryList: any[] = [];

  totalItems: number = 0;
  totalPagesCount: number = 0;
  currentPage = 1;
  itemsPerPage = 7;

  searchTerm: string = '';
  statusFilter: string = '';

  constructor(
    private FormSv: FormsService,
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
    this.loadEmployeeCategory();
  }

  loadEmployeeCategory() {
    this.loader.show();
    const backendPage = this.currentPage - 1;
    this.FormSv.GetEmployeeCaterogy(backendPage, this.itemsPerPage).subscribe({
      next: (response: any) => {
        this.loader.hide();
        this.EmployeeCategoryList = response.data;
        this.totalItems = response.paginator.totalItems;
        this.totalPagesCount = response.paginator.totalPages;
        this.currentPage = response.paginator.currentPage + 1;
        this.applyFilter();
      },
      error: () => {
        this.loader.hide();
        this.toastr.error('Error fetching employees category list');
      },
    });
  }

  changePage(page: number) {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    this.loadEmployeeCategory();
  }

  onItemsPerPageChange() {
    this.currentPage = 1;
    this.loadEmployeeCategory();
  }

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

    this.filteredEmployeeCategoryList = this.EmployeeCategoryList.filter((item) => {
      const matchesSearch =
        !term || item.name?.toLowerCase().includes(term) || item.code?.toLowerCase().includes(term);

      const matchesStatus = this.statusFilter === '' || String(item.isActive) === this.statusFilter;

      return matchesSearch && matchesStatus;
    });

    this.updatePaginatedList();
  }

  updatePaginatedList() {
    if (this.isAnyFilterActive) {
      this.totalItems = this.filteredEmployeeCategoryList.length;
      const start = (this.currentPage - 1) * this.itemsPerPage;
      this.paginatedEmployeeCategoryList = this.filteredEmployeeCategoryList.slice(
        start,
        start + this.itemsPerPage,
      );
    } else {
      this.totalItems = this.totalPagesCount * this.itemsPerPage;
      this.paginatedEmployeeCategoryList = this.EmployeeCategoryList;
    }
  }

  resetFilters() {
    this.searchTerm = '';
    this.statusFilter = '';
    this.currentPage = 1;
    this.applyFilter();
  }
}
