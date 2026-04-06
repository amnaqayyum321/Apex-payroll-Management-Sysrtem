import { Component, OnInit } from '@angular/core';
import { OnboardingService } from '../../Services/onboarding';
import { ToastrService } from 'ngx-toastr';
import { LoaderService } from '../../../../core/services/management-services/loader.service';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-view-interview-feedback-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './view-interview-feedback-list.html',
  styleUrls: ['./view-interview-feedback-list.scss']
})
export class ViewInterviewFeedbackList implements OnInit {
  InterviewFeedbackList: any[] = [];
  filteredInterviewList: any[] = [];
  paginatedInterviewList: any[] = [];
  sessionPublicId: string = '';

  currentPage = 1;
  itemsPerPage = 7;
  totalItems = 0;
  totalPagesCount = 0;

  searchTerm: string = '';
  scoreRangeFilter: string = '';

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

  get totalPages() {
    return this.totalPagesCount || Math.ceil(this.totalItems / this.itemsPerPage);
  }

  get totalPagesArray() {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  get firstItem(): number {
    return this.totalItems === 0 ? 0 : (this.currentPage - 1) * this.itemsPerPage + 1;
  }

  get lastItem(): number {
    return Math.min(this.currentPage * this.itemsPerPage, this.totalItems);
  }

  get isAnyFilterActive(): boolean {
    return !!this.searchTerm || !!this.scoreRangeFilter;
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

        this.applyFilter();
      },
      error: () => {
        this.loader.hide();
        this.toastr.error('Error fetching feedback list');
      },
    });
  }

  changePage(page: number) {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    
    if (this.isAnyFilterActive) {
      this.updatePaginatedList();
    } else {
      this.loadInterviewFeedback();
    }
  }

  onItemsPerPageChange() {
    this.currentPage = 1;
    if (this.isAnyFilterActive) {
      this.updatePaginatedList();
    } else {
      this.loadInterviewFeedback();
    }
  }

  onSearch() {
    this.currentPage = 1;
    this.applyFilter();
  }

  onScoreRangeFilterChange() {
    this.currentPage = 1;
    this.applyFilter();
  }

  applyFilter() {
    const term = this.searchTerm.toLowerCase().trim();

    this.filteredInterviewList = this.InterviewFeedbackList.filter((item) => {
      const matchesSearch =
        !term ||
        item.panelMemberName?.toLowerCase().includes(term) ||
        item.remarks?.toLowerCase().includes(term);

      let matchesScoreRange = true;
      if (this.scoreRangeFilter) {
        const minScore = parseInt(this.scoreRangeFilter, 10);
        matchesScoreRange = item.score > minScore;
      }

      return matchesSearch && matchesScoreRange;
    });

    this.updatePaginatedList();
  }

  updatePaginatedList() {
    if (this.isAnyFilterActive) {
      this.totalItems = this.filteredInterviewList.length;
      const start = (this.currentPage - 1) * this.itemsPerPage;
      this.paginatedInterviewList = this.filteredInterviewList.slice(
        start,
        start + this.itemsPerPage,
      );
    } else {
      this.totalItems = this.InterviewFeedbackList.length;
      const start = (this.currentPage - 1) * this.itemsPerPage;
      this.paginatedInterviewList = this.InterviewFeedbackList.slice(
        start,
        start + this.itemsPerPage,
      );
    }
  }

  resetFilters() {
    this.searchTerm = '';
    this.scoreRangeFilter = '';
    this.currentPage = 1;
    this.applyFilter();
  }

  getScoreClass(score: number): string {
    if (score >= 70) return 'excellent-score';
    if (score >= 50) return 'good-score';
    if (score >= 30) return 'average-score';
    if (score >= 10) return 'low-score';
    return 'very-low-score';
  }
}