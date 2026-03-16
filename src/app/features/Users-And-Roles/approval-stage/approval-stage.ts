import { Component, HostListener, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

import { LoaderService } from '../../../core/services/management-services/loader.service';
import { UsersAndRolesService } from '../Services/user-roles';

@Component({
  selector: 'app-approval-stage',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './approval-stage.html',
  styleUrls: ['./approval-stage.scss']
})
export class ApprovalStage implements OnInit {
  // Basic fields
  code = '';
  name = '';
  description = '';
  minApprovals = 1; // default 1

  // Users list for dropdown
  users: any[] = [];
  userPage = 0;
  userSize = 1000; // load all users at once (adjust if too many)

  isUserDropdownOpen = false;          // controls dropdown visibility
selectedUserDisplay = '';     

  // Approvers management
  approvers: any[] = [];
tempApprover: any = {
  userPublicId: '',
  roleCode: '',
  userName: '',   // add this
  sequence: 0
};

  editIndex: number | null = null;

  // UI state
  isEditMode = false;
  publicId: string | null = null;
  disabled = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private loader: LoaderService,
    private toastr: ToastrService,
    private formsService: UsersAndRolesService,      // for getAllUsers
    private approvalService: UsersAndRolesService // for approval stage CRUD
  ) {}

  ngOnInit(): void {
    this.publicId = this.route.snapshot.paramMap.get('id');
    this.loadUsers().then(() => {
      if (this.publicId) {
        this.isEditMode = true;
        this.loadApprovalStage();
      }
    });
  }

  // Load all users for dropdown
  loadUsers(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.formsService.getAllUser(this.userPage, this.userSize).subscribe({
        next: (res: any) => {
          if (res.success) {
            this.users = res.data; // assuming array of { publicId, userName, roleCode, ... }
          } else {
            this.toastr.error('Failed to load users');
          }
          resolve();
        },
        error: (err) => {
          console.error('User load error', err);
          this.toastr.error('Error loading users');
          reject(err);
        }
      });
    });
  }

  // Load existing stage for edit
  loadApprovalStage(): void {
    this.loader.show();
    this.approvalService.getApprovalStageById(this.publicId!).subscribe({
      next: (res: any) => {
        this.loader.hide();
        if (res.success) {
          const data = res.data;
          this.code = data.code;
          this.name = data.name;
          this.description = data.description;
          this.minApprovals = data.minApprovals;
          // Map approvers and add userName for display
          this.approvers = data.approvers.map((a: any) => ({
            ...a,
            userName: this.getUserName(a.userPublicId)
          }));
        } else {
          this.toastr.error('Failed to load approval stage');
        }
      },
      error: () => {
        this.loader.hide();
        this.toastr.error('Error loading approval stage');
      }
    });
  }

  // Helper to get user name from publicId
 getUserName(publicId: string): string {
  const user = this.users.find(u => u.publicId === publicId);
  return user ? `${user.firstName} ${user.lastName}` : '';
}

  // When user selects a new user in dropdown, auto-fill roleCode
onUserSelect(): void {
  const selectedUser = this.users.find(u => u.publicId === this.tempApprover.userPublicId);
  if (selectedUser) {
    this.tempApprover.roleCode = selectedUser.roleCode;
    this.tempApprover.userName = `${selectedUser.firstName} ${selectedUser.lastName}`;
    this.selectedUserDisplay = this.tempApprover.userName;   // <-- add this
  } else {
    this.tempApprover.roleCode = '';
    this.tempApprover.userName = '';
    this.selectedUserDisplay = '';                           // <-- add this
  }
}
  // Add or update approver
 addOrUpdateApprover(): void {
  if (!this.tempApprover.userPublicId) {
    this.toastr.warning('Please select a user');
    return;
  }

  const selectedUser = this.users.find(
    u => u.publicId === this.tempApprover.userPublicId
  );

  if (!selectedUser) return;

const newApprover = {
  userPublicId: this.tempApprover.userPublicId,
  roleCode: this.tempApprover.roleCode,
  userName: this.tempApprover.userName,  // use the full name we stored
  sequence: 0
};

  if (this.editIndex !== null) {
    this.approvers[this.editIndex] = newApprover;
    this.editIndex = null;
  } else {
    this.approvers.push(newApprover);
  }

  this.reSequenceApprovers();
  this.resetTempApprover();
}

  // Re-number sequences based on array order
  reSequenceApprovers(): void {
    this.approvers.forEach((a, index) => {
      a.sequence = index + 1;
    });
  }

  // Edit an approver
editApprover(index: number): void {
  const approver = this.approvers[index];
  this.tempApprover = {
    userPublicId: approver.userPublicId,
    roleCode: approver.roleCode,
    userName: approver.userName,
    sequence: approver.sequence
  };
  this.selectedUserDisplay = approver.userName;   // <-- add this
  this.editIndex = index;
}

  // Delete an approver
  deleteApprover(index: number): void {
    this.approvers.splice(index, 1);
    this.reSequenceApprovers();
  }

  // Reset the add/edit form
resetTempApprover(): void {
  this.tempApprover = {
    userPublicId: '',
    roleCode: '',
    userName: '',
    sequence: 0
  };
  this.selectedUserDisplay = '';      // <-- add this
  this.editIndex = null;
}

  // Validation before submit
  isFormValid(): boolean {
    if (!this.code || !this.name) {
      this.toastr.error('Code and Name are required');
      return false;
    }
    if (this.approvers.length < this.minApprovals) {
      this.toastr.warning(`Minimum ${this.minApprovals} approver(s) required. Currently: ${this.approvers.length}`);
      return false;
    }
    return true;
  }

  // Create new stage
  createStage(): void {
    if (!this.isFormValid()) return;

    const payload = {
      code: this.code,
      name: this.name,
      description: this.description,
      minApprovals: this.minApprovals,
      approvers: this.approvers.map(a => ({
        userPublicId: a.userPublicId,
        roleCode: a.roleCode,
        sequence: a.sequence
      }))
    };

    this.loader.show();
    this.disabled = true;

    this.approvalService.createApprovalStage(payload).subscribe({
      next: () => {
        this.loader.hide();
        this.toastr.success('Approval stage created successfully');
        this.resetForm();
        setTimeout(() => {
          this.router.navigate(['/panel/users-and-roles/view-approval-stages']); // adjust route
        }, 1500);
      },
      error: (err) => {
        this.loader.hide();
        this.disabled = false;
        this.toastr.error(err.error?.message || 'Creation failed');
      }
    });
  }

  // Update existing stage
  updateStage(): void {
    if (!this.isFormValid()) return;

    const payload = {
      code: this.code,
      name: this.name,
      description: this.description,
      minApprovals: this.minApprovals,
      approvers: this.approvers.map(a => ({
        userPublicId: a.userPublicId,
        roleCode: a.roleCode,
        sequence: a.sequence
      }))
    };

    this.loader.show();
    this.disabled = true;

    this.approvalService.updateApprovalStage(this.publicId!, payload).subscribe({
      next: () => {
        this.loader.hide();
        this.toastr.success('Approval stage updated');
        this.resetForm();
        setTimeout(() => {
          this.router.navigate(['/panel/users-and-roles/view-approval-stages']);
        }, 1500);
      },
      error: (err) => {
        this.loader.hide();
        this.disabled = false;
        this.toastr.error(err.error?.message || 'Update failed');
      }
    });
  }

  // Reset form fields
  resetForm(): void {
    this.code = '';
    this.name = '';
    this.description = '';
    this.minApprovals = 1;
    this.approvers = [];
    this.resetTempApprover();
  }

  // Cancel and go back to list
  cancel(): void {
    this.router.navigate(['/panel/users-and-roles/view-approval-stages']);
  }

  // Toggle dropdown (stop propagation so the document click doesn't close it immediately)
toggleUserDropdown(event: Event): void {
  event.stopPropagation();
  this.isUserDropdownOpen = !this.isUserDropdownOpen;
}

// Select a user from the list
selectUser(user: any, event: Event): void {
  event.stopPropagation();
  this.tempApprover.userPublicId = user.publicId;
  this.onUserSelect();               // auto‑fills roleCode and userName
  this.selectedUserDisplay = this.tempApprover.userName; // show full name
  this.isUserDropdownOpen = false;
}

// Close dropdown when clicking outside
@HostListener('document:click', ['$event'])
closeDropdown(event: Event): void {
  this.isUserDropdownOpen = false;
}
}