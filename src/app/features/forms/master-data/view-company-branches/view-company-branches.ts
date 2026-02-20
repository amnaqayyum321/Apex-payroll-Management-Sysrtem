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
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  ngOnInit() {
    this.loadCompanyBranches();
  }

  loadCompanyBranches() {
    this.loader.show();
    const backendPage = this.currentPage - 1;
    this.formsService.getAllComapnyBranches(backendPage, this.itemsPerPage).subscribe({
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
    this.loadCompanyBranches();
  }

  formatRoleName(role: string): string {
    if (!role) return '';

    return role
      .toLowerCase()
      .replace(/_/g, ' ')
      .replace(/\b\w/g, (c) => c.toUpperCase());
  }

 
  toggleActive(user: any) {
    this.loader.show();

    this.formsService.toggleDesignationActive(user.publicId, !user.isActive).subscribe({
      next: () => {
        this.loader.hide();
        this.toastr.success('Status updated');
        this.loadCompanyBranches();
      },
      error: () => {
        this.loader.hide();
        this.toastr.error('Failed to update status');
      },
    });
  }

  

}
