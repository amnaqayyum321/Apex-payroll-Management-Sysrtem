import { Component } from '@angular/core';
import { FormsService } from '../../Services/forms';
import { ToastrService } from 'ngx-toastr';
import { LoaderService } from '../../../../core/services/management-services/loader.service';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-view-id-type-list',
  imports: [RouterModule, FormsModule, CommonModule],
  templateUrl: './view-id-type-list.html',
  styleUrl: './view-id-type-list.scss',
})
export class ViewIDTypeList {
   IDTypeList: any[] = [];
  filteredIDTypeList: any[] = [];
  paginatedIDTypeList: any[] = [];

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
    this.loadIDType();
  }

  loadIDType() {
    this.loader.show();
    const backendPage = this.currentPage - 1;
     const pageSize = this.isAnyFilterActive ? 9999 : this.itemsPerPage;
  const page = this.isAnyFilterActive ? 0 : backendPage;
    this.FormSv.GetIDType(page, pageSize).subscribe({
      next: (response: any) => {
        this.loader.hide();
        this.IDTypeList = response.data.sort(
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
        this.toastr.error('Error fetching employees category list');
      },
    });
  }

  changePage(page: number) {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    this.loadIDType();
  }

  onItemsPerPageChange() {
    this.currentPage = 1;
    this.loadIDType();
  }

  onSearch() {
    this.currentPage = 1;
    this.loadIDType();
  }

  onStatusChange() {
    this.currentPage = 1;
    this.loadIDType();
  }

  applyFilter() {
    const term = this.searchTerm.toLowerCase().trim();

    this.filteredIDTypeList = this.IDTypeList.filter((item) => {
      const matchesSearch =
        !term || item.name?.toLowerCase().includes(term) || item.code?.toLowerCase().includes(term);

      const matchesStatus = this.statusFilter === '' || String(item.isActive) === this.statusFilter;

      return matchesSearch && matchesStatus;
    });

    this.updatePaginatedList();
  }

  updatePaginatedList() {
    if (this.isAnyFilterActive) {
      this.totalItems = this.filteredIDTypeList.length;
      const start = (this.currentPage - 1) * this.itemsPerPage;
      this.paginatedIDTypeList = this.filteredIDTypeList.slice(
        start,
        start + this.itemsPerPage,
      );
    } else {
      this.totalItems = this.totalPagesCount * this.itemsPerPage;
      this.paginatedIDTypeList = this.IDTypeList;
    }
  }

  resetFilters() {
    this.searchTerm = '';
    this.statusFilter = '';
    this.currentPage = 1;
    this.loadIDType();
  }
}
