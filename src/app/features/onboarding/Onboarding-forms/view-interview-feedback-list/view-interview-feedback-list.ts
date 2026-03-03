import { Component, OnInit } from '@angular/core';
import { OnboardingService } from '../../Services/onboarding';
import { ToastrService } from 'ngx-toastr';
import { LoaderService } from '../../../../core/services/management-services/loader.service';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';

@Component({
  selector: 'app-view-interview-feedback-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './view-interview-feedback-list.html',
})
export class ViewInterviewFeedbackList implements OnInit {
  InterviewFeedbackList: any[] = [];
  sessionPublicId: string = '';

  currentPage = 1;
  itemsPerPage = 7;
  totalItems = 0;
  totalPagesCount = 0;

  constructor(
    private onboarding: OnboardingService,
    private toastr: ToastrService,
    private loader: LoaderService,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.sessionPublicId = params.get('sessionPublicId') || '';
      if (this.sessionPublicId) {
        this.loadInterviewFeedback();
      }
    });
  }

  loadInterviewFeedback() {
    this.loader.show();

    this.onboarding.getAllFeedbackBySession(this.sessionPublicId).subscribe({
      next: (res: any) => {
        this.loader.hide();

        this.InterviewFeedbackList = res.data || [];
        this.totalItems = res.paginator?.totalItems || 0;
        this.totalPagesCount = res.paginator?.totalPages || 1;
        this.currentPage = (res.paginator?.currentPage || 0) + 1;
      },
      error: () => {
        this.loader.hide();
        this.toastr.error('Error fetching feedback list');
      },
    });
  }

  get totalPages() {
    return this.totalPagesCount;
  }

  get totalPagesArray() {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  changePage(page: number) {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    this.loadInterviewFeedback();
  }
}
