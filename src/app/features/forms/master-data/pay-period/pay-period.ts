import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LoaderService } from '../../../../core/services/management-services/loader.service';
import { FormsService } from '../../Services/forms';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbDatepickerModule, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-pay-period',
  imports: [CommonModule, FormsModule, NgbDatepickerModule],
  templateUrl: './pay-period.html',
  styleUrl: './pay-period.scss',
})
export class PayPeriod {
  Code: string = '';
  Name: string = '';
  description: string = '';
  disabled: boolean = false;
  currentPage: number = 0; // page number
  pageSize: number = 100;
  publicId: string | null = null;
  isEditMode = false;
  startDate: NgbDateStruct | null = null;
  endDate: NgbDateStruct | null = null;
  remarks = '';
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
  createPayPeriod() {
    if (!this.Code || !this.Name) {
      this.toastr.error('Please fill in all required fields');
      return;
    }
    let payload = {
      code: this.Code,
      name: this.Name,
      startDate: this.formatDate(this.startDate),
      endDate: this.formatDate(this.endDate),
      remarks: this.remarks,
    };
    console.log(payload);
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

    this.disabled = false;
  }
  cancel() {
    this.router.navigate(['/panel/forms/view-Pay-period-List']);
  }
  loadSingleDepartment(publicId: string) {
    this.loader.show();
    this.FormSv.getDepartementById(publicId!).subscribe({
      next: (res: any) => {
        this.loader.hide();
        this.Code = res.data.code;
        this.Name = res.data.name;
        this.description = res.data.description;
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
      },
      error: () => {
        this.loader.hide();
        this.toastr.error('Department Update failed');
      },
    });
  }
  formatDate(date: NgbDateStruct | null): string | null {
    if (!date) return null;
    return `${date.year}-${String(date.month).padStart(2, '0')}-${String(date.day).padStart(
      2,
      '0',
    )}`;
  }
}
