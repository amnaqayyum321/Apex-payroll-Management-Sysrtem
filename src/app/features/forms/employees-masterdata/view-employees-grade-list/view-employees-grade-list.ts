import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsService } from '../../Services/forms';
import { ToastrService } from 'ngx-toastr';
import { LoaderService } from '../../../../core/services/management-services/loader.service';

@Component({
  selector: 'app-view-employees-grade-list',
  imports: [CommonModule, RouterModule, NgbDropdownModule,  RouterModule],
  templateUrl: './view-employees-grade-list.html',
  styleUrl: './view-employees-grade-list.scss',
})
export class ViewEmployeesGradeList {
   EmployeesGradeList: any[] = [];
  totalItems: number = 0;
  totalPagesCount: number = 0;

  constructor(
    private formsService: FormsService,
    private toastr: ToastrService,
    private loader: LoaderService,
  ) {}

  currentPage = 1;
  itemsPerPage = 7;
  paginatedEmployeesGradeList: any[] = [];
  publicId: string | null = null;
  isEditMode = false;


  get totalPages() {
    return this.totalPagesCount || Math.ceil(this.totalItems / this.itemsPerPage);
  }

  get totalPagesArray() {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  ngOnInit() {
    this.loadDesigantions();
  }

  loadDesigantions() {
    this.loader.show();
    const backendPage = this.currentPage - 1;
    this.formsService.GetEmployeeGrade(backendPage, this.itemsPerPage,  'ALL').subscribe({
      next: (response: any) => {
        this.loader.hide();
        this.EmployeesGradeList = response.data;
        console.log(this.EmployeesGradeList);
        this.totalItems = response.paginator.totalItems;
        this.totalPagesCount = response.paginator.totalPages;
        this.currentPage = response.paginator.currentPage + 1; // Backend 0-indexed
        this.paginatedEmployeesGradeList = this.EmployeesGradeList;
      },
      error: (error) => {
        this.loader.hide();
        this.toastr.error('Error fetching designations list');
      },
    });
  }

  changePage(page: number) {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    this.loadDesigantions();
  }

  formatRoleName(role: string): string {
    if (!role) return '';

    return role
      .toLowerCase()
      .replace(/_/g, ' ')
      .replace(/\b\w/g, (c) => c.toUpperCase());
  }


}
