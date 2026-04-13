import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { LoaderService } from '../../../../core/services/management-services/loader.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-master-table',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './master-table.html',
  styleUrls: ['./master-table.scss'],
})
export class MasterTable implements OnInit {
  @Input() title: string = 'Table';
  @Input() columns: Array<{ key: string; label: string }> = [];
  @Input() fetchService: any; // function that returns observable
  @Input() routeBase: string = ''; // base route for edit
  @Input() extraColumns: Array<string> = []; // optional extra fields
  @Input() transformFn: Function = (x: any) => x; // optional transformation before rendering

  data: any[] = [];
  filteredData: any[] = [];
  paginatedData: any[] = [];

  searchTerm: string = '';
  statusFilter: string = '';
  itemsPerPage: number = 6;
  currentPage: number = 1;
  totalItems: number = 0;
   Math = Math; // <

  constructor(private loader: LoaderService, private toastr: ToastrService) {}

  ngOnInit() {
    this.loadData();
  }

  get isAnyFilterActive() {
    return !!this.searchTerm || !!this.statusFilter;
  }

  get totalPages() {
    return Math.ceil(this.totalItems / this.itemsPerPage);
  }

  get totalPagesArray() {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

loadData() {
  this.loader.show();
  this.fetchService(this.currentPage - 1, this.itemsPerPage).subscribe({
    next: (res: any) => {
      this.loader.hide();

      this.data = res.data.map(this.transformFn);
      this.paginatedData = this.data; // direct use
      this.totalItems = res.paginator?.totalItems || 0;
    },
    error: () => {
      this.loader.hide();
      this.toastr.error(`Failed to load ${this.title}`);
    },
  });
}

  applyFilter() {
    const term = this.searchTerm.toLowerCase().trim();
    this.filteredData = this.data.filter((item) => {
      const matchesSearch =
        !term || this.columns.some((col) => String(item[col.key]).toLowerCase().includes(term));
      const matchesStatus = !this.statusFilter || String(item.isActive) === this.statusFilter;
      return matchesSearch && matchesStatus;
    });
    this.updatePaginatedList();
  }

  updatePaginatedList() {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    this.paginatedData = this.filteredData.slice(start, start + this.itemsPerPage);
  }

  onSearch() {
    this.currentPage = 1;
    this.applyFilter();
  }

  onStatusChange() {
    this.currentPage = 1;
    this.applyFilter();
  }

changePage(page: number) {
  if (page < 1 || page > this.totalPages) return;

  this.currentPage = page;
  this.loadData();
}

onItemsPerPageChange() {
  this.currentPage = 1;
  this.loadData(); // IMPORTANT
}

  resetFilters() {
    this.searchTerm = '';
    this.statusFilter = '';
    this.currentPage = 1;
     this.itemsPerPage = 6;   
    this.applyFilter();
  }

  
}