import { Component } from '@angular/core';
import { FormsService } from '../../Services/forms';
import { ToastrService } from 'ngx-toastr';
import { LoaderService } from '../../../../core/services/management-services/loader.service';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-view-leave-application',
  imports: [RouterModule, CommonModule, FormsModule],
  templateUrl: './view-leave-application.html',
  styleUrl: './view-leave-application.scss',
})
export class ViewLeaveApplication {
  LeavesApplicationList: any[] = [];
  totalItems: number = 0;
  totalPagesCount: number = 0;

  constructor(
    private formsService: FormsService,
    private toastr: ToastrService,
    private loader: LoaderService,
  ) {}

  currentPage = 1;
  itemsPerPage = 7;
  paginatedLeavesApplicationList: any[] = [];
  publicId: string | null = null;
  isEditMode = false;

  get totalPages() {
    return this.totalPagesCount || Math.ceil(this.totalItems / this.itemsPerPage);
  }

  get totalPagesArray() {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  ngOnInit() {
    this.loadLeaves();
  }

  loadLeaves() {
    this.loader.show();
    const backendPage = this.currentPage - 1;
    this.formsService.GetLeaveApplication(backendPage, this.itemsPerPage, 'ALL').subscribe({
      next: (response: any) => {
        this.loader.hide();
        this.LeavesApplicationList = response.data;
        console.log(this.LeavesApplicationList);
        this.totalItems = response.paginator.totalItems;
        this.totalPagesCount = response.paginator.totalPages;
        this.currentPage = response.paginator.currentPage + 1; // Backend 0-indexed
        this.paginatedLeavesApplicationList = this.LeavesApplicationList;
      },
      error: (error) => {
        this.loader.hide();
        this.toastr.error('Error fetching leaves Application list');
      },
    });
  }

  changePage(page: number) {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    this.loadLeaves();
  }

  formatRoleName(role: string): string {
    if (!role) return '';

    return role
      .toLowerCase()
      .replace(/_/g, ' ')
      .replace(/\b\w/g, (c) => c.toUpperCase());
  }
}
