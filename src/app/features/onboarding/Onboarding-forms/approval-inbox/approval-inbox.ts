import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { finalize } from 'rxjs/operators';
import { OnboardingService } from '../../Services/onboarding';

export interface ApprovalItem {
  id: string;
  instancePublicId: string;
  actionPublicId: string;
  title: string;
  requestedBy: string;
  requestedDate: string;
  type: string;
  priority: 'High' | 'Medium' | 'Low';
  status: 'Pending' | 'Approved' | 'Rejected' | 'Returned' | 'Draft';
  remarks?: string;
  selected?: boolean;
}

export interface ActionModalData {
  visible: boolean;
  actionType: 'APPROVE' | 'REJECT' | 'RETURN' | null;
  item: ApprovalItem | null;
  remarks: string;
  loading: boolean;
}

@Component({
  selector: 'app-approval-inbox',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './approval-inbox.html',
  styleUrl: './approval-inbox.scss',
})
export class ApprovalInbox implements OnInit {
  tabs = ['All', 'Pending', 'Approved', 'Rejected', 'Returned'];
  activeTab = 'All';

  searchQuery = '';
  selectedPriority = '';

  currentPage = 1;
  pageSize = 10;
  totalItems = 0;

  selectAll = false;
  PendingApprovalList: any;
  listLoading = false;
  listError = '';

  modal: ActionModalData = {
    visible: false,
    actionType: null,
    item: null,
    remarks: '',
    loading: false,
  };

  toast: { visible: boolean; message: string; type: 'success' | 'error' } = {
    visible: false,
    message: '',
    type: 'success',
  };

  filteredItems: ApprovalItem[] = [];

  constructor(private OnbaordingSv: OnboardingService) {}

  ngOnInit(): void {
    this.getPendingApprovals();
  }

  getPendingApprovals(): void {
    this.listLoading = true;
    const apiPage = this.currentPage - 1;
    this.OnbaordingSv.getPendingApprovals(apiPage, this.pageSize).subscribe(
      (res: any) => {
        console.log('RAW RES:', res);
        if (res.success) {
          this.PendingApprovalList = res.data.map((raw: any) => ({
            id: raw.actionPublicId,
            actionPublicId: raw.actionPublicId,
            instancePublicId: raw.instancePublicId,
            title: raw.templateName,
            templateName: raw.templateName,
            requestedBy: raw.stageName,
            requestedDate: raw.createdDate,
            type: raw.referenceType,
            priority: raw.priority ?? 'Medium',
            status:
              raw.actionStatus === 'PENDING'
                ? 'Pending'
                : raw.actionStatus === 'APPROVED'
                  ? 'Approved'
                  : raw.actionStatus === 'REJECTED'
                    ? 'Rejected'
                    : raw.actionStatus === 'RETURNED'
                      ? 'Returned'
                      : 'Draft',
            stageOrder: raw.stageOrder,
            stageName: raw.stageName,
            selected: false,
          }));
          this.totalItems = res.paginator?.totalItems ?? this.PendingApprovalList.length;
          this.listLoading = false;
        }
      },
      (err: any) => {
        this.listLoading = false;
        console.log('ERROR:', err);
      },
    );
  }

  setActiveTab(tab: string): void {
    this.activeTab = tab;
    this.currentPage = 1;
    this.getPendingApprovals();
  }

  onSearch(): void {
    this.currentPage = 1;
    this.getPendingApprovals();
  }

  toggleSelectAll(): void {
    this.filteredItems.forEach((i) => (i.selected = this.selectAll));
  }

  openModal(item: ApprovalItem, action: 'APPROVE' | 'REJECT' | 'RETURN'): void {
    this.modal = { visible: true, actionType: action, item, remarks: '', loading: false };
  }

  closeModal(): void {
    this.modal = { visible: false, actionType: null, item: null, remarks: '', loading: false };
  }

  confirmAction(): void {
    if (!this.modal.item || !this.modal.actionType) return;

    this.modal.loading = true;

    const { actionPublicId, instancePublicId } = this.modal.item;
    const payload = {
      actionType: this.modal.actionType,
      remarks: this.modal.remarks,
    };

    console.log('=== APPROVAL ACTION DEBUG ===');
    console.log('actionPublicId:', actionPublicId);
    console.log('instancePublicId:', instancePublicId);
    console.log('Payload:', JSON.stringify(payload, null, 2));
    console.log('Full modal item:', JSON.stringify(this.modal.item, null, 2));

    // ← instancePublicId URL mein jaata hai (API docs ke mutabiq)
    this.OnbaordingSv.performApprovalAction(instancePublicId, payload)
      .pipe(finalize(() => (this.modal.loading = false)))
      .subscribe({
        next: (res: any) => {
          console.log('Action Success:', res);
          this.showToast(
            `Request ${this.modal.actionType?.toLowerCase()}d successfully!`,
            'success',
          );
          this.closeModal();
          this.getPendingApprovals();
        },
        error: (err: any) => {
          console.log('Action Error:', err);
          this.showToast(err?.error?.message ?? 'Action failed. Please try again.', 'error');
        },
      });
  }

  showToast(message: string, type: 'success' | 'error'): void {
    this.toast = { visible: true, message, type };
    setTimeout(() => (this.toast.visible = false), 3000);
  }

  get totalPages(): number {
    return Math.ceil(this.totalItems / this.pageSize);
  }

  get pages(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  goToPage(page: number): void {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    this.getPendingApprovals();
  }

  getStatusBadgeClass(status: string): string {
    const map: Record<string, string> = {
      Pending: 'pending-badge',
      Approved: 'approved-badge',
      Rejected: 'rejected-badge',
      Returned: 'open-badge',
      Draft: 'draft-badge',
    };
    return `status-badge ${map[status] ?? 'draft-badge'}`;
  }

  getPriorityClass(priority: string): string {
    const map: Record<string, string> = {
      High: 'priority-high',
      Medium: 'priority-medium',
      Low: 'priority-low',
    };
    return map[priority] ?? '';
  }

  getTabCount(tab: string): number {
    if (tab === this.activeTab) return this.totalItems;
    return 0;
  }

  getActionLabel(): string {
    const map: Record<string, string> = {
      APPROVE: 'Approve',
      REJECT: 'Reject',
      RETURN: 'Return',
    };
    return this.modal.actionType ? map[this.modal.actionType] : '';
  }

  getActionBtnClass(): string {
    if (this.modal.actionType === 'APPROVE') return 'action-confirm-btn approve';
    if (this.modal.actionType === 'REJECT') return 'action-confirm-btn reject';
    return 'action-confirm-btn return';
  }
}
