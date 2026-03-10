import { Component } from '@angular/core';
import { FormsService } from '../../Services/forms';
import { ToastrService } from 'ngx-toastr';
import { LoaderService } from '../../../../core/services/management-services/loader.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-view-company-branches',
  imports: [CommonModule, FormsModule, RouterModule, NgbDropdownModule],


  templateUrl: './view-company-branches.html',
  styleUrl: './view-company-branches.scss',
})
export class ViewCompanyBranches {

  CompanyBranchesList: any[] = [];
  totalItems: number = 0;
  totalPagesCount: number = 0;

  constructor(
    private formsService: FormsService,
    private toastr: ToastrService,
    private loader: LoaderService,
  ) {}

  currentPage = 1;
  itemsPerPage = 7;
  paginatedCompanyBranchesList: any[] = [];
  publicId: string | null = null;
  isEditMode = false;


  get totalPages() {
    return this.totalPagesCount || Math.ceil(this.totalItems / this.itemsPerPage);
  }

 get totalPagesArray() {
  const pages: number[] = [];

  let start = this.currentPage;
  let end = Math.min(this.currentPage + 1, this.totalPages);

  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  return pages;
}

  ngOnInit() {
    this.loadDesigantions();
  }

  loadDesigantions() {
    this.loader.show();
    const backendPage = this.currentPage - 1;
    this.formsService.getAllComapnyBranches(backendPage, this.itemsPerPage,  'ALL').subscribe({
      next: (response: any) => {
        this.loader.hide();
        this.CompanyBranchesList = response.data;
        console.log(this.CompanyBranchesList);
        this.totalItems = response.paginator.totalItems;
        this.totalPagesCount = response.paginator.totalPages;
        this.currentPage = response.paginator.currentPage + 1; // Backend 0-indexed
        this.paginatedCompanyBranchesList = this.CompanyBranchesList;
      },
      error: (error) => {
        this.loader.hide();
        this.toastr.error('Error fetching company branches list');
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
