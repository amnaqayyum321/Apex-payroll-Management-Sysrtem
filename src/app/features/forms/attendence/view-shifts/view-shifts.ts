import { Component } from '@angular/core';
import { FormsService } from '../../Services/forms';
import { ToastrService } from 'ngx-toastr';
import { LoaderService } from '../../../../core/services/management-services/loader.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-view-shifts',
  imports: [CommonModule, FormsModule, RouterModule, NgbDropdownModule],
  templateUrl: './view-shifts.html',
  styleUrl: './view-shifts.scss',
})
export class ViewShifts {
  ShiftsList: any[] = [];
  filteredShiftsList: any[] = [];
  paginatedShiftsList: any[] = [];

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
    this.loadShifts();
  }

  loadShifts() {
    this.loader.show();
    const backendPage = this.currentPage - 1;
     const pageSize = this.isAnyFilterActive ? 9999 : this.itemsPerPage;
  const page = this.isAnyFilterActive ? 0 : backendPage;
    this.formsService.getAllShifts(page, pageSize, 'ALL').subscribe({
      next: (response: any) => {
        this.loader.hide();
        this.ShiftsList = response.data.sort(
        (a: any, b: any) =>
          new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime()
      );;
        this.totalItems = response.paginator.totalItems;
        this.totalPagesCount = response.paginator.totalPages;
        this.currentPage =this.isAnyFilterActive
        ? 1
        :  response.paginator.currentPage + 1;
        this.applyFilter();
      },
      error: () => {
        this.loader.hide();
        this.toastr.error('Error fetching shifts list');
      },
    });
  }

  changePage(page: number) {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    this.loadShifts();
  }

  onItemsPerPageChange() {
    this.currentPage = 1;
    this.loadShifts();
  }

  onSearch() {
    this.currentPage = 1;
    this.loadShifts();
  }

  onStatusChange() {
    this.currentPage = 1;
    this.loadShifts();
  }

  applyFilter() {
    const term = this.searchTerm.toLowerCase().trim();

    this.filteredShiftsList = this.ShiftsList.filter((item) => {
      const matchesSearch =
        !term || item.name?.toLowerCase().includes(term) || item.code?.toLowerCase().includes(term);

      const matchesStatus = this.statusFilter === '' || String(item.isActive) === this.statusFilter;

      return matchesSearch && matchesStatus;
    });

    this.updatePaginatedList();
  }

  updatePaginatedList() {
    if (this.isAnyFilterActive) {
      this.totalItems = this.filteredShiftsList.length;
      const start = (this.currentPage - 1) * this.itemsPerPage;
      this.paginatedShiftsList = this.filteredShiftsList.slice(start, start + this.itemsPerPage);
    } else {
      this.totalItems = this.totalPagesCount * this.itemsPerPage;
      this.paginatedShiftsList = this.ShiftsList;
    }
  }

  resetFilters() {
    this.searchTerm = '';
    this.statusFilter = '';
    this.currentPage = 1;
    this.applyFilter();
  }

  formatRoleName(role: string): string {
    if (!role) return '';
    return role
      .toLowerCase()
      .replace(/_/g, ' ')
      .replace(/\b\w/g, (c) => c.toUpperCase());
  }
}
