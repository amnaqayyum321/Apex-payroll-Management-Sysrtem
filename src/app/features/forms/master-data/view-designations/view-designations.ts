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
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  ngOnInit() {
    this.loadDesigantions();
  }

  loadDesigantions() {
    this.loader.show();
    const backendPage = this.currentPage - 1;
    this.formsService.getAllDesignations(backendPage, this.itemsPerPage).subscribe({
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

  deleteDesignation(publicId: string) {
    if (!confirm('Are you sure you want to delete this designation?')) return;

    this.loader.show();

    this.formsService.deleteDesignation(publicId).subscribe({
      next: () => {
        this.loader.hide();
        this.toastr.success('Designation deleted');
        this.loadDesigantions();
      },
      error: () => {
        this.loader.hide();
        this.toastr.error('Delete failed');
      },
    });
  }

  toggleActive(user: any) {
    this.loader.show();

    this.formsService.toggleDesignationActive(user.publicId, !user.isActive).subscribe({
      next: () => {
        this.loader.hide();
        this.toastr.success('Status updated');
        this.loadDesigantions();
      },
      error: () => {
        this.loader.hide();
        this.toastr.error('Failed to update status');
      },
    });
  }

  restoreDesignation(publicId: string) {
    this.loader.show();

    this.formsService.restoreDesignation(publicId).subscribe({
      next: () => {
        this.loader.hide();
        this.toastr.success('Designation restored');
        this.loadDesigantions();
      },
      error: () => {
        this.loader.hide();
        this.toastr.error('Restore failed');
      },
    });
  }
}
