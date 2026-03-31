import { Component, HostListener, OnInit } from '@angular/core';
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
  active: boolean = false;
  isEmployeeDropdownOpen = false;
  isLeaveTypeDropdownOpen = false;
  selectedEmployeeDisplay = '';
  selectedLeaveTypeDisplay = '';

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
      active: this.active,
    };

    this.loader.show();
    console.log('final payload', JSON.stringify(payload, null, 2));
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

  // Toggle employee dropdown
  toggleEmployeeDropdown(event: Event): void {
    event.stopPropagation();
    this.isEmployeeDropdownOpen = !this.isEmployeeDropdownOpen;
    // close the other if needed
    this.isLeaveTypeDropdownOpen = false;
  }

  // Select employee
  selectEmployee(emp: any, event: Event): void {
    event.stopPropagation();
    this.employeePublicId = emp.publicId;
    this.selectedEmployeeDisplay = emp.fullName; // adjust if property name differs
    this.isEmployeeDropdownOpen = false;
  }

  // Toggle leave type dropdown
  toggleLeaveTypeDropdown(event: Event): void {
    event.stopPropagation();
    this.isLeaveTypeDropdownOpen = !this.isLeaveTypeDropdownOpen;
    this.isEmployeeDropdownOpen = false;
  }

  // Select leave type
  selectLeaveType(type: any, event: Event): void {
    event.stopPropagation();
    this.leaveTypePublicId = type.publicId;
    this.selectedLeaveTypeDisplay = type.name;
    this.isLeaveTypeDropdownOpen = false;
  }

  // Close any open dropdown when clicking outside
  @HostListener('document:click', ['$event'])
  closeDropdowns(event: MouseEvent): void {
    this.isEmployeeDropdownOpen = false;
    this.isLeaveTypeDropdownOpen = false;
  }
  // Reset form and displays
  resetForm(): void {
    this.employeePublicId = '';
    this.leaveTypePublicId = '';
    this.totalLeavesPerYear = 0;
    this.remarks = '';
    this.active = true;
    this.selectedEmployeeDisplay = '';
    this.selectedLeaveTypeDisplay = '';
  }

  cancel() {
    this.router.navigate(['/panel/forms/view-leaves']);
  }

  // 🔹 Load Single (Edit Mode)

  // Update the displayed names when loading existing record
  loadSingleLeave(): void {
    this.loader.show();
    this.formsService.getLeaveEntitlementById(this.publicId!).subscribe({
      next: (res: any) => {
        this.loader.hide();
        const data = res?.data;
        if (!data) {
          this.toastr.error('No record found');
          return;
        }

        this.employeePublicId = data.employeePublicId;
        this.leaveTypePublicId = data.leaveTypePublicId;
        this.totalLeavesPerYear = data.totalLeavesPerYear;
        this.remarks = data.remarks;
        this.active = data.isActive;

        // Set display names from the loaded data by matching IDs
        const selectedEmp = this.employees.find((e) => e.publicId === data.employeePublicId);
        this.selectedEmployeeDisplay = selectedEmp ? selectedEmp.fullName : '';

        const selectedType = this.leaveTypes.find((t) => t.publicId === data.leaveTypePublicId);
        this.selectedLeaveTypeDisplay = selectedType ? selectedType.name : '';
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
      active: this.active,
    };

    console.log('UPDATE PAYLOAD:', payload);

    this.loader.show();

    this.formsService.updateLeaves(this.publicId!, payload).subscribe({
      next: () => {
        this.loader.hide();
        this.toastr.success('Updated Successfully');
        this.router.navigate(['/panel/forms/view-leaves']);
      },
      error: (err) => {
        this.loader.hide();
        console.log('ERROR:', err);
        this.toastr.error(err.error?.message || 'Update failed');
      },
    });
  }
}
