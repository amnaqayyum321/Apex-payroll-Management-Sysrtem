import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsService } from '../../Services/forms';
import { ToastrService } from 'ngx-toastr';
import { LoaderService } from '../../../../core/services/management-services/loader.service';

@Component({
  selector: 'app-view-belonging-types-list',
  imports: [CommonModule, FormsModule, RouterModule, NgbDropdownModule],
  templateUrl: './view-belonging-types-list.html',
  styleUrl: './view-belonging-types-list.scss',
})
export class ViewBelongingTypesList {

   EmployeeBelongingsList: any[] = [];
  totalItems: number = 0;
  totalPagesCount: number = 0;

  constructor(
    private formsService: FormsService,
    private toastr: ToastrService,
    private loader: LoaderService,
  ) {}

  currentPage = 1;
  itemsPerPage = 7;
  paginatedEmployeeBelongingsList: any[] = [];
  publicId: string | null = null;
  isEditMode = false;


  get totalPages() {
    return this.totalPagesCount || Math.ceil(this.totalItems / this.itemsPerPage);
  }

  get totalPagesArray() {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  ngOnInit() {
    this.loadEmployeeBelongings();
  }

  loadEmployeeBelongings() {
    this.loader.show();
    const backendPage = this.currentPage - 1;
    this.formsService.GetBelongingTypes(backendPage, this.itemsPerPage,  'ALL').subscribe({
      next: (response: any) => {
        this.loader.hide();
        this.EmployeeBelongingsList = response.data;
        console.log(this.EmployeeBelongingsList);
        this.totalItems = response.paginator.totalItems;
        this.totalPagesCount = response.paginator.totalPages;
        this.currentPage = response.paginator.currentPage + 1; // Backend 0-indexed
        this.paginatedEmployeeBelongingsList = this.EmployeeBelongingsList;
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
    this.loadEmployeeBelongings();
  }

  formatRoleName(role: string): string {
    if (!role) return '';

    return role
      .toLowerCase()
      .replace(/_/g, ' ')
      .replace(/\b\w/g, (c) => c.toUpperCase());
  }

}
