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
  totalItems: number = 0;
  totalPagesCount: number = 0;

  constructor(
    private FormSv: FormsService,
    private toastr: ToastrService,
    private loader: LoaderService,
  ) {}

  currentPage = 1;
  itemsPerPage = 7;
  paginatedEmployeeCategoryList: any[] = [];

  get totalPages() {
    return this.totalPagesCount || Math.ceil(this.totalItems / this.itemsPerPage);
  }

  get totalPagesArray() {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
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
        console.log('Raw data sample:', response.data[0]);
        this.EmployeeCategoryList = response.data;
        console.log('Employee Category list', this.EmployeeCategoryList);
        this.totalItems = response.paginator.totalItems;
        this.totalPagesCount = response.paginator.totalPages;
        this.currentPage = response.paginator.currentPage + 1;
        this.paginatedEmployeeCategoryList = this.EmployeeCategoryList;
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
    this.loadEmployeeCategory();
  }
}
