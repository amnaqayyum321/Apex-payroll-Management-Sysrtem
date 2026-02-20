import { Component } from '@angular/core';
import { UsersAndRolesService } from '../../../../Users-And-Roles/Services/user-roles';
import { ToastrService } from 'ngx-toastr';
import { LoaderService } from '../../../../../core/services/management-services/loader.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-view-department-list',
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './view-department-list.html',
  styleUrl: './view-department-list.scss',
})
export class ViewDepartmentList {
  DepartmentList: any[] = [];
  totalItems: number = 0;
  totalPagesCount: number = 0;

  constructor(
    private getAllUser: UsersAndRolesService,
    private toastr: ToastrService,
    private loader: LoaderService,
  ) {}

  currentPage = 1;
  itemsPerPage = 7;
  paginatedDepartmentList: any[] = [];

  get totalPages() {
    return this.totalPagesCount || Math.ceil(this.totalItems / this.itemsPerPage);
  }

  get totalPagesArray() {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  ngOnInit() {
    this.loadDepartment();
  }

  loadDepartment() {
    this.loader.show();
    const backendPage = this.currentPage - 1;
    this.getAllUser.getAllUser(backendPage, this.itemsPerPage).subscribe({
      next: (response: any) => {
        this.loader.hide();
        this.DepartmentList = response.data;
        console.log(this.DepartmentList);
        this.totalItems = response.paginator.totalItems;
        this.totalPagesCount = response.paginator.totalPages;
        this.currentPage = response.paginator.currentPage + 1; // Backend 0-indexed
        this.paginatedDepartmentList = this.DepartmentList;
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
    this.loadDepartment();
  }
}
