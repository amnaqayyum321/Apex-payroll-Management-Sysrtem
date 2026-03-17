import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsersAndRolesService } from '../Services/user-roles';
import { ToastrService } from 'ngx-toastr';
import { LoaderService } from '../../../core/services/management-services/loader.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-app-templat-status',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './app-templat-status.html',
  styleUrl: './app-templat-status.scss',
})
export class AppTemplatStatus implements OnInit {
  templateList: any[] = [];
  filteredList: any[] = [];
  currentPage = 0;
  pageSize = 100;
  selectedStatus = '';

  constructor(
    private UserSv: UsersAndRolesService,
    private toastr: ToastrService,
    private loader: LoaderService,
  ) {}

  ngOnInit() {
    this.getTemplates();
  }

  getTemplates() {
    this.loader.show();
    this.UserSv.getApprovaLTemplate(this.currentPage, this.pageSize).subscribe({
      next: (res: any) => {
        this.loader.hide();
        if (res.success) {
          this.templateList = res.data;
          this.applyFilter();
        }
      },
      error: () => {
        this.loader.hide();
        this.toastr.error('Failed to load templates');
      },
    });
  }

  applyFilter() {
    if (!this.selectedStatus) {
      this.filteredList = [...this.templateList];
    } else {
      this.filteredList = this.templateList.filter((t) => t.status === this.selectedStatus);
    }
  }

  resetFilter() {
    this.selectedStatus = '';
    this.applyFilter();
  }

  activateTemplate(publicId: string) {
    this.loader.show();
    this.UserSv.activateApprovalTemplate(publicId).subscribe({
      next: () => {
        this.loader.hide();
        this.toastr.success('Template activated successfully');
        this.getTemplates();
      },
      error: (err: any) => {
        this.loader.hide();
        this.toastr.error(err?.error?.message || 'Activation failed');
      },
    });
  }

  getStatusClass(status: string): string {
    if (status === 'ACTIVE') return 'active-badge';
    if (status === 'DRAFT') return 'draft-badge';
    return 'inactive-badge';
  }
}
