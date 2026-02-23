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
  startDate: string | null = null;
  endDate: string | null = null;
  remarks = '';
  status: boolean = false;
  current = new Date();
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
      this.loadSinglePayPeriod(this.publicId);
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
      startDate: this.startDate,
      endDate: this.endDate,
      remarks: this.remarks,
      status: this.status ? 'ACTIVE' : 'INACTIVE',
    };
    console.log(payload);
    this.loader.show();
    this.disabled = true;
    this.FormSv.CreatePayperiod(payload).subscribe({
      next: (res: any) => {
        this.loader.hide();
        this.toastr.success('Payperiod created successfully', 'Success');
        this.resetPayperiodForm();
        setTimeout(() => {
          this.router.navigate(['/panel/forms/view-Pay-period-List']);
        }, 1500);
      },
      error: (error: any) => {
        this.loader.hide();
        this.disabled = false;
        this.toastr.error(
          error.error.message || 'Failed to create Payperiod. Please try again.',
          'Error',
        );
      },
    });
  }
  resetPayperiodForm() {
    this.Code = '';
    this.Name = '';
    this.description = '';
    this.status = false;
    this.remarks = '';
    this.disabled = false;
  }
  cancel() {
    this.router.navigate(['/panel/forms/view-Pay-period-List']);
  }
  loadSinglePayPeriod(publicId: string) {
    this.loader.show();
    this.FormSv.getPayperiodbyId(publicId!).subscribe({
      next: (res: any) => {
        this.loader.hide();
        this.Code = res.data.code;
        this.Name = res.data.name;
        this.description = res.data.description;
        this.status = res.data.status?.toUpperCase() === 'ACTIVE';
        this.remarks = res.data.remarks;
        this.startDate = res.data.startDate;
        this.endDate = res.data.endDate;
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
      remarks: this.remarks,
      status: this.status ? 'ACTIVE' : 'INACTIVE',
      startDate: this.startDate,
      endDate: this.endDate,
    };

    this.loader.show();

    this.FormSv.UpdatePayperiod(this.publicId!, payload).subscribe({
      next: () => {
        this.loader.hide();
        this.toastr.success('PayPeriod updated');
        this.resetPayperiodForm();
        setTimeout(() => {
          this.router.navigate(['/panel/forms/view-Pay-period-List']);
        }, 1500);
      },
      error: () => {
        this.loader.hide();
        this.toastr.error('PayPeriod Update failed');
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
  parseDate(dateStr: string | null): NgbDateStruct | null {
    if (!dateStr) return null;
    const d = new Date(dateStr);
    return {
      year: d.getFullYear(),
      month: d.getMonth() + 1,
      day: d.getDate(),
    };
  }
}
