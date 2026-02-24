import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { LoaderService } from '../../../../core/services/management-services/loader.service';
import { FormsService } from '../../Services/forms';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-work-schedule',
  imports: [CommonModule, FormsModule],
  templateUrl: './work-schedule.html',
  styleUrl: './work-schedule.scss',
})
export class WorkSchedule implements OnInit {

  remarks: string = '';
  active: boolean = true;

  payPeriodPublicId: string = '';
  shiftsList: any[] = [];
  payPeriodList: any[] = [];

  selectedShifts: string[] = []; // multiple shift publicIds

  publicId: string | null = null;
  isEditMode = false;

  days: any[] = [];

  dayTypes = ['WORKING_DAY', 'WEEKEND', 'HOLIDAY'];

  weekDays: string[] = [
    'MONDAY',
    'TUESDAY',
    'WEDNESDAY',
    'THURSDAY',
    'FRIDAY',
    'SATURDAY',
    'SUNDAY'
  ];

 

  constructor(
    private loader: LoaderService,
    private formsService: FormsService,
    private toastr: ToastrService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.publicId = this.route.snapshot.paramMap.get('id');

    this.loadDropdowns();
    this.initializeDays();

    if (this.publicId) {
      this.isEditMode = true;
      this.loadSingleWorkSchedule();
    }
  }

  loadDropdowns() {

    this.formsService.GetPayperiod(0, 100).subscribe(res => {
      this.payPeriodList = res?.data || [];
    });

    this.formsService.getAllShifts(0, 100).subscribe(res => {
      this.shiftsList = res?.data || [];
    });

  }

 initializeDays() {
  this.days = [];

  for (let i = 1; i <= 7; i++) {
    this.days.push({
      workDate: '',
      weekDay: '',   // 🔥 FIXED
      dayType: 'WORKING_DAY',
      holidayReason: '',
      shiftPublicId: ''
    });
  }
}

  // 🔹 CREATE
  createWorkSchedule() {

    const payload = {
payPeriodPublicId: this.payPeriodPublicId,
      remarks: this.remarks,
      active: this.active,
      days: this.days
    };

    this.loader.show();

    this.formsService.CreateWorkSchedule(payload).subscribe({
      next: () => {
        this.loader.hide();
        this.toastr.success('Work Schedule Created');
        this.router.navigate(['/panel/forms/view-work-schedule']);
      },
      error: (err) => {
        this.loader.hide();
        this.toastr.error(err.error.message);
      }
    });
  }

  // 🔹 UPDATE
  updateWorkSchedule() {

    const payload = {
      payPeriodPublicId: this.payPeriodPublicId,
      remarks: this.remarks,
      active: this.active,
      days: this.days
    };

    this.loader.show();

    this.formsService.updateWorkSchedule(this.publicId!, payload).subscribe({
      next: () => {
        this.loader.hide();
        this.toastr.success('Updated Successfully');
        this.router.navigate(['/panel/forms/view-work-schedule']);
      },
      error: () => {
        this.loader.hide();
        this.toastr.error('Update Failed');
      }
    });
  }

  resetShiftForm() {
    this.payPeriodPublicId = '';
    this.remarks = '';
    this.active = true;
    this.initializeDays();
  }

  cancel() {
    this.router.navigate(['/panel/forms/view-work-schedule']);
  }

  // 🔹 EDIT LOAD
  loadSingleWorkSchedule() {
    this.loader.show();

    this.formsService.getWorkScheduleById(this.publicId!).subscribe({
      next: (res: any) => {
        this.loader.hide();

        this.payPeriodPublicId = res.data.payPeriodPublicId;
        this.remarks = res.data.remarks;
        this.active = res.data.active;
        this.days = res.data.days;
      },
      error: () => {
        this.loader.hide();
        this.toastr.error('Failed to load');
      }
    });
  }

}
