import { Component } from '@angular/core';
import { FormsService } from '../../Services/forms';
import { ToastrService } from 'ngx-toastr';
import { LoaderService } from '../../../../core/services/management-services/loader.service';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-view-id-type-list',
  imports: [RouterModule, FormsModule, CommonModule],
  templateUrl: './view-id-type-list.html',
  styleUrl: './view-id-type-list.scss',
})
export class ViewIDTypeList {
  fullDepartmentList: any[] = [];        
  filteredDepartmentList: any[] = [];    
  paginatedDepartmentList: any[] = [];   

  searchTerm: string = '';
  currentPage = 1;
  itemsPerPage = 6;                       // default

  totalItems: number = 0;
  totalPagesCount: number = 0;

  constructor(
    private FormSv: FormsService,
    private toastr: ToastrService,
    private loader: LoaderService,
  ) {}

  ngOnInit() {
    this.loadAllDepartments();
  }

  // Fetch all departments (using a high page size, e.g. 1000)
  loadAllDepartments() {
    this.loader.show();
    // Request first page with a large size – adjust if your API has a lower limit
    this.FormSv.GetIDType(0, 1000).subscribe({
      next: (response: any) => {
        this.fullDepartmentList = response.data;
        // If totalItems > 1000, you might need additional calls – here we assume 1000 is enough
        this.applyFilter();               // initial filter & pagination
        this.loader.hide();
      },
      error: (error) => {
        this.loader.hide();
        this.toastr.error('Error fetching departments list');
      },
    });
  }

  // Filter based on search term (code or name)
  applyFilter() {
    const term = this.searchTerm.toLowerCase().trim();
    if (!term) {
      this.filteredDepartmentList = [...this.fullDepartmentList];
    } else {
      this.filteredDepartmentList = this.fullDepartmentList.filter(
        (dep) =>
          dep.code?.toLowerCase().includes(term) ||
          dep.name?.toLowerCase().includes(term)
      );
    }
    this.totalItems = this.filteredDepartmentList.length;
    this.totalPagesCount = Math.ceil(this.totalItems / this.itemsPerPage);
    this.currentPage = 1;                  // reset to first page on filter change
    this.updatePaginatedList();
  }

  // Recalculate current page slice
  updatePaginatedList() {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    this.paginatedDepartmentList = this.filteredDepartmentList.slice(start, end);
  }

  // Called when search input changes
  onSearch() {
    this.applyFilter();
  }

  // Called when items per page dropdown changes
  onItemsPerPageChange() {
    this.totalPagesCount = Math.ceil(this.totalItems / this.itemsPerPage);
    this.currentPage = 1;
    this.updatePaginatedList();
  }

  // Change page (next/previous or direct click)
  changePage(page: number) {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    this.updatePaginatedList();
  }

  get firstItem(): number {
  return this.totalItems > 0 ? (this.currentPage - 1) * this.itemsPerPage + 1 : 0;
}

get lastItem(): number {
  return this.totalItems > 0
    ? Math.min(this.currentPage * this.itemsPerPage, this.totalItems)
    : 0;
}

  // Total pages (readonly)
  get totalPages() {
    return this.totalPagesCount || 1;
  }

  // Generate page numbers array (shows a reasonable range)
  get totalPagesArray(): number[] {
    const pages: number[] = [];
    const maxVisible = 5;                     // show up to 5 pages
    const half = Math.floor(maxVisible / 2);

    let start = Math.max(1, this.currentPage - half);
    let end = Math.min(this.totalPages, start + maxVisible - 1);

    // Adjust if we are near the end
    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1);
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  }
  
}