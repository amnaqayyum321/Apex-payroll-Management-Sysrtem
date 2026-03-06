import { Component } from '@angular/core';
import { FormsService } from '../../Services/forms';
import { LoaderService } from '../../../../core/services/management-services/loader.service';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-view-work-schedule',
  imports: [CommonModule, FormsModule, RouterModule, NgbDropdownModule],
  templateUrl: './view-work-schedule.html',
  styleUrl: './view-work-schedule.scss',
})
export class ViewWorkSchedule {
  WorkScheduleList: any[] = [];
  totalItems: number = 0;
  totalPagesCount: number = 0;

  constructor(
    private formsService: FormsService,
    private toastr: ToastrService,
    private loader: LoaderService,
  ) {}

  currentPage = 1;
  itemsPerPage = 7;
  paginatedWorkScheduleList: any[] = [];
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
    this.formsService.getAllWorkSchedules(backendPage, this.itemsPerPage, 'ALL').subscribe({
      next: (response: any) => {
        this.loader.hide();
        this.WorkScheduleList = response.data;
        console.log(this.WorkScheduleList);
        this.totalItems = response.paginator.totalItems;
        this.totalPagesCount = response.paginator.totalPages;
        this.currentPage = response.paginator.currentPage + 1; // Backend 0-indexed
        this.paginatedWorkScheduleList = this.WorkScheduleList;
      },
      error: (error) => {
        this.loader.hide();
        this.toastr.error('Error fetching work schedule list');
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
