import { Component, OnInit } from '@angular/core';
import { LoaderService } from '../../../../core/services/management-services/loader.service';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsService } from '../../Services/forms';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-leaves',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './leaves.html',
  styleUrl: './leaves.scss',
})
export class Leaves implements OnInit {

  employeePublicId: string = '';
  leaveTypePublicId: string = '';
  totalLeavesPerYear: number = 0;
  remarks: string = '';
  active: boolean = true;

  employees: any[] = [];
  leaveTypes: any[] = [];

  publicId: string | null = null;
  isEditMode = false;

  currentPage = 0;
  pageSize = 100;

  constructor(
    private loader: LoaderService,
    private formsService: FormsService,
    private toastr: ToastrService,
    private router: Router,
    private route: ActivatedRoute,
  ) {}

  ngOnInit() {
    this.getEmployees();
    this.getLeaveTypes();

    this.publicId = this.route.snapshot.paramMap.get('id');
    if (this.publicId) {
      this.isEditMode = true;
      this.loadSingleLeave();
    }
  }

getEmployees() {
  this.formsService
    .GetEmployeesForLeaveEntilements(this.currentPage, this.pageSize)
    .subscribe((res: any) => {
      console.log('EMP RESPONSE:', res);
      this.employees = res?.data?.content || res?.data || res?.content || res || [];
      console.log('EMP ARRAY:', this.employees);
    });
}

getLeaveTypes() {
  this.formsService
    .GetLeaveType(this.currentPage, this.pageSize, 'ACTIVE')
    .subscribe((res: any) => {
      console.log('LEAVE RESPONSE:', res);
      this.leaveTypes = res?.data?.content || res?.data || res?.content || res || [];
      console.log('LEAVE ARRAY:', this.leaveTypes);
    });
}

  // 🔹 Create
  createLeave() {
    if (!this.employeePublicId || !this.leaveTypePublicId) {
      this.toastr.error('Please select employee and leave type');
      return;
    }

    const payload = {
      employeePublicId: this.employeePublicId,
      leaveTypePublicId: this.leaveTypePublicId,
      totalLeavesPerYear: this.totalLeavesPerYear,
      remarks: this.remarks,
active: this.active,     };

    this.loader.show();

    this.formsService.CreateLeaves(payload).subscribe({
      next: () => {
        this.loader.hide();
        this.toastr.success('Leave Entitlement Created');
        this.resetForm();
        this.router.navigate(['/panel/forms/view-leaves']);
      },
      error: (err) => {
        this.loader.hide();
        this.toastr.error(err.error.message || 'Creation failed');
      },
    });
  }

  // 🔹 Reset
  resetForm() {
    this.employeePublicId = '';
    this.leaveTypePublicId = '';
    this.totalLeavesPerYear = 0;
    this.remarks = '';
    this.active = true;
  }

  cancel() {
    this.router.navigate(['/panel/forms/view-leaves']);
  }

  // 🔹 Load Single (Edit Mode)
loadSingleLeave() {
  this.loader.show();

  this.formsService.getLeaveEntitlementById(this.publicId!).subscribe({
    next: (res: any) => {
      this.loader.hide();

      const data = res?.data;   // ✅ REMOVE [0]

      if (!data) {
        this.toastr.error('No record found');
        return;
      }

      this.employeePublicId = data.employeePublicId;
      this.leaveTypePublicId = data.leaveTypePublicId;
      this.totalLeavesPerYear = data.totalLeavesPerYear;
      this.remarks = data.remarks;
      this.active = data.isActive;   // backend field
    },
    error: () => {
      this.loader.hide();
      this.toastr.error('Failed to load data');
    },
  });
}

 updateLeave() {

  if (!this.employeePublicId || !this.leaveTypePublicId) {
    this.toastr.error('Employee and Leave Type are required');
    return;
  }

  const payload = {
    employeePublicId: this.employeePublicId,
    leaveTypePublicId: this.leaveTypePublicId,
    totalLeavesPerYear: this.totalLeavesPerYear,
    remarks: this.remarks,
active: this.active,   };

  console.log("UPDATE PAYLOAD:", payload);

  this.loader.show();

  this.formsService.updateLeaves(this.publicId!, payload).subscribe({
    next: () => {
      this.loader.hide();
      this.toastr.success('Updated Successfully');
      this.router.navigate(['/panel/forms/view-leaves']);
    },
    error: (err) => {
      this.loader.hide();
      console.log("ERROR:", err);
      this.toastr.error(err.error?.message || 'Update failed');
    },
  });
}
}