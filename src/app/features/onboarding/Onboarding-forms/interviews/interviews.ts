import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LoaderService } from '../../../../core/services/management-services/loader.service';
import { OnboardingService } from '../../Services/onboarding';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-interviews',
  imports: [CommonModule, FormsModule],
  templateUrl: './interviews.html',
  styleUrl: './interviews.scss',
})
export class Interviews {
  code: string = '';
  name: string = '';
  applicationPublicId: string = '';
  remarks: string = '';
  sessions: any[] = [];
  applicationList: any[] = [];
  panelList: any[] = [];
  disabled: boolean = false;
  publicId: string | null = null;
  isEditMode: boolean = false;
  currentPage: number = 0;
  pageSize: number = 100;
  locationOptions = ['ONSITE', 'REMOTE', 'HYBRID'];
  resultOptions = ['SCHEDULED', 'PASSED', 'FAILED', 'CANCELLED'];
  statusOptions = ['ACTIVE', 'INACTIVE'];

  constructor(
    private loader: LoaderService,
    private onBoardingSV: OnboardingService,
    private toastr: ToastrService,
    private router: Router,
    private route: ActivatedRoute,
  ) {}

  ngOnInit() {
    this.publicId = this.route.snapshot.paramMap.get('id');
    if (this.publicId) {
      this.isEditMode = true;
    }
    this.sessions = [this.newSession()];
    this.loadApplications();
    this.loadPanels();
  }

  newSession() {
    return {
      panelPublicId: '',
      interviewDate: '',
      startTime: '',
      endTime: '',
      location: 'ONSITE',
      meetingUrl: '',
      result: 'SCHEDULED',
      lineNumber: 0,
      status: 'ACTIVE',
      remarks: '',
    };
  }

  loadApplications() {
    this.onBoardingSV.getAllCandidateApplications(this.currentPage, this.pageSize).subscribe({
      next: (res: any) => {
        if (res.success) {
          this.applicationList = res.data;
          console.log('Application List', res);
        }
        if (this.publicId) {
          this.loadSingleInterview(this.publicId);
        }
      },
      error: () => {
        if (this.publicId) {
          this.loadSingleInterview(this.publicId);
        }
      },
    });
  }

  loadPanels() {
    this.onBoardingSV.getAllInterviewPanel(this.currentPage, this.pageSize).subscribe(
      (res: any) => {
        if (res.success) {
          this.panelList = res.data;
          console.log('Panel', res);
        }
      },
      (error: any) => {
        console.log(error);
      },
    );
  }
  onApplicationChange() {
    if (!this.applicationPublicId) {
      this.isEditMode = false;
      this.publicId = null;
      this.sessions = [this.newSession()];
      return;
    }

    this.loader.show();
    this.onBoardingSV.getAllInterviews(0, 100).subscribe({
      next: (res: any) => {
        const list = res.data || [];
        const interview = list.find((i: any) => i.applicationPublicId === this.applicationPublicId);

        if (interview) {
          this.onBoardingSV.getInterviewsById(interview.publicId).subscribe({
            next: (detailRes: any) => {
              this.loader.hide();
              const data = detailRes.data;
              this.isEditMode = true;
              this.publicId = data.publicId;
              this.code = data.code;
              this.name = data.name;
              this.remarks = data.remarks;
              this.sessions = [...(data.sessions || []), this.newSession()];
              this.toastr.info('Existing interview found — new session added below');
            },
            error: () => {
              this.loader.hide();
              this.toastr.error('Failed to load interview details');
            },
          });
        } else {
          this.loader.hide();
          this.isEditMode = false;
          this.publicId = null;
          this.sessions = [this.newSession()];
          this.code = '';
          this.name = '';
          this.remarks = '';
        }
      },
      error: () => {
        this.loader.hide();
        this.toastr.error('Failed to check existing interview');
      },
    });
  }

  loadSingleInterview(publicId: string) {
    this.loader.show();
    this.onBoardingSV.getInterviewsById(publicId).subscribe({
      next: (res: any) => {
        this.loader.hide();
        const data = res.data;
        this.code = data.code;
        this.name = data.name;
        this.applicationPublicId = data.applicationPublicId;
        this.remarks = data.remarks;
        this.sessions = [...(data.sessions || []), this.newSession()];
      },
      error: () => {
        this.loader.hide();
        this.toastr.error('Failed to load interview');
      },
    });
  }

  addSession() {
    const hasNewSession = this.sessions.some((s) => !s.publicId);
    if (hasNewSession) {
      this.toastr.info('Please fill the existing new session first');
      return;
    }
    this.sessions.push(this.newSession());
  }

  removeSession(index: number) {
    if (this.sessions.length > 1) {
      this.sessions.splice(index, 1);
    } else {
      this.toastr.error('At least one session is required');
    }
  }

  formatTime(time: string): string {
    if (!time) return '';
    return time.length === 5 ? time + ':00' : time;
  }

  buildPayload() {
    return {
      code: this.code,
      name: this.name,
      applicationPublicId: this.applicationPublicId,
      remarks: this.remarks,
      sessions: this.sessions.map((s) => ({
        ...s,
        startTime: this.formatTime(s.startTime),
        endTime: this.formatTime(s.endTime),
      })),
    };
  }

  buildUpdatePayload() {
    return {
      code: this.code,
      name: this.name,
      applicationPublicId: this.applicationPublicId,
      remarks: this.remarks,
      sessions: this.sessions.map((s) => ({
        ...s,
        startTime: this.formatTime(s.startTime),
        endTime: this.formatTime(s.endTime),
      })),
    };
  }
  // isFormValid(): boolean {
  //   if (!this.code || !this.name || !this.applicationPublicId) {
  //     this.toastr.error('Please fill in all required fields');
  //     return false;
  //   }

  //   const newSessions = this.isEditMode ? this.sessions.filter((s) => !s.publicId) : this.sessions;

  //   if (newSessions.length === 0) {
  //     this.toastr.error('Please add at least one new session');
  //     return false;
  //   }

  //   const invalidSessions = newSessions.filter(
  //     (s) => !s.panelPublicId || !s.startTime || !s.endTime || !s.interviewDate,
  //   );

  //   if (invalidSessions.length > 0) {
  //     this.toastr.error('Please fill in all required session fields');
  //     return false;
  //   }

  //   return true;
  // }
  isFormValid(): boolean {
    // -------- MAIN FORM VALIDATION --------
    if (!this.code?.trim()) {
      this.toastr.error('Interview Code is required');
      return false;
    }

    if (!this.name?.trim()) {
      this.toastr.error('Interview Name is required');
      return false;
    }

    if (!this.applicationPublicId) {
      this.toastr.error('Candidate selection is required');
      return false;
    }

    if (!this.sessions || this.sessions.length === 0) {
      this.toastr.error('At least one interview session is required');
      return false;
    }

    const toMinutes = (t: string) => {
      const [h, m] = t.split(':').map(Number);
      return h * 60 + m;
    };
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const urlPattern = /^(https?:\/\/)[^\s$.?#].[^\s]*$/m;
    for (let i = 0; i < this.sessions.length; i++) {
      const s = this.sessions[i];

      if (!s.panelPublicId) {
        this.toastr.error(`Session ${i + 1}: Interviewer is required`);
        return false;
      }

      if (!s.interviewDate) {
        this.toastr.error(`Session ${i + 1}: Interview Date is required`);
        return false;
      }
      const [year, month, day] = s.interviewDate.split('-').map(Number);
      const interviewDate = new Date(year, month - 1, day);

      if (interviewDate < today) {
        this.toastr.error(`Session ${i + 1}: Interview date cannot be in the past`);
        return false;
      }
      if (!s.startTime) {
        this.toastr.error(`Session ${i + 1}: Start Time is required`);
        return false;
      }
      if (!s.endTime) {
        this.toastr.error(`Session ${i + 1}: End Time is required`);
        return false;
      }
      if (toMinutes(s.startTime) >= toMinutes(s.endTime)) {
        this.toastr.error(`Session ${i + 1}: End Time must be greater than Start Time`);
        return false;
      }

      if (!s.location) {
        this.toastr.error(`Session ${i + 1}: Interview Location is required`);
        return false;
      }
      if (s.location === 'REMOTE' && !s.meetingUrl?.trim()) {
        this.toastr.error(`Session ${i + 1}: Meeting URL required for remote interview`);
        return false;
      }

      if (s.meetingUrl) {
        if (!urlPattern.test(s.meetingUrl)) {
          this.toastr.error(`Session ${i + 1}: Invalid Meeting URL`);
          return false;
        }
      }
      if (s.remarks && s.remarks.length > 500) {
        this.toastr.error(`Session ${i + 1}: Remarks cannot exceed 500 characters`);
        return false;
      }
      for (let j = i + 1; j < this.sessions.length; j++) {
        const next = this.sessions[j];

        if (
          s.panelPublicId === next.panelPublicId &&
          s.interviewDate === next.interviewDate &&
          toMinutes(s.startTime) === toMinutes(next.startTime)
        ) {
          this.toastr.error(`Session ${i + 1}: Duplicate interview slot for same interviewer`);
          return false;
        }
      }
    }

    return true;
  }
  saveInterview() {
    if (!this.isFormValid()) return;

    if (this.isEditMode && this.publicId) {
      this.updateInterview();
    } else {
      this.createInterview();
    }
  }

  // ---- Create ----
  createInterview() {
    this.loader.show();
    this.disabled = true;
    const payload = this.buildPayload();
    console.log('Create payload:', JSON.stringify(payload, null, 2));

    this.onBoardingSV.CreatenewInterviews(payload).subscribe({
      next: (res: any) => {
        this.loader.hide();
        this.disabled = false;
        this.publicId = res.data.publicId;
        this.isEditMode = true;
        console.log('Create success:', res);
        this.toastr.success('Interview created successfully');
        setTimeout(() => {
          this.router.navigate(['/panel/onboarding/view-interviews-list']);
        }, 1500);
      },
      error: (error: any) => {
        this.loader.hide();
        this.disabled = false;
        this.toastr.error(error.error?.message || 'Failed to create Interview');
      },
    });
  }

  // ---- Update ----
  updateInterview() {
    this.loader.show();
    this.disabled = true;
    const payload = this.buildUpdatePayload();
    console.log('Update payload:', JSON.stringify(payload, null, 2));
    this.onBoardingSV.updateInterviews(this.publicId!, payload).subscribe({
      next: (res: any) => {
        this.loader.hide();
        this.disabled = false;
        console.log('Update success:', res);
        this.toastr.success('Interview session updated successfully');
        setTimeout(() => {
          this.router.navigate(['/panel/onboarding/view-interviews-list']);
        }, 1500);
      },
      error: (error: any) => {
        this.loader.hide();
        this.disabled = false;
        this.toastr.error(error.error?.message || 'Failed to update Interview');
      },
    });
  }

  resetForm() {
    this.code = '';
    this.name = '';
    this.applicationPublicId = '';
    this.remarks = '';
    this.sessions = [this.newSession()];
    this.disabled = false;
    this.isEditMode = false;
    this.publicId = null;
  }

  cancel() {
    this.router.navigate(['/panel/onboarding/view-interviews-list']);
  }
}
