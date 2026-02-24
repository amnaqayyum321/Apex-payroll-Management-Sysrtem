import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LoaderService } from '../../../../core/services/management-services/loader.service';
import { ToastrService } from 'ngx-toastr';
import { FormsService } from '../../Services/forms';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-employees-grade',
  imports: [CommonModule, FormsModule],
  templateUrl: './employees-grade.html',
  styleUrl: './employees-grade.scss',
})
export class EmployeesGrade {
    code: string = '';
  name: string = '';
  description: string = '';
   disabled: boolean = false;
  currentPage: number = 0; // page number
  pageSize: number = 100;
  publicId: string | null = null;
  isEditMode = false;
    active: boolean = true;

  constructor(
    private loader: LoaderService,
    private formsService: FormsService,
    private toastr: ToastrService,
    private router: Router,
    private route: ActivatedRoute,
  ) {}
  ngOnInit() {
    // this.loader.show();
    this.publicId = this.route.snapshot.paramMap.get('id');

    if (this.publicId) {
      this.isEditMode = true;
      this.loadSingleEmployeeGrade();
    }
  }

  loadSingleEmployeeGrade() {
    this.loader.show();
    this.formsService.getEmployeeGradeById(this.publicId!).subscribe({
      next: (res: any) => {
        this.loader.hide();
        this.code = res.data.code;
        this.name = res.data.name;
        this.description = res.data.description;
        this.active = res.data.isActive;
      },
      error: () => {
        this.loader.hide();
        this.toastr.error('Failed to load designation');
      },
    });
  }

  createEmployeesGrde() {
    if (!this.code || !this.name || !this.description) {
      this.toastr.error('Please fill in all required fields');
      return;
    }
    let payload = {
      code: this.code,
      name: this.name,
      description: this.description,
      active: this.active,
      
    };
    this.loader.show();
    this.disabled = true;
    this.formsService.CreateEmployeeGrade(payload).subscribe({
      next: (response: any) => {
        this.loader.hide();
        this.toastr.success('Employee Grade created successfully', 'Success');
        this.resetEmployeeGradeForm();
        setTimeout(() => {
          this.router.navigate(['/panel/forms/view-employees-grade-list']);
        }, 1500);
      },
      error: (error: any) => {
        this.loader.hide();
          this.disabled = false;
        this.toastr.error(
          error.error.message || 'Failed to create employee grade. Please try again.',
          'Error',
        );
      },
    });
  }
  resetEmployeeGradeForm() {
    this.code = '';
    this.name = '';
    this.description = '';
     this.active = true;
    this.disabled = false;

  }
  cancel() {
    this.router.navigate(['/panel/forms/view-employees-grade-list']);
  }

  updateEmployeeGrade() {
    const payload = {
      code: this.code,
      name: this.name,
      description: this.description,
      active: this.active ? true : false,
    };

    this.loader.show();

    this.formsService.UpdateEmployeeGrade(this.publicId!, payload).subscribe({
      next: () => {
        this.loader.hide();
        this.toastr.success('Employee Grade updated');
        this.resetEmployeeGradeForm();
        this.router.navigate(['/panel/forms/view-employees-grade-list']);
      },
      error: () => {
        this.loader.hide();
        this.toastr.error('Update failed');
      },
    });
  }

}
