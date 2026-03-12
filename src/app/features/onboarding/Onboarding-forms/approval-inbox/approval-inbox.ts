import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';

export interface ApprovalItem {
  id: string;
  instancePublicId: string;
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
  // Filter tabs
  tabs = ['All', 'Pending', 'Approved', 'Rejected', 'Returned'];
  activeTab = 'All';

  // Search & filter
  searchQuery = '';
  selectedPriority = '';

  // Pagination
  currentPage = 1;
  pageSize = 10;
  totalItems = 0;

  // Select all
  selectAll = false;

  // Action Modal
  modal: ActionModalData = {
    visible: false,
    actionType: null,
    item: null,
    remarks: '',
    loading: false,
  };

  // Toast notification
  toast: { visible: boolean; message: string; type: 'success' | 'error' } = {
    visible: false,
    message: '',
    type: 'success',
  };

  // Mock Data
  allItems: ApprovalItem[] = [
    {
      id: '1',
      instancePublicId: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
      title: 'Budget Approval Q4 2024',
      requestedBy: 'Ali Hassan',
      requestedDate: '2024-12-01',
      type: 'Finance',
      priority: 'High',
      status: 'Pending',
    },
    {
      id: '2',
      instancePublicId: 'b2c3d4e5-f6a7-8901-bcde-f12345678901',
      title: 'Leave Request - Annual',
      requestedBy: 'Sara Khan',
      requestedDate: '2024-12-03',
      type: 'HR',
      priority: 'Medium',
      status: 'Pending',
    },
    {
      id: '3',
      instancePublicId: 'c3d4e5f6-a7b8-9012-cdef-123456789012',
      title: 'Vendor Contract Renewal',
      requestedBy: 'Usman Tariq',
      requestedDate: '2024-11-28',
      type: 'Procurement',
      priority: 'High',
      status: 'Approved',
    },
    {
      id: '4',
      instancePublicId: 'd4e5f6a7-b8c9-0123-defa-234567890123',
      title: 'IT Infrastructure Upgrade',
      requestedBy: 'Fatima Malik',
      requestedDate: '2024-12-05',
      type: 'IT',
      priority: 'Low',
      status: 'Rejected',
    },
    {
      id: '5',
      instancePublicId: 'e5f6a7b8-c9d0-1234-efab-345678901234',
      title: 'Marketing Campaign Proposal',
      requestedBy: 'Ahmed Raza',
      requestedDate: '2024-12-07',
      type: 'Marketing',
      priority: 'Medium',
      status: 'Pending',
    },
    {
      id: '6',
      instancePublicId: 'f6a7b8c9-d0e1-2345-fabc-456789012345',
      title: 'Office Renovation Budget',
      requestedBy: 'Zainab Iqbal',
      requestedDate: '2024-11-25',
      type: 'Admin',
      priority: 'Low',
      status: 'Returned',
    },
    {
      id: '7',
      instancePublicId: 'a7b8c9d0-e1f2-3456-abcd-567890123456',
      title: 'New Hire Onboarding Plan',
      requestedBy: 'Bilal Chaudhry',
      requestedDate: '2024-12-08',
      type: 'HR',
      priority: 'High',
      status: 'Draft',
    },
    {
      id: '8',
      instancePublicId: 'b8c9d0e1-f2a3-4567-bcde-678901234567',
      title: 'Software License Purchase',
      requestedBy: 'Nadia Siddiqui',
      requestedDate: '2024-12-09',
      type: 'IT',
      priority: 'Medium',
      status: 'Pending',
    },
  ];

  filteredItems: ApprovalItem[] = [];

  ngOnInit(): void {
    this.applyFilters();
  }

  setActiveTab(tab: string): void {
    this.activeTab = tab;
    this.currentPage = 1;
    this.applyFilters();
  }

  applyFilters(): void {
    let items = [...this.allItems];

    if (this.activeTab !== 'All') {
      items = items.filter((i) => i.status === this.activeTab);
    }

    if (this.searchQuery.trim()) {
      const q = this.searchQuery.toLowerCase();
      items = items.filter(
        (i) =>
          i.title.toLowerCase().includes(q) ||
          i.requestedBy.toLowerCase().includes(q) ||
          i.type.toLowerCase().includes(q),
      );
    }

    if (this.selectedPriority) {
      items = items.filter((i) => i.priority === this.selectedPriority);
    }

    this.totalItems = items.length;
    const start = (this.currentPage - 1) * this.pageSize;
    this.filteredItems = items.slice(start, start + this.pageSize);
    this.selectAll = false;
  }

  onSearch(): void {
    this.currentPage = 1;
    this.applyFilters();
  }

  toggleSelectAll(): void {
    this.filteredItems.forEach((i) => (i.selected = this.selectAll));
  }

  openModal(item: ApprovalItem, action: 'APPROVE' | 'REJECT' | 'RETURN'): void {
    this.modal = {
      visible: true,
      actionType: action,
      item,
      remarks: '',
      loading: false,
    };
  }

  closeModal(): void {
    this.modal = { visible: false, actionType: null, item: null, remarks: '', loading: false };
  }

  confirmAction(): void {
    if (!this.modal.item || !this.modal.actionType) return;
    this.modal.loading = true;

    // Simulate API call: POST /api/approvals/{instancePublicId}/action
    setTimeout(() => {
      const item = this.allItems.find((i) => i.id === this.modal.item!.id);
      if (item) {
        if (this.modal.actionType === 'APPROVE') item.status = 'Approved';
        else if (this.modal.actionType === 'REJECT') item.status = 'Rejected';
        else if (this.modal.actionType === 'RETURN') item.status = 'Returned';
        item.remarks = this.modal.remarks;
      }
      this.modal.loading = false;
      this.showToast(`Request ${this.modal.actionType?.toLowerCase()}d successfully!`, 'success');
      this.closeModal();
      this.applyFilters();
    }, 1200);
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
    this.applyFilters();
  }

  getStatusBadgeClass(status: string): string {
    const map: Record<string, string> = {
      Pending: 'pending-badge',
      Approved: 'approved-badge',
      Rejected: 'rejected-badge',
      Returned: 'open-badge',
      Draft: 'draft-badge',
    };
    return `status-badge ${map[status] || 'draft-badge'}`;
  }

  getPriorityClass(priority: string): string {
    const map: Record<string, string> = {
      High: 'priority-high',
      Medium: 'priority-medium',
      Low: 'priority-low',
    };
    return map[priority] || '';
  }

  getTabCount(tab: string): number {
    if (tab === 'All') return this.allItems.length;
    return this.allItems.filter((i) => i.status === tab).length;
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
