import { Component, OnInit } from '@angular/core';
import { LoaderService } from '../../../../core/services/management-services/loader.service';
import { FormsService } from '../../Services/forms';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-shift',
  imports: [CommonModule, FormsModule],
  standalone: true,
  templateUrl: './shift.html',
  styleUrl: './shift.scss',
})
export class Shift implements OnInit {

  email: string = '';
  code: string = '';
  name: string = '';
  remarks: string = '';
  disabled: boolean = false;
  currentPage: number = 0; // page number
  pageSize: number = 100;
  publicId: string | null = null;
  isEditMode = false;
  active: boolean = true;
  days: any[] = [];

  constructor(
    private loader: LoaderService,
    private formsService: FormsService,
    private toastr: ToastrService,
    private router: Router,
    private route: ActivatedRoute,
  ) { }
  ngOnInit() {
    this.publicId = this.route.snapshot.paramMap.get('id');

    this.initializeDays();

    if (this.publicId) {
      this.isEditMode = true;
      this.loadSingleShift();
    }
  }


  initializeDays() {
    const weekDays = [
      'MONDAY',
      'TUESDAY',
      'WEDNESDAY',
      'THURSDAY',
      'FRIDAY',
      'SATURDAY',
      'SUNDAY',
    ];

    this.days = weekDays.map((day) => ({
      weekDay: day,
      startTime: '',
      endTime: '',
      breakHours: 0,
      isWeekOff: false,
    }));
  }
  loadSingleShift() {
    this.loader.show();
    this.formsService.getShiftById(this.publicId!).subscribe({
      next: (res: any) => {
        this.loader.hide();

        this.code = res.data.code;
        this.name = res.data.name;
        this.remarks = res.data.remarks;

        // ✅ FIXED
        console.log(res.data.active);
        this.active = res.data.isActive;
        if (res.data.days?.length) {
          this.days = res.data.days;
        } else {
          this.initializeDays();
        }
      },
      error: () => {
        this.loader.hide();
        this.toastr.error('Failed to load shift');
      },
    });
  }

  createShift() {
    if (!this.code || !this.name || !this.remarks) {
      this.toastr.error('Please fill in all required fields');
      return;
    }
    let payload = {
      code: this.code,
      name: this.name,
      remarks: this.remarks,
      active: this.active,
      days: this.days

    };
    this.loader.show();
    this.disabled = true;
    this.formsService.CreatenewShift(payload).subscribe({
      next: (response: any) => {
        this.loader.hide();
        this.toastr.success('Shift created successfully', 'Success');
        this.resetShiftForm();
        setTimeout(() => {
          this.router.navigate(['/panel/forms/view-shifts']);
        }, 1500);
      },
      error: (error: any) => {
        this.loader.hide();
        this.disabled = false;
        this.toastr.error(
          error.error.message || 'Failed to create shift. Please try again.',
          'Error',
        );
      },
    });
  }
  resetShiftForm() {
    this.code = '';
    this.name = '';
    this.remarks = '';
    this.active = true;
    this.disabled = false;
    this.days = [];
    this.initializeDays();
  }
  cancel() {
    this.router.navigate(['/panel/forms/view-shifts']);
  }

  updateShift() {
    const payload = {
      code: this.code,
      name: this.name,
      remarks: this.remarks,
      active: this.active,
      days: this.days
    };

    this.loader.show();

    this.formsService.updateShift(this.publicId!, payload).subscribe({
      next: () => {
        this.loader.hide();
        this.toastr.success('Shift updated');
        this.resetShiftForm();
        this.router.navigate(['/panel/forms/view-shifts']);
      },
      error: () => {
        this.loader.hide();
        this.toastr.error('Update failed');
      },
    });
  }

}
