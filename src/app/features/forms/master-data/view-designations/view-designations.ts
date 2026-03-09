import { Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { FormsService } from '../../Services/forms';
import { LoaderService } from '../../../../core/services/management-services/loader.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-view-designations',
  imports: [CommonModule, FormsModule, RouterModule, NgbDropdownModule],
  templateUrl: './view-designations.html',
  styleUrl: './view-designations.scss',
})
export class ViewDesignations {
  DesignationsList: any[] = [];
  totalItems: number = 0;
  totalPagesCount: number = 0;

  constructor(
    private formsService: FormsService,
    private toastr: ToastrService,
    private loader: LoaderService,
  ) {}

  currentPage = 1;
  itemsPerPage = 7;
  paginatedDesigationList: any[] = [];
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
    this.formsService.getAllDesignations(backendPage, this.itemsPerPage,  'ALL').subscribe({
      next: (response: any) => {
        this.loader.hide();
        this.DesignationsList = response.data;
        console.log(this.DesignationsList);
        this.totalItems = response.paginator.totalItems;
        this.totalPagesCount = response.paginator.totalPages;
        this.currentPage = response.paginator.currentPage + 1; // Backend 0-indexed
        this.paginatedDesigationList = this.DesignationsList;
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
