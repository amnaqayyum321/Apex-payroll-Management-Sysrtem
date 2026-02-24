import { Component, HostListener } from '@angular/core';
import { LoaderService } from '../../../../core/services/management-services/loader.service';
import { UsersAndRolesService } from '../../../Users-And-Roles/Services/user-roles';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FormsService } from '../../Services/forms';

@Component({
  selector: 'app-department',
  imports: [CommonModule, FormsModule],
  templateUrl: './department.html',
  styleUrl: './department.scss',
})
export class Department {
  Code: string = '';
  Name: string = '';
  description: string = '';
  disabled: boolean = false;
  currentPage: number = 0; // page number
  pageSize: number = 100;
  publicId: string | null = null;
  isEditMode = false;
  active: boolean = true;
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
      this.loadSingleDepartment(this.publicId);
    }
  }
  createDepartment() {
    if (!this.Code || !this.Name) {
      this.toastr.error('Please fill in all required fields');
      return;
    }
    let payload = {
      code: this.Code,
      name: this.Name,
      description: this.description,
      active: this.active,
    };
    this.loader.show();
    this.disabled = true;
    this.FormSv.CreateDepartment(payload).subscribe({
      next: (res: any) => {
        this.loader.hide();
        this.toastr.success('Department created successfully', 'Success');
        this.resetDepartmentForm();
        setTimeout(() => {
          this.router.navigate(['/panel/forms/view-department-list']);
        }, 1500);
      },
      error: (error: any) => {
        this.loader.hide();
        this.disabled = false;
        this.toastr.error(
          error.error.message || 'Failed to create Department. Please try again.',
          'Error',
        );
      },
    });
  }
  resetDepartmentForm() {
    this.Code = '';
    this.Name = '';
    this.description = '';
    this.active = true;
    this.disabled = false;
  }
  cancel() {
    this.router.navigate(['/panel/forms/view-department-list']);
  }
  loadSingleDepartment(publicId: string) {
    this.loader.show();
    this.FormSv.getDepartementById(publicId!).subscribe({
      next: (res: any) => {
        console.log('API response:', res.data);
        this.loader.hide();
        this.Code = res.data.code;
        this.Name = res.data.name;
        this.description = res.data.description;
        this.active = res.data.isActive;
      },
      error: () => {
        this.loader.hide();
        this.toastr.error('Failed to load department');
      },
    });
  }
  updateDepartment() {
    const payload = {
      code: this.Code,
      name: this.Name,
      description: this.description,
      active: this.active ? true : false,
    };
    this.loader.show();
    this.FormSv.UpdateDepartment(this.publicId!, payload).subscribe({
      next: () => {
        this.loader.hide();
        this.toastr.success('Department updated');
        this.resetDepartmentForm();
        setTimeout(() => {
          this.router.navigate(['/panel/forms/view-department-list']);
        }, 1500);
        console.log('Active from API:', this.active);
      },

      error: () => {
        this.loader.hide();
        this.toastr.error('Department Update failed');
      },
    });
  }
}
