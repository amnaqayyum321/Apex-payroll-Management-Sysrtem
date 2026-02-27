import { Component } from '@angular/core';
import { LoaderService } from '../../../../core/services/management-services/loader.service';
import { FormsService } from '../../Services/forms';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-leaves-master-data',
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './leaves-master-data.html',
  styleUrl: './leaves-master-data.scss',
})
export class LeavesMasterData {
  code: string = '';
  name: string = '';
  totalLeavesPerYear: number | null = null;
  maxLeaveApplyInMonth: number | null = null;
  status: boolean = false;
  isCarryForward: boolean = false;
  isEncashable: boolean = false;
  remarks: string = '';
  active: boolean = false;
  disabled: boolean = false;
  publicId: string | null = null;
  isEditMode: boolean = false;

  constructor(
    private loader: LoaderService,
    private FormSv: FormsService,
    private toastr: ToastrService,
    private router: Router,
    private route: ActivatedRoute,
  ) {}

  ngOnInit() {
    this.publicId = this.route.snapshot.paramMap.get('id');
    if (this.publicId) {
      this.isEditMode = true;
      this.loadSingleLeave(this.publicId);
    }
  }

  createLeave() {
    if (!this.code || !this.name) {
      this.toastr.error('Please fill in all required fields');
      return;
    }

    const payload = {
      code: this.code,
      name: this.name,
      totalLeavesPerYear: this.totalLeavesPerYear,
      maxLeaveApplyInMonth: this.maxLeaveApplyInMonth,
      active: this.active,
      isCarryForward: this.isCarryForward,
      isEncashable: this.isEncashable,
      remarks: this.remarks,
    };

    this.loader.show();
    this.disabled = true;
    this.FormSv.CreateLeaveType(payload).subscribe({
      next: () => {
        this.loader.hide();
        this.toastr.success('Leave master data created successfully', 'Success');
        this.resetForm();
        setTimeout(() => {
          this.router.navigate(['/panel/forms/view-leaves-master-list']);
        }, 1500);
      },
      error: (error: any) => {
        this.loader.hide();
        this.disabled = false;
        this.toastr.error(
          error.error?.message || 'Failed to create leave. Please try again.',
          'Error',
        );
      },
    });
  }

  updateLeave() {
    if (!this.code || !this.name) {
      this.toastr.error('Please fill in all required fields');
      return;
    }

    const payload = {
      code: this.code,
      name: this.name,
      totalLeavesPerYear: this.totalLeavesPerYear,
      maxLeaveApplyInMonth: this.maxLeaveApplyInMonth,
      active: this.active,
      isCarryForward: this.isCarryForward,
      isEncashable: this.isEncashable,
      remarks: this.remarks,
    };

    this.loader.show();
    this.FormSv.UpdateLeaveType(this.publicId!, payload).subscribe({
      next: () => {
        this.loader.hide();
        this.toastr.success('Leave master data updated successfully', 'Success');
        this.resetForm();
        setTimeout(() => {
          this.router.navigate(['/panel/forms/view-leaves-master-list']);
        }, 1500);
      },
      error: (error: any) => {
        this.loader.hide();
        this.toastr.error(
          error.error?.message || 'Failed to update leave. Please try again.',
          'Error',
        );
      },
    });
  }

  loadSingleLeave(publicId: string) {
    this.loader.show();
    this.FormSv.getLeaveTypeById(publicId).subscribe({
      next: (res: any) => {
        console.log('Single leave response:', res);
        this.loader.hide();
        this.code = res.data.code;
        this.name = res.data.name;
        this.totalLeavesPerYear = res.data.totalLeavesPerYear;
        this.maxLeaveApplyInMonth = res.data.maxLeaveApplyInMonth;
        this.active = res.data.isActive === true;
        this.isCarryForward = res.data.isCarryForward;
        this.isEncashable = res.data.isEncashable;
        this.remarks = res.data.remarks || '';
      },
      error: () => {
        this.loader.hide();
        this.toastr.error('Failed to load leave data');
      },
    });
  }

  resetForm() {
    this.code = '';
    this.name = '';
    this.totalLeavesPerYear = null;
    this.maxLeaveApplyInMonth = null;
    this.active = false;
    this.isCarryForward = false;
    this.isEncashable = false;
    this.remarks = '';
    this.disabled = false;
  }

  cancel() {
    this.router.navigate(['/panel/forms/view-leaves-master-list']);
  }
}
