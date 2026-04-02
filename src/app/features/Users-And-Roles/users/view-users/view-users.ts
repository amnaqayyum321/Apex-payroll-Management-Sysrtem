import { Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { LoaderService } from '../../../../core/services/management-services/loader.service';
import { CommonModule } from '@angular/common';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { RouterModule } from '@angular/router';
import { UsersAndRolesService } from '../../Services/user-roles';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-view-users',
  imports: [CommonModule, FormsModule, RouterModule, NgbDropdownModule],
  standalone: true,
  templateUrl: './view-users.html',
  styleUrl: './view-users.scss',
})
export class ViewUsers {
  usersList: any[] = [];
  filteredUsersList: any[] = [];
  paginatedUsersList: any[] = [];

  totalItems: number = 0;
  totalPagesCount: number = 0;
  currentPage = 1;
  itemsPerPage = 7;

  searchTerm: string = '';
  roleFilter: string = '';
  uniqueRoles: string[] = [];

  constructor(
    private getAllUser: UsersAndRolesService,
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
    return !!this.searchTerm || !!this.roleFilter;
  }

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    this.loader.show();

    const backendPage = this.currentPage - 1;
    const pageSize = this.isAnyFilterActive ? 9999 : this.itemsPerPage;
    const page = this.isAnyFilterActive ? 0 : backendPage;

    this.getAllUser.getAllUser(page, pageSize).subscribe({
      next: (response: any) => {
        this.loader.hide();
        this.usersList = response.data;

        // Extract unique roles for filter dropdown
        this.uniqueRoles = [...new Set(this.usersList.map((user: any) => user.roleCode))];

        this.totalItems = response.paginator.totalItems;
        this.totalPagesCount = response.paginator.totalPages;
        this.currentPage = this.isAnyFilterActive
          ? 1
          : response.paginator.currentPage + 1;

        this.applyFilter();
      },
      error: (error) => {
        this.loader.hide();
        this.toastr.error('Error fetching users list');
      },
    });
  }

  changePage(page: number) {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    this.loadUsers();
  }

  onItemsPerPageChange() {
    this.currentPage = 1;
    this.loadUsers();
  }

  onSearch() {
    this.currentPage = 1;
    this.loadUsers();
  }

  onRoleChange() {
    this.currentPage = 1;
    this.loadUsers();
  }

  applyFilter() {
    const term = this.searchTerm.toLowerCase().trim();

    this.filteredUsersList = this.usersList.filter((user) => {
      const matchesSearch =
        !term ||
        user.firstName?.toLowerCase().includes(term) ||
        user.lastName?.toLowerCase().includes(term) ||
        user.email?.toLowerCase().includes(term);

      const matchesRole = !this.roleFilter || user.roleCode === this.roleFilter;

      return matchesSearch && matchesRole;
    });

    this.updatePaginatedList();
  }

  updatePaginatedList() {
    if (this.isAnyFilterActive) {
      this.totalItems = this.filteredUsersList.length;
      const start = (this.currentPage - 1) * this.itemsPerPage;
      this.paginatedUsersList = this.filteredUsersList.slice(
        start,
        start + this.itemsPerPage,
      );
    } else {
      this.totalItems = this.totalPagesCount * this.itemsPerPage;
      this.paginatedUsersList = this.filteredUsersList;
    }
  }

  resetFilters() {
    this.searchTerm = '';
    this.roleFilter = '';
    this.currentPage = 1;
    this.loadUsers();
  }

  formatRoleName(role: string): string {
    if (!role) return '';

    return role
      .toLowerCase()
      .replace(/_/g, ' ')
      .replace(/\b\w/g, (c) => c.toUpperCase());
  }
}