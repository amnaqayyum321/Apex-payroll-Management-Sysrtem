import { Component } from '@angular/core';
import { LoaderService } from '../../../../core/services/management-services/loader.service';
import { FormsService } from '../../Services/forms';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-employee-category',
  imports: [CommonModule, FormsModule],
  templateUrl: './employee-category.html',
  styleUrl: './employee-category.scss',
})
export class EmployeeCategory {
  Code: string = '';
  Name: string = '';
  elementType: string = '';
  elementCategory: string = '';
  elementNature: string = '';
  description: string = '';
  disabled: boolean = false;
  currentPage: number = 0; // page number
  pageSize: number = 100;
  publicId: string | null = null;
  isEditMode = false;
  active: boolean = false;
  taxable: boolean = false;

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
      this.loadSingleEmployeeCategory(this.publicId);
    }
  }
  createEmployeeCategory() {
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
    this.FormSv.CreateEmployeeCaterogy(payload).subscribe({
      next: (res: any) => {
        this.loader.hide();
        this.toastr.success('Employee Category created successfully', 'Success');
        this.resetEmployeeCategoryForm();
        setTimeout(() => {
          this.router.navigate(['/panel/forms/view-employee-category-list']);
        }, 1500);
      },
      error: (error: any) => {
        this.loader.hide();
        this.disabled = false;
        this.toastr.error(
          error.error.message || 'Failed to create Employee Category. Please try again.',
          'Error',
        );
      },
    });
  }
  resetEmployeeCategoryForm() {
    this.Code = '';
    this.Name = '';
    this.description = '';
    this.active = true;
    this.disabled = false;
  }
  cancel() {
    this.router.navigate(['/panel/forms/view-employee-category-list']);
  }
  loadSingleEmployeeCategory(publicId: string) {
    this.loader.show();
    this.FormSv.getEmployeeCaterogyById(publicId!).subscribe({
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
        this.toastr.error('Failed to load Employee Category');
      },
    });
  }
  updateEmployeeCategory() {
    const payload = {
      code: this.Code,
      name: this.Name,
      description: this.description,

      active: this.active,
    };
    this.loader.show();
    this.FormSv.UpdateEmployeeCaterogy(this.publicId!, payload).subscribe({
      next: () => {
        this.loader.hide();
        this.toastr.success('Employee Category updated');
        this.resetEmployeeCategoryForm();
        setTimeout(() => {
          this.router.navigate(['/panel/forms/view-employee-category-list']);
        }, 1500);
        console.log('Active from API:', this.active);
      },

      error: () => {
        this.loader.hide();
        this.toastr.error('Employee Category Update failed');
      },
    });
  }
}
