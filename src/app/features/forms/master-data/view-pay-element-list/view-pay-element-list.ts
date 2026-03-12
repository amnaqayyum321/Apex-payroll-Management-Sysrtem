import { Component } from '@angular/core';
import { FormsService } from '../../Services/forms';
import { ToastrService } from 'ngx-toastr';
import { LoaderService } from '../../../../core/services/management-services/loader.service';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-view-pay-element-list',
  imports: [RouterModule, CommonModule, FormsModule],
  templateUrl: './view-pay-element-list.html',
  styleUrl: './view-pay-element-list.scss',
})
export class ViewPayElementList {
   PayElementList: any[] = [];
  filteredPayElementList: any[] = [];
  paginatedPayElementList: any[] = [];

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
    this.loadPayElement();
  }

  loadPayElement() {
    this.loader.show();
    const backendPage = this.currentPage - 1;
    this.FormSv.GetPayElement(backendPage, this.itemsPerPage).subscribe({
      next: (response: any) => {
        this.loader.hide();
        this.PayElementList = response.data;
        this.totalItems = response.paginator.totalItems;
        this.totalPagesCount = response.paginator.totalPages;
        this.currentPage = response.paginator.currentPage + 1;
        this.applyFilter();
      },
      error: () => {
        this.loader.hide();
        this.toastr.error('Error fetching pay elements list');
      },
    });
  }

  changePage(page: number) {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    this.loadPayElement();
  }

  onItemsPerPageChange() {
    this.currentPage = 1;
    this.loadPayElement();
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

    this.filteredPayElementList = this.PayElementList.filter((item) => {
      const matchesSearch =
        !term || item.name?.toLowerCase().includes(term) || item.code?.toLowerCase().includes(term);

      const matchesStatus = this.statusFilter === '' || String(item.isActive) === this.statusFilter;

      return matchesSearch && matchesStatus;
    });

    this.updatePaginatedList();
  }

  updatePaginatedList() {
    if (this.isAnyFilterActive) {
      this.totalItems = this.filteredPayElementList.length;
      const start = (this.currentPage - 1) * this.itemsPerPage;
      this.paginatedPayElementList = this.filteredPayElementList.slice(
        start,
        start + this.itemsPerPage,
      );
    } else {
      this.totalItems = this.totalPagesCount * this.itemsPerPage;
      this.paginatedPayElementList = this.PayElementList;
    }
  }

  resetFilters() {
    this.searchTerm = '';
    this.statusFilter = '';
    this.currentPage = 1;
    this.applyFilter();
  }
}
