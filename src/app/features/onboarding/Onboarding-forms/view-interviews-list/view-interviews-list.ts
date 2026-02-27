import { Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { LoaderService } from '../../../../core/services/management-services/loader.service';
import { OnboardingService } from '../../Services/onboarding';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-view-interviews-list',
  imports: [RouterModule, FormsModule, CommonModule],
  templateUrl: './view-interviews-list.html',
  styleUrl: './view-interviews-list.scss',
})
export class ViewInterviewsList {
  InterviewList: any[] = [];
  totalItems: number = 0;
  totalPagesCount: number = 0;
  expandedInterviewId: string | null = null;
  constructor(
    private toastr: ToastrService,
    private loader: LoaderService,
    private onBoardingSV: OnboardingService,
  ) {}

  currentPage = 1;
  itemsPerPage = 7;
  paginatedInterviewList: any[] = [];

  get totalPages() {
    return this.totalPagesCount || Math.ceil(this.totalItems / this.itemsPerPage);
  }

  get totalPagesArray() {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }
  ngOnInit() {
    this.loadRequisition();
  }
  toggleSessions(publicId: string) {
    this.expandedInterviewId = this.expandedInterviewId === publicId ? null : publicId;
  }
  loadRequisition() {
    this.loader.show();
    const backendPage = this.currentPage - 1;
    this.onBoardingSV.getAllInterviews(backendPage, this.itemsPerPage).subscribe({
      next: (response: any) => {
        this.loader.hide();
        console.log('Raw data sample:', response.data[0]);
        this.InterviewList = response.data;
        console.log('Requisition list', this.InterviewList);
        this.totalItems = response.paginator.totalItems;
        this.totalPagesCount = response.paginator.totalPages;
        this.currentPage = response.paginator.currentPage + 1;
        this.paginatedInterviewList = this.InterviewList;
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
