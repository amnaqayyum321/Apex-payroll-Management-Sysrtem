import { Component } from '@angular/core';
import { OnboardingService } from '../../Services/onboarding';
import { ToastrService } from 'ngx-toastr';
import { LoaderService } from '../../../../core/services/management-services/loader.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-view-interview-pannel-list',
  imports: [CommonModule,FormsModule,RouterModule],
  templateUrl: './view-interview-pannel-list.html',
  styleUrl: './view-interview-pannel-list.scss',
})
export class ViewInterviewPannelList {


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
    this.Onboarding.getAllInterviewPanel(backendPage, this.itemsPerPage).subscribe({
      next: (response: any) => {
        this.loader.hide();
        console.log('Raw data sample:', response.data[0]);
        this.ProjectList = response.data;
        console.log('Project list', this.ProjectList);
        this.totalItems = response.paginator.totalItems;
        this.totalPagesCount = response.paginator.totalPages;
        this.currentPage = response.paginator.currentPage + 1;
        this.paginatedProjectList = this.ProjectList;
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
    this.loadProject();
  }
}
