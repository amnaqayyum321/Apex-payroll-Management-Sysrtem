import { Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { LoaderService } from '../../../../core/services/management-services/loader.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FormsService } from '../../Services/forms';

@Component({
  selector: 'app-leave-application-approvals',
  imports: [CommonModule, FormsModule],
    standalone: true,
  templateUrl: './leave-application-approvals.html',
  styleUrl: './leave-application-approvals.scss',
})
export class LeaveApplicationApprovals {




  leaveList: any[] = [];
  selectedLeave: any;
  selectedStatus: string = '';
  remarks: string = '';
  allowedStatuses: string[] = [];
  showModal = false;

  showHistoryModal = false;
  historyData: any;

  currentPage = 1;
  totalPagesCount = 0;
  totalItems = 0;
  itemsPerPage = 7;

  STATUS_FLOW: any = {
    DRAFT: ['PENDING_APPROVAL'],
    PENDING_APPROVAL: ['CANCELLED', 'DELETED'],
    APPROVED: [],
    REJECTED: [],
    CANCELLED: [],
    DELETED: []
  };

  constructor(
    private toastr: ToastrService,
    private loader: LoaderService,
    private leaveService: FormsService
  ) {}

  ngOnInit() {
    this.loadLeaves();
  }

  loadLeaves() {
    this.loader.show();
    const backendPage = this.currentPage - 1;

    this.leaveService.getMyLeaves(backendPage, this.itemsPerPage).subscribe({
      next: (res: any) => {
        this.loader.hide();
        console.log('Leaves API Response:', res);
        this.leaveList = res.data;
        this.totalItems = res.paginator.totalItems;
        this.totalPagesCount = res.paginator.totalPages;
        this.currentPage = res.paginator.currentPage + 1;
      },
      error: () => {
        this.loader.hide();
        this.toastr.error('Failed to load leaves');
      }
    });
  }

  openModal(leave: any) {
    this.selectedLeave = leave;
    this.allowedStatuses = this.STATUS_FLOW[leave.status] || [];
    this.selectedStatus = '';
    this.remarks = '';
    this.showModal = true;
  }

  updateStatus() {
    if (!this.selectedStatus) {
      this.toastr.warning('Select status');
      return;
    }

    this.loader.show();

    this.leaveService
      .updateLeaveStatus(
        this.selectedLeave.publicId,
        this.selectedStatus,
        this.remarks
      )
      .subscribe({
        next: () => {
          this.loader.hide();
          this.toastr.success('Status updated');
          this.showModal = false;
          this.loadLeaves();
        },
        error: () => {
          this.loader.hide();
          this.toastr.error('Update failed');
        }
      });
  }

  openHistory(leave: any) {
    this.loader.show();

    this.leaveService.getLeaveHistory(leave.publicId).subscribe({
      next: (res: any) => {
        this.loader.hide();
        this.historyData = res.data;
        this.showHistoryModal = true;
      },
      error: () => {
        this.loader.hide();
        this.toastr.error('History load failed');
      }
    });
  }

  closeModal() {
    this.showModal = false;
  }

  closeHistoryModal() {
    this.showHistoryModal = false;
  }
}

