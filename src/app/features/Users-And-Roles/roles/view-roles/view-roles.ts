import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { LoaderService } from '../../../../core/services/management-services/loader.service';
import { UsersAndRolesService } from '../../Services/user-roles';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-view-roles',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, NgbDropdownModule],
  templateUrl: './view-roles.html',
  styleUrl: './view-roles.scss',
})
export class ViewRoles {
  rolesList: any[] = [];
  filteredRolesList: any[] = [];
  paginatedRolesList: any[] = [];

  totalItems: number = 0;
  totalPagesCount: number = 0;
  currentPage = 1;
  itemsPerPage = 7;

  searchTerm: string = '';

  constructor(
    private UsersAndRolesService: UsersAndRolesService,
    private toastr: ToastrService,
    private loader: LoaderService,
    private router: Router,
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
    return !!this.searchTerm;
  }

  ngOnInit() {
    this.loadRoles();
  }

  loadRoles() {
    this.loader.show();

    const backendPage = this.currentPage - 1;
    const pageSize = this.isAnyFilterActive ? 9999 : this.itemsPerPage;
    const page = this.isAnyFilterActive ? 0 : backendPage;

    this.UsersAndRolesService.getRoles(page, pageSize).subscribe({
      next: (response: any) => {
        this.loader.hide();
        this.rolesList = response.data;

        this.totalItems = response.paginator.totalItems;
        this.totalPagesCount = response.paginator.totalPages;
        this.currentPage = this.isAnyFilterActive
          ? 1
          : response.paginator.currentPage + 1;

        this.applyFilter();
      },
      error: (error) => {
        this.loader.hide();
        this.toastr.error('Error fetching roles list');
      },
    });
  }

  changePage(page: number) {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    this.loadRoles();
  }

  onItemsPerPageChange() {
    this.currentPage = 1;
    this.loadRoles();
  }

  onSearch() {
    this.currentPage = 1;
    this.loadRoles();
  }

  applyFilter() {
    const term = this.searchTerm.toLowerCase().trim();

    this.filteredRolesList = this.rolesList.filter((role) => {
      const matchesSearch =
        !term ||
        role.name?.toLowerCase().includes(term) ||
        role.code?.toLowerCase().includes(term);

      return matchesSearch;
    });

    this.updatePaginatedList();
  }

  updatePaginatedList() {
    if (this.isAnyFilterActive) {
      this.totalItems = this.filteredRolesList.length;
      const start = (this.currentPage - 1) * this.itemsPerPage;
      this.paginatedRolesList = this.filteredRolesList.slice(
        start,
        start + this.itemsPerPage,
      );
    } else {
      this.totalItems = this.totalPagesCount * this.itemsPerPage;
      this.paginatedRolesList = this.filteredRolesList;
    }
  }

  resetFilters() {
    this.searchTerm = '';
    this.currentPage = 1;
    this.loadRoles();
  }

  goToPermissions(role: any) {
    this.router.navigate(['/panel/users-and-roles/view-permissions'], {
      queryParams: { publicId: role.publicId },
    });
  }
}