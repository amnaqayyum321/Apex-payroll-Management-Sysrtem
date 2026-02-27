import { Component } from '@angular/core';
import { FormsService } from '../../../forms/Services/forms';
import { ToastrService } from 'ngx-toastr';
import { LoaderService } from '../../../../core/services/management-services/loader.service';
import { OnboardingService } from '../../Services/onboarding';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-view-req-list',
  imports: [FormsModule, CommonModule, RouterModule],
  templateUrl: './view-req-list.html',
  styleUrl: './view-req-list.scss',
})
export class ViewReqList {
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
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
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
