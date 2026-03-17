import { Component, HostListener } from '@angular/core';
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

  // Add these properties inside the class
  isLeaveTypeDropdownOpen = false;
  isEmployeeDropdownOpen = false;
  isLeaveModeDropdownOpen = false;

  selectedLeaveTypeName = '';
  selectedEmployeeName = '';
  selectedLeaveModeDisplay = 'FULL_DAY'; // default display

  // For leave mode options (can be an array of objects or strings)
  leaveModes = [
    { value: 'FULL_DAY', label: 'FULL DAY' },
    { value: 'HALF_DAY', label: 'HALF DAY' },
    { value: 'QUARTER_DAY', label: 'QUARTER DAY' },
  ];
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

  toggleDropdown(dropdown: string, event: Event) {
    event.stopPropagation();
    // Close all others first (optional, but keeps UI clean)
    this.isLeaveTypeDropdownOpen = false;
    this.isEmployeeDropdownOpen = false;
    this.isLeaveModeDropdownOpen = false;

    // Then open the requested one
    if (dropdown === 'leaveType') this.isLeaveTypeDropdownOpen = true;
    else if (dropdown === 'employee') this.isEmployeeDropdownOpen = true;
    else if (dropdown === 'leaveMode') this.isLeaveModeDropdownOpen = true;
  }

  selectLeaveType(leave: any, event: Event) {
    event.stopPropagation();
    this.leaveTypePublicId = leave.publicId;
    this.selectedLeaveTypeName = leave.name;
    this.isLeaveTypeDropdownOpen = false;
  }

  selectEmployee(emp: any, event: Event) {
    event.stopPropagation();
    this.employeePublicId = emp.employeePublicId;
    this.selectedEmployeeName = emp.fullName;
    this.isEmployeeDropdownOpen = false;
  }

  selectLeaveMode(mode: any, event: Event) {
    event.stopPropagation();
    this.leaveMode = mode.value;
    this.selectedLeaveModeDisplay = mode.label;
    this.isLeaveModeDropdownOpen = false;
  }

  // Close all dropdowns when clicking outside
  @HostListener('document:click', ['$event'])
  closeAllDropdowns(event: Event) {
    this.isLeaveTypeDropdownOpen = false;
    this.isEmployeeDropdownOpen = false;
    this.isLeaveModeDropdownOpen = false;
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
    this.selectedLeaveTypeName = '';
    this.selectedEmployeeName = '';
    this.selectedLeaveModeDisplay = 'FULL_DAY';
  }
  cancel() {
    this.router.navigate(['/panel/forms/view-leave-application']);
  }
  // loadSingleLeaveApplication(publicId: string) {
  //   this.loader.show();
  //   this.FormSv.getLeaveApplicationById(publicId).subscribe({
  //     next: (res: any) => {
  //       this.loader.hide();
  //       const d = res.data;
  //       this.name = d.name;
  //       this.leaveTypePublicId = d.leaveTypePublicId;
  //       this.employeePublicId = d.employeePublicId;
  //       this.leaveMode = d.leaveMode;
  //       this.fromDate = d.fromDate;
  //       this.toDate = d.toDate;
  //       this.remarks = d.remarks;

  //       // Set display names from the already loaded lists
  //       const selectedLeaveType = this.LeaveTypeList?.find(
  //         (lt: any) => lt.publicId === d.leaveTypePublicId,
  //       );
  //       this.selectedLeaveTypeName = selectedLeaveType ? selectedLeaveType.name : '';

  //       const selectedEmployee = this.EmployeeList?.find(
  //         (emp: any) => emp.employeePublicId === d.employeePublicId,
  //       );
  //       this.selectedEmployeeName = selectedEmployee ? selectedEmployee.fullName : '';

  //       const mode = this.leaveModes.find((m) => m.value === d.leaveMode);
  //       this.selectedLeaveModeDisplay = mode ? mode.label : d.leaveMode;
  //     },
  //     error: () => {
  //       this.loader.hide();
  //       this.toastr.error('Failed to load leave-application');
  //     },
  //   });
  // }
  loadSingleLeaveApplication(publicId: string) {
    this.loader.show();
    this.FormSv.getLeaveApplicationById(publicId).subscribe({
      next: (res: any) => {
        this.loader.hide();
        const d = res.data;
        this.name = d.name;
        this.leaveTypePublicId = d.leaveTypePublicId;
        this.employeePublicId = d.employeePublicId;
        this.leaveMode = d.leaveMode;
        this.fromDate = d.fromDate;
        this.toDate = d.toDate;
        this.remarks = d.remarks;

        // Direct API se naam le lo, list dhundne ki zaroorat nahi
        this.selectedEmployeeName = d.employeeName;
        this.selectedLeaveTypeName = d.leaveTypeName;

        const mode = this.leaveModes.find((m) => m.value === d.leaveMode);
        this.selectedLeaveModeDisplay = mode ? mode.label : d.leaveMode;
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
