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
  shiftPublicIds: string[] = [];
  shiftsList: any[] = [];
  payPeriodList: any[] = [];
  selectedShifts: any[] = [];


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

  if (this.publicId) {
    this.isEditMode = true;
    this.loadSingleWorkSchedule();
  } else {
    this.initializeDays(); // ✅ Only create mode
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
      dayName: '',   // ✅ change
      dayType: 'WORKING_DAY',
      remarks: ''    // ✅ change
    });
  }
}

  // 🔹 CREATE
 createWorkSchedule() {

  const payload = {
    payPeriodPublicId: this.payPeriodPublicId,
    remarks: this.remarks,
    active: this.active,
    shiftPublicIds: this.shiftPublicIds,
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

  const cleanedDays = this.removeDuplicateDates(this.days);

  const payload = {
    payPeriodPublicId: this.payPeriodPublicId,
    remarks: this.remarks,
    active: this.active,
    shiftPublicIds: this.shiftPublicIds,
    days: cleanedDays
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

      const data = res.data;

      this.payPeriodPublicId = data.payPeriodPublicId;
      this.remarks = data.remarks;
      this.active = data.isActive;

      // 🔥 shifts array se ids nikalo
      this.shiftPublicIds = data.shifts.map((s: any) => s.publicId);
      this.selectedShifts = data.shifts;

const mappedDays = data.days.map((d: any) => ({
  workDate: d.workDate,
  dayName: d.dayName,
  dayType: d.dayType,
  remarks: d.remarks || ''
}));

this.days = this.removeDuplicateDates(mappedDays);
   },
    error: () => {
      this.loader.hide();
      this.toastr.error('Failed to load');
    }
  });
}


onPayPeriodChange() {

  // 🔥 Edit mode me auto generate na kare
  if (this.isEditMode) return;

  const selectedPayPeriod = this.payPeriodList.find(
    p => p.publicId === this.payPeriodPublicId
  );

  if (!selectedPayPeriod) return;

  const start = new Date(selectedPayPeriod.startDate);
  const end = new Date(selectedPayPeriod.endDate);

  this.generateDates(start, end);
}

generateDates(start: Date, end: Date) {

  const newDays: any[] = [];

  let current = new Date(start);

  while (current <= end) {

    const formattedDate = current.toISOString().split('T')[0];

    newDays.push({
      workDate: formattedDate,
      dayName: this.getDayName(current),
      dayType: 'WORKING_DAY',
      remarks: ''
    });

    current.setDate(current.getDate() + 1);
  }

  this.days = newDays; // 🔥 Replace instead of push
}

trackByIndex(index: number, item: any) {
  return index;
}


getDayName(date: Date): string {

  const days = [
    'SUNDAY',
    'MONDAY',
    'TUESDAY',
    'WEDNESDAY',
    'THURSDAY',
    'FRIDAY',
    'SATURDAY'
  ];

  return days[date.getDay()];
}

addShift(event: any) {

  const shiftId = event.target.value;

  if (!shiftId) return;

  // Already selected check
  const alreadyExists = this.selectedShifts.find(
    s => s.publicId === shiftId
  );

  if (alreadyExists) return;

  const shiftObj = this.shiftsList.find(
    s => s.publicId === shiftId
  );

  if (shiftObj) {
    this.selectedShifts.push(shiftObj);
    this.shiftPublicIds.push(shiftObj.publicId);
  }

  // Reset dropdown
  event.target.value = '';
}


removeShift(publicId: string) {

  this.selectedShifts = this.selectedShifts.filter(
    s => s.publicId !== publicId
  );

  this.shiftPublicIds = this.shiftPublicIds.filter(
    id => id !== publicId
  );
}


removeDuplicateDates(days: any[]) {
  const uniqueMap = new Map<string, any>();

  days.forEach(day => {
    if (day.workDate) {
      uniqueMap.set(day.workDate, day);
    }
  });

  return Array.from(uniqueMap.values());
}
}
