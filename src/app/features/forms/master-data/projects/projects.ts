import { Component, HostListener } from '@angular/core';
import { LoaderService } from '../../../../core/services/management-services/loader.service';
import { FormsService } from '../../Services/forms';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-projects',
  imports: [CommonModule, FormsModule],
  templateUrl: './projects.html',
  styleUrl: './projects.scss',
})
export class Projects {
  Code: string = '';
  Name: string = '';
  description: string = '';
  managerPublicId: string = '';
  managerMode: 'SELF' | 'SELECTED' = 'SELECTED';
  disabled: boolean = false;
  currentPage: number = 0;
  pageSize: number = 100;
  publicId: string | null = null;
  isEditMode = false;
  status: boolean = false;
  employeeList: any[] = [];

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
    }
    this.FormSv.GetEmployees(this.currentPage, this.pageSize).subscribe({
      next: (res: any) => {
        if (res.success) {
          this.employeeList = res.data;
          console.log('Employees loaded:', this.employeeList);
        }
        if (this.publicId) {
          this.loadSingleProject(this.publicId);
        }
      },
      error: (err: any) => {
        console.log(err);
        if (this.publicId) {
          this.loadSingleProject(this.publicId);
        }
      },
    });
  }

  onManagerTypeChange() {
    this.managerPublicId = '';
  }

  createDepartment() {
    if (!this.Code || !this.Name) {
      this.toastr.error('Please fill in all required fields');
      return;
    }
    if (this.managerMode === 'SELECTED' && !this.managerPublicId) {
      this.toastr.error('Please select a Project Manager');
      return;
    }

    const payload = {
      code: this.Code,
      name: this.Name,
      description: this.description,
      status: this.status ? 'ACTIVE' : 'CLOSED',
      managerMode: this.managerMode,
      managerPublicId: this.managerMode === 'SELECTED' ? this.managerPublicId : null,
    };

    this.loader.show();
    this.disabled = true;
    this.FormSv.CreateProject(payload).subscribe({
      next: () => {
        this.loader.hide();
        this.toastr.success('Project created successfully', 'Success');
        this.resetprojectForm();
        setTimeout(() => {
          this.router.navigate(['/panel/forms/view-projects']);
        }, 1500);
      },
      error: (error: any) => {
        this.loader.hide();
        this.disabled = false;
        this.toastr.error(
          error.error?.message || 'Failed to create Project. Please try again.',
          'Error',
        );
      },
    });
  }

  resetprojectForm() {
    this.Code = '';
    this.Name = '';
    this.description = '';
    this.managerPublicId = '';
    this.managerMode = 'SELECTED';
    this.status = false;
    this.disabled = false;
  }

  cancel() {
    this.router.navigate(['/panel/forms/view-projects']);
  }

  loadSingleProject(publicId: string) {
    this.loader.show();
    this.FormSv.getProjectById(publicId).subscribe({
      next: (res: any) => {
        this.loader.hide();
        this.Code = res.data.code;
        this.Name = res.data.name;
        this.description = res.data.description;
        this.status = res.data.status === 'ACTIVE';
        this.managerPublicId = res.data.managerPublicId || '';
        this.managerMode = this.managerPublicId ? 'SELECTED' : 'SELF';
      },
      error: () => {
        this.loader.hide();
        this.toastr.error('Failed to load project');
      },
    });
  }

  updateDepartment() {
    if (this.managerMode === 'SELECTED' && !this.managerPublicId) {
      this.toastr.error('Please select a Project Manager');
      return;
    }

    const payload = {
      code: this.Code,
      name: this.Name,
      description: this.description,
      status: this.status ? 'ACTIVE' : 'CLOSED',
      managerMode: this.managerMode,
      managerPublicId: this.managerMode === 'SELECTED' ? this.managerPublicId : null,
    };
    this.loader.show();
    this.FormSv.UpdateProject(this.publicId!, payload).subscribe({
      next: () => {
        this.loader.hide();
        this.toastr.success('Project updated');
        this.resetprojectForm();
        setTimeout(() => {
          this.router.navigate(['/panel/forms/view-projects']);
        }, 1500);
      },
      error: () => {
        this.loader.hide();
        this.toastr.error('Project update failed');
      },
    });
  }



  // Add these properties
isManagerTypeDropdownOpen = false;
isEmployeeDropdownOpen = false;

// Helper methods for custom dropdowns
getManagerTypeLabel(): string {
  return this.managerMode === 'SELF' ? 'Self' : 'Employee (Select manually)';
}

getSelectedEmployeeName(): string {
  if (!this.managerPublicId) return '';
  const emp = this.employeeList.find(e => e.publicId === this.managerPublicId);
  return emp ? emp.fullName : '';
}

toggleManagerTypeDropdown(event: Event) {
  event.stopPropagation();
  this.isManagerTypeDropdownOpen = !this.isManagerTypeDropdownOpen;
  // Close the other dropdown if open
  this.isEmployeeDropdownOpen = false;
}

selectManagerType(mode: 'SELF' | 'SELECTED', event: Event) {
  event.stopPropagation();
  this.managerMode = mode;
  this.managerPublicId = ''; // Reset selected manager
  this.isManagerTypeDropdownOpen = false;
  this.onManagerTypeChange(); // Keep original logic if needed
}

toggleEmployeeDropdown(event: Event) {
  event.stopPropagation();
  this.isEmployeeDropdownOpen = !this.isEmployeeDropdownOpen;
  // Close the other dropdown if open
  this.isManagerTypeDropdownOpen = false;
}

selectEmployee(emp: any, event: Event) {
  event.stopPropagation();
  this.managerPublicId = emp.publicId;
  this.isEmployeeDropdownOpen = false;
}

// HostListener to close dropdowns when clicking outside
@HostListener('document:click', ['$event'])
closeDropdowns(event: Event) {
  this.isManagerTypeDropdownOpen = false;
  this.isEmployeeDropdownOpen = false;
}
}
