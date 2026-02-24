import { Component } from '@angular/core';
import { FormsService } from '../../Services/forms';
import { ToastrService } from 'ngx-toastr';
import { LoaderService } from '../../../../core/services/management-services/loader.service';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-view-job-title-list',
  imports: [RouterModule, CommonModule, FormsModule],
  templateUrl: './view-job-title-list.html',
  styleUrl: './view-job-title-list.scss',
})
export class ViewJobTitleList {
   JobTitleList: any[] = [];
  totalItems: number = 0;
  totalPagesCount: number = 0;

  constructor(
    private formsService: FormsService,
    private toastr: ToastrService,
    private loader: LoaderService,
  ) {}

  currentPage = 1;
  itemsPerPage = 7;
  paginatedJobTitleList: any[] = [];
  publicId: string | null = null;
  isEditMode = false;


  get totalPages() {
    return this.totalPagesCount || Math.ceil(this.totalItems / this.itemsPerPage);
  }

  get totalPagesArray() {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  ngOnInit() {
    this.loadJobTitle();
  }

  loadJobTitle() {
    this.loader.show();
    const backendPage = this.currentPage - 1;
    this.formsService.GetJobTitle(backendPage, this.itemsPerPage,  'ALL').subscribe({
      next: (response: any) => {
        this.loader.hide();
        this.JobTitleList = response.data;
        console.log(this.JobTitleList);
        this.totalItems = response.paginator.totalItems;
        this.totalPagesCount = response.paginator.totalPages;
        this.currentPage = response.paginator.currentPage + 1; // Backend 0-indexed
        this.paginatedJobTitleList = this.JobTitleList;
      },
      error: (error) => {
        this.loader.hide();
        this.toastr.error('Error fetching Job Title list');
      },
    });
  }

  changePage(page: number) {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    this.loadJobTitle();
  }

  formatRoleName(role: string): string {
    if (!role) return '';

    return role
      .toLowerCase()
      .replace(/_/g, ' ')
      .replace(/\b\w/g, (c) => c.toUpperCase());
  }


}
