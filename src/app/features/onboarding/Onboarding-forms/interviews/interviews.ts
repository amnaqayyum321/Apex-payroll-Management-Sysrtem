import { CommonModule } from '@angular/common';
import { Component, HostListener } from '@angular/core';
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

  // Dropdown state variables
  isApplicationDropdownOpen = false;
  isPanelDropdownOpen = false;
  isLocationDropdownOpen = false;
  isResultDropdownOpen = false;
  isStatusDropdownOpen = false;
  
  activeSessionIndex: number | null = null;
  activeLocationIndex: number | null = null;
  activeResultIndex: number | null = null;
  activeStatusIndex: number | null = null;
  
  selectedApplicationLabel = '';
  sessionPanelLabels: { [key: number]: string } = {};
  sessionLocationLabels: { [key: number]: string } = {};
  sessionResultLabels: { [key: number]: string } = {};
  sessionStatusLabels: { [key: number]: string } = {};

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

  // Dropdown Methods
toggleApplicationDropdown(event: Event) {
  event.stopPropagation();
  this.isApplicationDropdownOpen = !this.isApplicationDropdownOpen;
  this.closeOtherDropdowns(['application']);
}

  selectApplication(app: any, event: Event) {
    event.stopPropagation();
    this.applicationPublicId = app.publicId;
    this.selectedApplicationLabel = app.candidateName;
    this.isApplicationDropdownOpen = false;
    this.onApplicationChange();
  }

  togglePanelDropdown(event: Event, index: number) {
    event.stopPropagation();
    this.isPanelDropdownOpen = !this.isPanelDropdownOpen;
    this.activeSessionIndex = this.isPanelDropdownOpen ? index : null;
    this.closeOtherDropdowns(['panel']);
  }

  selectPanelForSession(panel: any, index: number, event: Event) {
    event.stopPropagation();
    this.sessions[index].panelPublicId = panel.publicId;
    this.sessionPanelLabels[index] = panel.name;
    this.isPanelDropdownOpen = false;
    this.activeSessionIndex = null;
  }

  getSelectedPanelLabel(index: number): string {
    return this.sessionPanelLabels[index] || '';
  }

  toggleLocationDropdown(event: Event, index: number) {
    event.stopPropagation();
    this.isLocationDropdownOpen = !this.isLocationDropdownOpen;
    this.activeLocationIndex = this.isLocationDropdownOpen ? index : null;
    this.closeOtherDropdowns(['location']);
  }

  selectLocation(location: string, index: number, event: Event) {
    event.stopPropagation();
    this.sessions[index].location = location;
    this.sessionLocationLabels[index] = location;
    this.isLocationDropdownOpen = false;
    this.activeLocationIndex = null;
  }

  getSelectedLocationLabel(index: number): string {
    return this.sessionLocationLabels[index] || '';
  }

  toggleResultDropdown(event: Event, index: number) {
    event.stopPropagation();
    this.isResultDropdownOpen = !this.isResultDropdownOpen;
    this.activeResultIndex = this.isResultDropdownOpen ? index : null;
    this.closeOtherDropdowns(['result']);
  }

  selectResult(result: string, index: number, event: Event) {
    event.stopPropagation();
    this.sessions[index].result = result;
    this.sessionResultLabels[index] = result;
    this.isResultDropdownOpen = false;
    this.activeResultIndex = null;
  }

  getSelectedResultLabel(index: number): string {
    return this.sessionResultLabels[index] || '';
  }

  toggleStatusDropdown(event: Event, index: number) {
    event.stopPropagation();
    this.isStatusDropdownOpen = !this.isStatusDropdownOpen;
    this.activeStatusIndex = this.isStatusDropdownOpen ? index : null;
    this.closeOtherDropdowns(['status']);
  }

  selectStatus(status: string, index: number, event: Event) {
    event.stopPropagation();
    this.sessions[index].status = status;
    this.sessionStatusLabels[index] = status;
    this.isStatusDropdownOpen = false;
    this.activeStatusIndex = null;
  }

  getSelectedStatusLabel(index: number): string {
    return this.sessionStatusLabels[index] || '';
  }

  private closeOtherDropdowns(except?: string[]) {
    if (!except || !except.includes('application')) this.isApplicationDropdownOpen = false;
    if (!except || !except.includes('panel')) this.isPanelDropdownOpen = false;
    if (!except || !except.includes('location')) this.isLocationDropdownOpen = false;
    if (!except || !except.includes('result')) this.isResultDropdownOpen = false;
    if (!except || !except.includes('status')) this.isStatusDropdownOpen = false;
  }

  @HostListener('document:click', ['$event'])
  closeAllDropdowns(event?: Event) {
    this.isApplicationDropdownOpen = false;
    this.isPanelDropdownOpen = false;
    this.isLocationDropdownOpen = false;
    this.isResultDropdownOpen = false;
    this.isStatusDropdownOpen = false;
    this.activeSessionIndex = null;
    this.activeLocationIndex = null;
    this.activeResultIndex = null;
    this.activeStatusIndex = null;
  }

  loadApplications() {
    this.onBoardingSV.getAllCandidateApplications(this.currentPage, this.pageSize).subscribe({
      next: (res: any) => {
        if (res.success) {
          this.applicationList = res.data;
          if (this.publicId) {
            this.loadSingleInterview(this.publicId);
          }
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
              
              // Set labels for sessions
              data.sessions.forEach((session: any, idx: number) => {
                const panel = this.panelList.find(p => p.publicId === session.panelPublicId);
                if (panel) this.sessionPanelLabels[idx] = panel.name;
                this.sessionLocationLabels[idx] = session.location;
                this.sessionResultLabels[idx] = session.result;
                this.sessionStatusLabels[idx] = session.status;
              });
              
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
        
        const application = this.applicationList.find(a => a.publicId === data.applicationPublicId);
        this.selectedApplicationLabel = application ? application.candidateName : '';
        
        this.remarks = data.remarks;
        this.sessions = [...(data.sessions || []), this.newSession()];
        
        // Set labels for sessions
        data.sessions.forEach((session: any, idx: number) => {
          const panel = this.panelList.find(p => p.publicId === session.panelPublicId);
          if (panel) this.sessionPanelLabels[idx] = panel.name;
          this.sessionLocationLabels[idx] = session.location;
          this.sessionResultLabels[idx] = session.result;
          this.sessionStatusLabels[idx] = session.status;
        });
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
      // Clean up labels
      delete this.sessionPanelLabels[index];
      delete this.sessionLocationLabels[index];
      delete this.sessionResultLabels[index];
      delete this.sessionStatusLabels[index];
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

  isFormValid(): boolean {
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

  createInterview() {
    this.loader.show();
    this.disabled = true;
    const payload = this.buildPayload();

    this.onBoardingSV.CreatenewInterviews(payload).subscribe({
      next: (res: any) => {
        this.loader.hide();
        this.disabled = false;
        this.publicId = res.data.publicId;
        this.isEditMode = true;
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

  updateInterview() {
    this.loader.show();
    this.disabled = true;
    const payload = this.buildUpdatePayload();
    this.onBoardingSV.updateInterviews(this.publicId!, payload).subscribe({
      next: (res: any) => {
        this.loader.hide();
        this.disabled = false;
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
    this.selectedApplicationLabel = '';
    this.sessionPanelLabels = {};
    this.sessionLocationLabels = {};
    this.sessionResultLabels = {};
    this.sessionStatusLabels = {};
  }

  cancel() {
    this.router.navigate(['/panel/onboarding/view-interviews-list']);
  }
}