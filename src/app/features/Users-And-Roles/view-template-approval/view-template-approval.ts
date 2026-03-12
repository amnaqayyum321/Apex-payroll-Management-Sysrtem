import { Component } from '@angular/core';
import { LoaderService } from '../../../core/services/management-services/loader.service';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FormsService } from '../../forms/Services/forms';
import { RouterModule } from '@angular/router';
import { UsersAndRolesService } from '../Services/user-roles';

@Component({
  selector: 'app-view-template-approval',
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './view-template-approval.html',
  styleUrl: './view-template-approval.scss',
})
export class ViewTemplateApproval {
  fullList: any[] = [];
  filteredList: any[] = [];
  paginatedList: any[] = [];

  searchTerm: string = '';
  currentPage = 0;
  itemsPerPage = 7;
  pageSize: number = 100;
  totalItems: number = 0;
  totalPagesCount: number = 0;

  constructor(
    private userSv: UsersAndRolesService,
    private toastr: ToastrService,
    private loader: LoaderService,
  ) {}

  ngOnInit() {
    this.loadAllTemplates();
  }

  loadAllTemplates() {
    this.userSv.getApprovaLTemplate(this.currentPage, this.pageSize).subscribe(
      (res: any) => {
        if (res.success) {
          this.fullList = res.data;
          this.applyFilter();
          console.log('All Approval Template Get Successfully', res);
        }
      },
      (err: any) => {
        console.log(err);
      },
    );
  }

  applyFilter() {
    const term = this.searchTerm.toLowerCase().trim();
    this.filteredList = !term
      ? [...this.fullList]
      : this.fullList.filter(
          (t) =>
            t.code?.toLowerCase().includes(term) ||
            t.name?.toLowerCase().includes(term) ||
            t.entityName?.toLowerCase().includes(term),
        );
    this.totalItems = this.filteredList.length;
    this.totalPagesCount = Math.ceil(this.totalItems / this.itemsPerPage);
    this.currentPage = 1;
    this.updatePaginatedList();
  }

  updatePaginatedList() {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    this.paginatedList = this.filteredList.slice(start, start + this.itemsPerPage);
  }

  onSearch() {
    this.applyFilter();
  }

  onItemsPerPageChange() {
    this.totalPagesCount = Math.ceil(this.totalItems / this.itemsPerPage);
    this.currentPage = 1;
    this.updatePaginatedList();
  }

  changePage(page: number) {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    this.updatePaginatedList();
  }

  get firstItem(): number {
    return this.totalItems > 0 ? (this.currentPage - 1) * this.itemsPerPage + 1 : 0;
  }
  get lastItem(): number {
    return this.totalItems > 0
      ? Math.min(this.currentPage * this.itemsPerPage, this.totalItems)
      : 0;
  }
  get totalPages() {
    return this.totalPagesCount || 1;
  }
  get totalPagesArray(): number[] {
    const pages: number[] = [];
    const maxVisible = 5;
    const half = Math.floor(maxVisible / 2);
    let start = Math.max(1, this.currentPage - half);
    let end = Math.min(this.totalPages, start + maxVisible - 1);
    if (end - start + 1 < maxVisible) start = Math.max(1, end - maxVisible + 1);
    for (let i = start; i <= end; i++) pages.push(i);
    return pages;
  }

  getStatusClass(status: string): string {
    switch (status?.toUpperCase()) {
      case 'ACTIVE':
        return 'active-badge';
      case 'DRAFT':
        return 'draft-badge';
      case 'INACTIVE':
        return 'inactive-badge';
      default:
        return 'inactive-badge';
    }
  }
}
