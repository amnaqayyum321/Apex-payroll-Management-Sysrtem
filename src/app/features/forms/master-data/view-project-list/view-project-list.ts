import { Component } from '@angular/core';
import { FormsService } from '../../Services/forms';
import { ToastrService } from 'ngx-toastr';
import { LoaderService } from '../../../../core/services/management-services/loader.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-view-project-list',
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './view-project-list.html',
  styleUrl: './view-project-list.scss',
})
export class ViewProjectList {
     ProjectsList: any[] = [];
  filteredProjectsList: any[] = [];
  paginatedProjectsList: any[] = [];

  totalItems: number = 0;
  totalPagesCount: number = 0;
  currentPage = 1;
  itemsPerPage = 7;

  searchTerm: string = '';
  statusFilter: string = '';

  constructor(
    private FormSv: FormsService,
    private toastr: ToastrService,
    private loader: LoaderService,
  ) {}

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
    return !!this.searchTerm || !!this.statusFilter;
  }

  ngOnInit() {
    this.loadProjects();
  }

  loadProjects() {
    this.loader.show();
    const backendPage = this.currentPage - 1;
    this.FormSv.GetProject(backendPage, this.itemsPerPage).subscribe({
      next: (response: any) => {
        this.loader.hide();
        this.ProjectsList = response.data;
        this.totalItems = response.paginator.totalItems;
        this.totalPagesCount = response.paginator.totalPages;
        this.currentPage = response.paginator.currentPage + 1;
        this.applyFilter();
      },
      error: () => {
        this.loader.hide();
        this.toastr.error('Error fetching projects list');
      },
    });
  }

  changePage(page: number) {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    this.loadProjects();
  }

  onItemsPerPageChange() {
    this.currentPage = 1;
    this.loadProjects();
  }

  onSearch() {
    this.currentPage = 1;
    this.applyFilter();
  }

  onStatusChange() {
    this.currentPage = 1;
    this.applyFilter();
  }

  applyFilter() {
    const term = this.searchTerm.toLowerCase().trim();

    this.filteredProjectsList = this.ProjectsList.filter((item) => {
      const matchesSearch =
        !term || item.name?.toLowerCase().includes(term) || item.code?.toLowerCase().includes(term);

      const matchesStatus = this.statusFilter === '' || String(item.isActive) === this.statusFilter;

      return matchesSearch && matchesStatus;
    });

    this.updatePaginatedList();
  }

  updatePaginatedList() {
    if (this.isAnyFilterActive) {
      this.totalItems = this.filteredProjectsList.length;
      const start = (this.currentPage - 1) * this.itemsPerPage;
      this.paginatedProjectsList = this.filteredProjectsList.slice(
        start,
        start + this.itemsPerPage,
      );
    } else {
      this.totalItems = this.totalPagesCount * this.itemsPerPage;
      this.paginatedProjectsList = this.ProjectsList;
    }
  }

  resetFilters() {
    this.searchTerm = '';
    this.statusFilter = '';
    this.currentPage = 1;
    this.applyFilter();
  }
}
