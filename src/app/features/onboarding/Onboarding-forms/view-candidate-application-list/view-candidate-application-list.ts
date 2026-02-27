import { Component } from '@angular/core';
import { OnboardingService } from '../../Services/onboarding';
import { ToastrService } from 'ngx-toastr';
import { LoaderService } from '../../../../core/services/management-services/loader.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-view-candidate-application-list',
  imports: [CommonModule,FormsModule,RouterModule],
  templateUrl: './view-candidate-application-list.html',
  styleUrl: './view-candidate-application-list.scss',
})
export class ViewCandidateApplicationList {

  ProjectList: any[] = [];
  totalItems: number = 0;
  totalPagesCount: number = 0;

  constructor(
    private onboarding: OnboardingService,
    private toastr: ToastrService,
    private loader: LoaderService,
  ) {}

  currentPage = 1;
  itemsPerPage = 7;
  paginatedProjectList: any[] = [];

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
    debugger;
    this.loader.show();
    const backendPage = this.currentPage - 1;
    this.onboarding.getAllCandidateApplications(backendPage, this.itemsPerPage).subscribe({
      next: (response: any) => {
        this.loader.hide();
        console.log('Raw data sample:', response.data[0]);
        this.ProjectList = response.data;
        console.log('Application list', this.ProjectList);
        this.totalItems = response.paginator.totalItems;
        this.totalPagesCount = response.paginator.totalPages;
        this.currentPage = response.paginator.currentPage + 1;
        this.paginatedProjectList = this.ProjectList;
      },
      error: (error) => {
        this.loader.hide();
        this.toastr.error('Error fetching Applications list');
      },
    });
  }



  formatStatus(status: string): string {
  return status.replace(/_/g, ' ');
}

getStatusClass(status: string): string {
  switch (status) {
    case 'APPLIED':
      return 'badge-applied';

    case 'SHORTLISTED':
      return 'badge-shortlisted';

    case 'INTERVIEW_SCHEDULED':
    case 'INTERVIEWED':
      return 'badge-interview';

    case 'SELECTED':
    case 'HIRED':
      return 'badge-success';

    case 'FINAL_SCREENING':
      return 'badge-screening';

    case 'OFFER_MADE':
      return 'badge-offer';

    case 'REJECTED':
    case 'WITHDRAWN':
    case 'OFFER_EXPIRED':
      return 'badge-rejected';

    default:
      return 'badge-default';
  }
}


  
  changePage(page: number) {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    this.loadProject();
  }
}
