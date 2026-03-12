import { Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { LoaderService } from '../../../../core/services/management-services/loader.service';
import { OnboardingService } from '../../Services/onboarding';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-view-apporval-inbox',
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './view-apporval-inbox.html',
  styleUrl: './view-apporval-inbox.scss',
})
export class ViewApporvalInbox {
  RequisitionList: any[] = [];
  totalItems: number = 0;
  totalPagesCount: number = 0;

  constructor(
    private toastr: ToastrService,
    private loader: LoaderService,
    private onBoardingSV: OnboardingService,
  ) {}

  currentPage = 1;
  itemsPerPage = 7;
  paginatedRequisitionList: any[] = [];

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
    this.loadRequisition();
  }
  loadRequisition() {
    this.loader.show();
    const backendPage = this.currentPage - 1;
    this.onBoardingSV.getAllJobRequisition(backendPage, this.itemsPerPage).subscribe({
      next: (response: any) => {
        this.loader.hide();
        console.log('Raw data sample:', response.data[0]);
        this.RequisitionList = response.data;
        console.log('Requisition list', this.RequisitionList);
        this.totalItems = response.paginator.totalItems;
        this.totalPagesCount = response.paginator.totalPages;
        this.currentPage = response.paginator.currentPage + 1;
        this.paginatedRequisitionList = this.RequisitionList;
      },
      error: (error) => {
        this.loader.hide();
        this.toastr.error('Error fetching Requisition list');
      },
    });
  }

  changePage(page: number) {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    this.loadRequisition();
  }
}
