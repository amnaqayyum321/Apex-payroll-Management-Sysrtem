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
  showModal = false;
  selectedTemplate: any = null;
  selectedResolutionMode = 'ACTIVE';
  dryRun = false;

  resolutionModes = [
    {
      value: 'ACTIVE',
      label: 'Activate Only',
      description: 'Simply activate this template',
    },
    {
      value: 'DEACTIVATE_CONFLICTING',
      label: 'Deactivate Conflicting',
      description: 'Deactivate all conflicting templates automatically',
    },
    {
      value: 'REMOVE_OVERLAP_FROM_NEW',
      label: 'Remove Overlap from New',
      description: 'Remove overlapping stages from this new template',
    },
  ];

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
        console.log('All Template', res);
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
  deactivateTemplate(publicId: string) {
    this.loader.show();
    this.UserSv.ApprovalTempDeactivate(publicId).subscribe({
      next: (res: any) => {
        this.loader.hide();
        this.toastr.success('Template deactivated successfully');
        this.getTemplates();
      },
      error: (err: any) => {
        this.loader.hide();
        this.toastr.error(err?.error?.message || 'Deactivation failed');
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
  openActivateModal(template: any) {
    this.selectedTemplate = template;
    this.selectedResolutionMode = 'ACTIVE';
    this.dryRun = false;
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
    this.selectedTemplate = null;
  }
  confirmActivation() {
    if (!this.selectedTemplate) return;
    const publicId = this.selectedTemplate.publicId;
    if (this.selectedResolutionMode === 'ACTIVE') {
      this.loader.show();
      this.UserSv.activateApprovalTemplate(publicId).subscribe({
        next: (res: any) => {
          console.log('✅ activateApprovalTemplate SUCCESS:', res);
          this.loader.hide();
          this.toastr.success('Template activated successfully');
          this.closeModal();
          this.getTemplates();
        },
        error: (err: any) => {
          this.loader.hide();
          this.toastr.error(err?.error?.message || 'Activation failed');
        },
      });
    } else {
      const payload = {
        resolutionMode: this.selectedResolutionMode,
        dryRun: this.dryRun,
      };
      this.loader.show();
      this.UserSv.activateSafeApprovalTemplate(publicId, payload).subscribe({
        next: (res: any) => {
          this.loader.hide();
          this.toastr.success(`Template activated with mode: ${this.selectedResolutionMode}`);
          this.closeModal();
          this.getTemplates();
        },
        error: (err: any) => {
          this.loader.hide();
          this.toastr.error(err?.error?.message || 'Activation failed');
        },
      });
    }
  }
  getStatusClass(status: string): string {
    if (status === 'ACTIVE') return 'active-badge';
    if (status === 'DRAFT') return 'draft-badge';
    return 'inactive-badge';
  }

  toggleStatus(template: any) {
  const isActive = template.status === 'ACTIVE';
  if (isActive) {
    this.deactivateTemplate(template.publicId);
  } else {
    this.openActivateModal(template); // if you want modal for activation
    // OR directly activate:
    // this.UserSv.activateApprovalTemplate(template.publicId).subscribe(...)
  }
}
}
