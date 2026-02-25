import { Component } from '@angular/core';
import { LoaderService } from '../../../../core/services/management-services/loader.service';
import { FormsService } from '../../Services/forms';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-leave-application',
  imports: [FormsModule, CommonModule],
  templateUrl: './leave-application.html',
  styleUrl: './leave-application.scss',
})
export class LeaveApplication {
  name: string = '';
  employeePublicId: string = '';
  leaveTypePublicId: string = '';
  leaveMode: string = 'FULL_DAY';
  disabled: boolean = false;
  fromDate: string = '';
  remarks: string = '';
  toDate: string = '';
  currentPage: number = 0; // page number
  pageSize: number = 100;
  publicId: string | null = null;
  isEditMode = false;
  active: boolean = false;
  EmployeeList: any;
  LeaveTypeList: any;
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
      this.loadSingleLeaveApplication(this.publicId);
    }
    this.GetEmployees();
    this.GetLeaveType();
  }
  GetEmployees() {
    this.FormSv.GetEmployees(this.currentPage, this.pageSize).subscribe(
      (res: any) => {
        if (res.success) {
          this.EmployeeList = res.data;
          console.log('Employee List', res);
        }
      },
      (err: any) => {
        console.log(err);
      },
    );
  }
  GetLeaveType() {
    this.FormSv.GetLeaveType(this.currentPage, this.pageSize).subscribe(
      (res: any) => {
        if (res.success) {
          this.LeaveTypeList = res.data;
          console.log('Leave Type Data', res);
        }
      },
      (err: any) => {
        console.log(err);
      },
    );
  }
  createleaveapplication() {
    if (
      !this.name ||
      !this.leaveTypePublicId ||
      !this.employeePublicId ||
      !this.fromDate ||
      !this.toDate
    ) {
      this.toastr.error('Please fill in all required fields');
      return;
    }
    let payload = {
      name: this.name,
      leaveTypePublicId: this.leaveTypePublicId,
      employeePublicId: this.employeePublicId,
      leaveMode: this.leaveMode,
      fromDate: this.fromDate,
      toDate: this.toDate,
      remarks: this.remarks,
    };
    this.loader.show();
    this.disabled = true;
    this.FormSv.CreateLeaveApplication(payload).subscribe({
      next: (res: any) => {
        this.loader.hide();
        this.toastr.success('leave-application created successfully', 'Success');
        this.resetLeaveApplicationForm();
        setTimeout(() => {
          this.router.navigate(['/panel/forms/view-leave-application']);
        }, 1500);
      },
      error: (error: any) => {
        this.loader.hide();
        this.disabled = false;
        this.toastr.error(
          error.error.message || 'Failed to create leave-application. Please try again.',
          'Error',
        );
      },
    });
  }
  resetLeaveApplicationForm() {
    this.name = '';
    this.leaveTypePublicId = '';
    this.employeePublicId = '';
    this.leaveMode = 'FULL_DAY';
    this.fromDate = '';
    this.toDate = '';
    this.remarks = '';
    this.disabled = false;
  }
  cancel() {
    this.router.navigate(['/panel/forms/view-leave-application']);
  }
  loadSingleLeaveApplication(publicId: string) {
    this.loader.show();
    this.FormSv.getLeaveApplicationById(publicId!).subscribe({
      next: (res: any) => {
        console.log('API response:', res.data);
        this.loader.hide();
        const d = res.data;
        this.name = d.name;
        this.leaveTypePublicId = d.leaveTypePublicId;
        this.employeePublicId = d.employeePublicId;
        this.leaveMode = d.leaveMode;
        this.fromDate = d.fromDate;
        this.toDate = d.toDate;
        this.remarks = d.remarks;
      },
      error: () => {
        this.loader.hide();
        this.toastr.error('Failed to load leave-application');
      },
    });
  }
  updateLeaveApplication() {
    const payload = {
      name: this.name,
      leaveTypePublicId: this.leaveTypePublicId,
      employeePublicId: this.employeePublicId,
      leaveMode: this.leaveMode,
      fromDate: this.fromDate,
      toDate: this.toDate,
      remarks: this.remarks,
    };
    this.loader.show();
    this.FormSv.UpdateLeaveApplication(this.publicId!, payload).subscribe({
      next: () => {
        this.loader.hide();
        this.toastr.success('Leave-Application  updated');
        this.resetLeaveApplicationForm();
        setTimeout(() => {
          this.router.navigate(['/panel/forms/view-leave-application']);
        }, 1500);
        console.log('Active from API:', this.active);
      },

      error: () => {
        this.loader.hide();
        this.toastr.error('leave-application Update failed');
      },
    });
  }
}
