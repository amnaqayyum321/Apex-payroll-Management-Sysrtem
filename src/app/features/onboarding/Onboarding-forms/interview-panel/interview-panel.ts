import { Component, HostListener } from '@angular/core';
import { FormsService } from '../../../forms/Services/forms';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OnboardingService } from '../../Services/onboarding';
import { ToastrService } from 'ngx-toastr';
import { LoaderService } from '../../../../core/services/management-services/loader.service';

@Component({
  selector: 'app-interview-panel',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './interview-panel.html',
  styleUrls: ['./interview-panel.scss'],
})
export class InterviewPanel {
  code = '';
  name = '';
  remarks = '';
  active = false;
  disabled: boolean = false;

  employees: any[] = [];
  employeePage: number = 0;
  employeeSize: number = 100;
  members: any[] = [];
  member: any = {
    employeePublicId: '',
    responsibility: '',
    lineNumber: 0,
    status: 'ACTIVE',
  };

  editMemberIndex: number | null = null;

  isEditMode = false;
  publicId: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private Onboarding: OnboardingService,
    private formService: FormsService,
    private loader: LoaderService,

    private toastr: ToastrService,
  ) {}
  ngOnInit() {
    this.publicId = this.route.snapshot.paramMap.get('id');

    this.loadEmployees().then(() => {
      if (this.publicId) {
        this.isEditMode = true;
        this.loadPanel();
      }
    });
  }

  loadEmployees(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.formService.GetEmployees(this.employeePage, this.employeeSize, 'ALL').subscribe({
        next: (res: any) => {
          this.employees = res.data;
          resolve();
        },
        error: (err) => {
          console.error('Failed to load employees');
          reject(err);
        },
      });
    });
  }
  addOrUpdateMember() {
    debugger;
    const selectedEmployee = this.employees.find(
      (e) => e.employeePublicId === this.member.employeePublicId,
    );
    console.log('employee id', selectedEmployee);
    if (!selectedEmployee) return;

    const newMember = {
      ...this.member,
      fullName: selectedEmployee.fullName,
    };

    if (this.editMemberIndex !== null) {
      this.members[this.editMemberIndex] = newMember;
      this.editMemberIndex = null;
    } else {
      newMember.lineNumber = this.members.length + 1;
      this.members.push(newMember);
    }

    this.resetMemberForm();
  }


editMember(index: number) {
  const memberToEdit = this.members[index];
  this.member = { ...memberToEdit };
  this.editMemberIndex = index;
  
  // Set dropdown labels
  const employee = this.employees.find(e => e.employeePublicId === memberToEdit.employeePublicId);
  this.selectedEmployeeLabel = employee ? employee.fullName : '';
  this.selectedStatusLabel = memberToEdit.status;
}

  deleteMember(index: number) {
    this.members.splice(index, 1);
  }
resetMemberForm() {
  this.member = {
    employeePublicId: '',
    responsibility: '',
    lineNumber: 0,
    status: 'ACTIVE',
  };
  this.selectedEmployeeLabel = '';
  this.selectedStatusLabel = 'ACTIVE';
  this.selectedEmployeeId = '';
}

  createPanel() {
    if (!this.code || !this.name) {
      this.toastr.error('Please fill in all required fields');
      return;
    }

    const payload = {
      code: this.code,
      name: this.name,
      remarks: this.remarks,
      active: this.active, // ✅ FIXED
      members: this.members,
    };

    this.loader.show();
    this.disabled = true;

    this.Onboarding.CreatenewInterviewPanel(payload).subscribe({
      next: () => {
        this.loader.hide();
        this.toastr.success('Panel created successfully', 'Success');

        this.resetForm();

        setTimeout(() => {
          this.router.navigate(['/panel/onboarding/view-interview-panel-list']);
        }, 1500);
      },
      error: (error: any) => {
        this.loader.hide();
        this.disabled = false;

        this.toastr.error(
          error.error?.message || 'Failed to create Panel. Please try again.',
          'Error',
        );
      },
    });
  }

  updatePanel() {
    const payload = {
      code: this.code,
      name: this.name,
      remarks: this.remarks,
      active: this.active, // ✅ FIXED
      members: this.members,
    };

    this.loader.show();
    this.disabled = true;

    this.Onboarding.updateInterviewPanel(this.publicId!, payload).subscribe({
      next: () => {
        this.loader.hide();
        this.toastr.success('Panel updated successfully', 'Success');

        this.resetForm();

        setTimeout(() => {
          this.router.navigate(['/panel/onboarding/view-interview-panel-list']);
        }, 1500);
      },
      error: (error: any) => {
        this.loader.hide();
        this.disabled = false;

        this.toastr.error(error.error?.message || 'Failed to update Panel', 'Error');
      },
    });
  }

  loadPanel() {
    this.loader.show();

    this.Onboarding.getInterviewPanelById(this.publicId!).subscribe({
      next: (res: any) => {
        this.loader.hide();

        const data = res.data;

        this.code = data.code;
        this.name = data.name;
        this.remarks = data.remarks;
        this.active = data.isActive;
        this.members = data.members.map((m: any) => {
          const emp = this.employees.find((e) => e.employeePublicId === m.employeePublicId);

          return {
            ...m,
            fullName: emp ? emp.fullName : '',
          };
        });
      },
      error: () => {
        this.loader.hide();
        this.toastr.error('Failed to load Panel');
      },
    });
  }
  getEmployeeName(id: string) {
    const emp = this.employees.find((e) => e.employeePublicId === id);
    return emp ? emp.name : '';
  }

  resetForm() {
    this.code = '';
    this.name = '';
    this.remarks = '';
    this.active = true;
    this.members = [];
  }

  cancel() {
    this.router.navigate(['/panel/onboarding/view-interview-panel-list']);
  }


  // Add these properties with your existing ones
isEmployeeDropdownOpen = false;
isStatusDropdownOpen = false;
selectedEmployeeLabel = '';
selectedStatusLabel = '';
selectedEmployeeId = '';

statusOptions = [
  { value: 'ACTIVE', label: 'ACTIVE' },
  { value: 'INACTIVE', label: 'INACTIVE' }
];

// Add these methods
toggleEmployeeDropdown(event: Event) {
  event.stopPropagation();
  this.isEmployeeDropdownOpen = !this.isEmployeeDropdownOpen;
  this.isStatusDropdownOpen = false;
}

selectEmployee(emp: any, event: Event) {
  event.stopPropagation();
  this.member.employeePublicId = emp.employeePublicId;
  this.selectedEmployeeLabel = emp.fullName;
  this.selectedEmployeeId = emp.employeePublicId;
  this.isEmployeeDropdownOpen = false;
}

toggleStatusDropdown(event: Event) {
  event.stopPropagation();
  this.isStatusDropdownOpen = !this.isStatusDropdownOpen;
  this.isEmployeeDropdownOpen = false;
}

selectStatus(status: any, event: Event) {
  event.stopPropagation();
  this.member.status = status.value;
  this.selectedStatusLabel = status.label;
  this.isStatusDropdownOpen = false;
}

@HostListener('document:click', ['$event'])
closeAllDropdowns(event?: Event) {   // ← Add optional event parameter
  this.isEmployeeDropdownOpen = false;
  this.isStatusDropdownOpen = false;
}
}
