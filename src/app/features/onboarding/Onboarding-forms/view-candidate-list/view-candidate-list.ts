import { Component } from '@angular/core';
import { FormsService } from '../../../forms/Services/forms';
import { ToastrService } from 'ngx-toastr';
import { LoaderService } from '../../../../core/services/management-services/loader.service';
import { OnboardingService } from '../../Services/onboarding';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-view-candidate-list',
  imports: [RouterModule, CommonModule, FormsModule],
  templateUrl: './view-candidate-list.html',
  styleUrl: './view-candidate-list.scss',
})
export class ViewCandidateList {
  CandidateList: any[] = [];
  totalItems: number = 0;
  totalPagesCount: number = 0;

  constructor(
    private OnboardingSv: OnboardingService,
    private toastr: ToastrService,
    private loader: LoaderService,
  ) {}

  currentPage = 1;
  itemsPerPage = 7;
  paginatedCandidateList: any[] = [];

  get totalPages() {
    return this.totalPagesCount || Math.ceil(this.totalItems / this.itemsPerPage);
  }

  get totalPagesArray() {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }
  ngOnInit() {
    this.loadAllCandidate();
  }
  loadAllCandidate() {
    this.loader.show();
    const backendPage = this.currentPage - 1;
    this.OnboardingSv.getAllCandidate(backendPage, this.itemsPerPage).subscribe({
      next: (response: any) => {
        this.loader.hide();
        this.CandidateList = response.data;
        console.log('Candidate list', this.CandidateList);
        this.totalItems = response.paginator.totalItems;
        this.totalPagesCount = response.paginator.totalPages;
        this.currentPage = response.paginator.currentPage + 1; // Backend 0-indexed
        this.paginatedCandidateList = this.CandidateList;
      },
      error: (error) => {
        this.loader.hide();
        this.toastr.error('Error fetching users list');
      },
    });
  }

  changePage(page: number) {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    this.loadAllCandidate();
  }
}
