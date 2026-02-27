import { Component } from '@angular/core';
import { OnboardingService } from '../../Services/onboarding';
import { ToastrService } from 'ngx-toastr';
import { LoaderService } from '../../../../core/services/management-services/loader.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-view-offers-list',
  imports: [CommonModule,FormsModule,RouterModule],
  templateUrl: './view-offers-list.html',
  styleUrl: './view-offers-list.scss',
})
export class ViewOffersList {


   ProjectList: any[] = [];
  totalItems: number = 0;
  totalPagesCount: number = 0;

  constructor(
    private Onboarding: OnboardingService,
    private toastr: ToastrService,
    private loader: LoaderService,

  ) {}

  currentPage = 1;
  itemsPerPage = 7;
  paginatedProjectList: any[] = [];
  selectedStatus: string = 'ALL';

  get totalPages() {
    return this.totalPagesCount || Math.ceil(this.totalItems / this.itemsPerPage);
  }

  get totalPagesArray() {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }
  ngOnInit() {
    this.loadProject();
  }
 loadProject() {
  this.loader.show();
  const backendPage = this.currentPage - 1;

  // 👇 ALL ko backend ko mat bhejna
  const statusToSend =
    this.selectedStatus === 'ALL' ? undefined : this.selectedStatus;

  this.Onboarding
    .getAllOffer(backendPage, this.itemsPerPage, statusToSend)
    .subscribe({
      next: (response: any) => {
        this.loader.hide();

        console.log('Full Response:', response);

        // 👇 Safe data extraction
        this.ProjectList =
          response?.data?.content ||
          response?.data ||
          [];

        this.totalItems =
          response?.paginator?.totalItems || 0;

        this.totalPagesCount =
          response?.paginator?.totalPages || 0;

        this.currentPage =
          (response?.paginator?.currentPage || 0) + 1;

        this.paginatedProjectList = this.ProjectList;
      },
      error: (error) => {
        this.loader.hide();
        console.error(error);
        this.toastr.error('Error fetching Offers list');
      },
    });
}

  changePage(page: number) {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    this.loadProject();
  }

}
