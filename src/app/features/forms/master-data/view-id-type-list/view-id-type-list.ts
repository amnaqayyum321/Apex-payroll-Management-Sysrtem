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
  IDTYPEList: any[] = [];
  totalItems: number = 0;
  totalPagesCount: number = 0;

  constructor(
    private FormSv: FormsService,
    private toastr: ToastrService,
    private loader: LoaderService,
  ) {}

  currentPage = 1;
  itemsPerPage = 7;
  paginatedIDTYPEList: any[] = [];

  get totalPages() {
    return this.totalPagesCount || Math.ceil(this.totalItems / this.itemsPerPage);
  }

  get totalPagesArray() {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }
  ngOnInit() {
    this.loadIDTYPE();
  }
  loadIDTYPE() {
    this.loader.show();
    const backendPage = this.currentPage - 1;
    this.FormSv.GetIDType(backendPage, this.itemsPerPage).subscribe({
      next: (response: any) => {
        this.loader.hide();
        console.log('Raw data sample:', response.data[0]);
        this.IDTYPEList = response.data;
        console.log('IDTYPE list', this.IDTYPEList);
        this.totalItems = response.paginator.totalItems;
        this.totalPagesCount = response.paginator.totalPages;
        this.currentPage = response.paginator.currentPage + 1;
        this.paginatedIDTYPEList = this.IDTYPEList;
      },
      error: (error) => {
        this.loader.hide();
        this.toastr.error('Error fetching ID TYPE list');
      },
    });
  }

  changePage(page: number) {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    this.loadIDTYPE();
  }
}
