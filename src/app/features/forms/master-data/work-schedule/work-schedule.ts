import { Component, OnInit, ViewChild, ElementRef, HostListener } from '@angular/core';
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

  isPayPeriodDropdownOpen = false;
  selectedPayPeriodName: string = '';

  isShiftDropdownOpen = false;
  selectedShiftName: string = ''; // optional, for display

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

  @ViewChild('payPeriodDropdown') payPeriodDropdownRef!: ElementRef;
@ViewChild('shiftDropdown') shiftDropdownRef!: ElementRef;

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
      this.initializeDays();
    }
  }

  // --- Pay Period dropdown ---
  togglePayPeriodDropdown(event?: Event) {
    if (event) {
      event.stopPropagation();
    }
    this.isPayPeriodDropdownOpen = !this.isPayPeriodDropdownOpen;
  }

  selectPayPeriod(period: any, event?: Event) {
    if (event) {
      event.stopPropagation();
    }
    this.payPeriodPublicId = period.publicId;
    this.selectedPayPeriodName = period.name;
    this.isPayPeriodDropdownOpen = false;
    this.onPayPeriodChange();
  }

  setSelectedPayPeriodNameFromId() {
    if (this.payPeriodPublicId && this.payPeriodList.length > 0) {
      const found = this.payPeriodList.find(p => p.publicId === this.payPeriodPublicId);
      if (found) {
        this.selectedPayPeriodName = found.name;
      }
    }
  }

  // --- Shifts dropdown ---
  toggleShiftDropdown(event?: Event) {
    if (event) {
      event.stopPropagation();
    }
    this.isShiftDropdownOpen = !this.isShiftDropdownOpen;
  }

  selectShift(shift: any, event?: Event) {
    if (event) {
      event.stopPropagation();
    }
    this.isShiftDropdownOpen = false;

    // Check if already selected
    const alreadyExists = this.selectedShifts.find(s => s.publicId === shift.publicId);
    if (alreadyExists) return;

    this.selectedShifts.push(shift);
    this.shiftPublicIds.push(shift.publicId);
  }

  removeShift(publicId: string) {
    this.selectedShifts = this.selectedShifts.filter(s => s.publicId !== publicId);
    this.shiftPublicIds = this.shiftPublicIds.filter(id => id !== publicId);
  }

  // --- Load dropdowns ---
  loadDropdowns() {
  this.formsService.GetPayperiod(0, 100).subscribe({
    next: (res) => {
      console.log('PayPeriod response:', res);
      this.payPeriodList = res?.data || [];
      this.setSelectedPayPeriodNameFromId(); // in case edit mode already set id
    },
    error: (err) => console.error('PayPeriod error:', err)
  });

this.formsService.getAllShifts(0, 100).subscribe({
  next: (res) => {
    console.log('Shifts response:', res);
    const allShifts = res?.data || [];
    this.shiftsList = allShifts; // show all shifts
  },
  error: (err) => console.error('Shifts error:', err)
});
}

  // --- Days handling ---
  initializeDays() {
    this.days = [];
    for (let i = 1; i <= 7; i++) {
      this.days.push({
        workDate: '',
        dayName: '',
        dayType: 'WORKING_DAY',
        remarks: ''
      });
    }
  }

  onPayPeriodChange() {
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

    this.days = newDays;
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

  trackByIndex(index: number, item: any) {
    return index;
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

  // --- CRUD operations ---
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

  loadSingleWorkSchedule() {
    this.loader.show();

    this.formsService.getWorkScheduleById(this.publicId!).subscribe({
      next: (res: any) => {
        this.loader.hide();

        const data = res.data;

        this.payPeriodPublicId = data.payPeriodPublicId;
        this.setSelectedPayPeriodNameFromId(); // try to set name from list (if loaded)

        this.remarks = data.remarks;
        this.active = data.isActive;

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

  resetShiftForm() {
    this.payPeriodPublicId = '';
    this.selectedPayPeriodName = '';
    this.remarks = '';
    this.active = true;
    this.initializeDays();
    this.selectedShifts = [];
    this.shiftPublicIds = [];
  }

  cancel() {
    this.router.navigate(['/panel/forms/view-work-schedule']);
  }

  @HostListener('document:click', ['$event'])
onDocumentClick(event: MouseEvent) {
  const target = event.target as HTMLElement;

  if (this.payPeriodDropdownRef && !this.payPeriodDropdownRef.nativeElement.contains(target)) {
    this.isPayPeriodDropdownOpen = false;
  }

  if (this.shiftDropdownRef && !this.shiftDropdownRef.nativeElement.contains(target)) {
    this.isShiftDropdownOpen = false;
  }
}
}