import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap'; // if using ng-bootstrap

import { LoaderService } from '../../../core/services/management-services/loader.service';
import { ToastrService } from 'ngx-toastr';
import { UsersAndRolesService } from '../Services/user-roles';

@Component({
  selector: 'app-approval-stages-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, NgbModule], // add NgbModule if using bootstrap modal
  templateUrl: './view-approval-stages.html',
  styleUrls: ['./view-approval-stages.scss']
})
export class ViewApprovalStages implements OnInit {
  @ViewChild('viewModal') viewModal!: TemplateRef<any>; // for modal content

  // Table data
  approvalStages: any[] = [];
  filteredDepartmentList: any[] = [];
  paginatedDepartmentList: any[] = [];
  searchTerm: string = '';
  statusFilter: string = '';
  filter = 'ALL';
    totalItems: number = 0;
  totalPagesCount: number = 0;
  currentPage = 1;
  itemsPerPage = 7;

  // Selected stage for modal view
  selectedStage: any = null;

  constructor(
    private loader: LoaderService,
    private formsService: UsersAndRolesService, // or your specific service
    private toastr: ToastrService,
    private modalService: NgbModal
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

  ngOnInit(): void {
    this.loadApprovalStages();
  }

  loadApprovalStages() {
    this.loader.show();
    const backendPage = this.currentPage - 1;
    this.formsService.getAllApprovalStages(backendPage, this.itemsPerPage).subscribe({
      next: (response: any) => {
        this.loader.hide();
        this.approvalStages = response.data;
        this.totalItems = response.paginator.totalItems;
        this.totalPagesCount = response.paginator.totalPages;
        this.currentPage = response.paginator.currentPage + 1;
        this.applyFilter();
      },
      error: () => {
        this.loader.hide();
        this.toastr.error('Error fetching departments list');
      },
    });
  }


  changePage(page: number) {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    this.loadApprovalStages();
  }

  onItemsPerPageChange() {
    this.currentPage = 1;
    this.loadApprovalStages();
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

    this.filteredDepartmentList = this.approvalStages.filter((item) => {
      const matchesSearch =
        !term || item.name?.toLowerCase().includes(term) || item.code?.toLowerCase().includes(term);

      const matchesStatus = this.statusFilter === '' || String(item.isActive) === this.statusFilter;

      return matchesSearch && matchesStatus;
    });

    this.updatePaginatedList();
  }

  updatePaginatedList() {
    if (this.isAnyFilterActive) {
      this.totalItems = this.filteredDepartmentList.length;
      const start = (this.currentPage - 1) * this.itemsPerPage;
      this.paginatedDepartmentList = this.filteredDepartmentList.slice(
        start,
        start + this.itemsPerPage,
      );
    } else {
      this.totalItems = this.totalPagesCount * this.itemsPerPage;
      this.paginatedDepartmentList = this.approvalStages;
    }
  }

  resetFilters() {
    this.searchTerm = '';
    this.statusFilter = '';
    this.currentPage = 1;
    this.applyFilter();
  }

  openViewModal(stage: any): void {
    this.selectedStage = stage;
    this.modalService.open(this.viewModal, { size: 'lg', centered: true });
  }
   formatRoleName(role: string): string {
    if (!role) return '';

    return role
      .toLowerCase()
      .replace(/_/g, ' ')
      .replace(/\b\w/g, (c) => c.toUpperCase());
  }
}