import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { OnboardingService } from '../../Services/onboarding';
import { LoaderService } from '../../../../core/services/management-services/loader.service';

export interface InterviewSession {
  publicId: string;
  panelPublicId: string;
  panelName: string;
  interviewDate: string;
  startTime: string;
  endTime: string;
  location: string;
  result: string;
  remarks: string;
  candidateName?: string;
  interviewName?: string;
  interviewPublicId?: string;
}

@Component({
  selector: 'app-interview-feedback',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './interview-feedback.html',
  styleUrls: ['./interview-feedback.scss'],
})
export class InterviewFeedback implements OnInit {
  panels: any[] = [];
  sessions: InterviewSession[] = [];
  selectedPanelId: string = '';
  selectedSessionId: string = '';
  feedback = {
    score: null as number | null,
    remarks: '',
    notes: '',
  };
  scorePct = 0;
  currentPage: number = 0;
  pageSize: number = 100;
  isLoadingSessions: boolean = false;

  constructor(
    private onboardingService: OnboardingService,
    private toastr: ToastrService,
    private loader: LoaderService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    console.log('✅ InterviewFeedback Component Initialized');
    this.loadPanels();
  }
  loadPanels(): void {
    this.loader.show();
    this.onboardingService.getAllInterviewPanel(this.currentPage, this.pageSize).subscribe({
      next: (res: any) => {
        this.loader.hide();
        const allPanels: any[] = res?.data ?? [];
        this.panels = allPanels.filter((panel: any) =>
          panel.members?.some((member: any) => member.status === 'ACTIVE'),
        );
        this.panels.forEach((p: any) => {
          p.members = p.members.filter((m: any) => m.status === 'ACTIVE');
        });
      },
      error: (err: any) => {
        this.loader.hide();
        this.toastr.error(err?.error?.message || 'Failed to load panels');
      },
    });
  }
  onPanelChange(): void {
    this.selectedSessionId = '';
    this.sessions = [];
    if (!this.selectedPanelId) {
      console.log('⚠️ No panel selected, returning');
      return;
    }
    this.isLoadingSessions = true;
    this.loader.show();

    this.onboardingService.getAllInterviews(0, 100).subscribe({
      next: (res: any) => {
        this.loader.hide();
        this.isLoadingSessions = false;
        const allInterviews: any[] = res?.data ?? [];
        const matchedSessions: InterviewSession[] = [];
        allInterviews.forEach((interview: any) => {
          const sessions: any[] = interview.sessions ?? [];
          sessions.forEach((s: any) => {
            const isMatch = String(s.panelPublicId).trim() === String(this.selectedPanelId).trim();
            console.log(
              `   Session: ${s.publicId} | panelPublicId: "${s.panelPublicId}" | Match: ${isMatch}`,
            );

            if (isMatch) {
              console.log(
                `   ✅ MATCHED! Candidate: ${interview.candidateName}, Date: ${s.interviewDate}`,
              );
              matchedSessions.push({
                publicId: s.publicId,
                panelPublicId: s.panelPublicId,
                panelName: s.panelName ?? '',
                interviewDate: s.interviewDate ? this.formatDate(s.interviewDate) : '',
                startTime: s.startTime ? this.formatTime(s.startTime) : '',
                endTime: s.endTime ? this.formatTime(s.endTime) : '',
                location: s.location ?? '',
                result: s.result ?? '',
                remarks: s.remarks ?? '',
                candidateName: interview.candidateName ?? '',
                interviewName: interview.name ?? '',
                interviewPublicId: interview.publicId ?? '',
              });
            }
          });
        });

        this.sessions = matchedSessions;

        if (this.sessions.length === 0) {
          this.toastr.info('No sessions found in this Panel');
        }
      },
      error: (err: any) => {
        this.loader.hide();
        this.isLoadingSessions = false;
        this.toastr.error(err?.error?.message || 'Failed to load sessions');
      },
    });
  }
  onScoreChange(): void {
    const val = Number(this.feedback.score);
    this.scorePct = Math.min(Math.max(val, 0), 100);
  }

  getScoreColor(): string {
    if (this.scorePct >= 75) return '#22c55e';
    if (this.scorePct >= 50) return '#f59e0b';
    if (this.scorePct >= 25) return '#f97316';
    return '#ef4444';
  }

  getScoreLabel(): string {
    if (this.scorePct >= 75) return 'Excellent';
    if (this.scorePct >= 50) return 'Good';
    if (this.scorePct >= 25) return 'Average';
    return 'Poor';
  }
  submitFeedback(): void {
    console.log('   Payload:', {
      score: this.feedback.score,
      remarks: this.feedback.remarks,
      notes: this.feedback.notes,
    });

    if (!this.selectedPanelId) {
      this.toastr.warning('Please select a panel');
      return;
    }
    if (!this.selectedSessionId) {
      this.toastr.warning('Please select a session');
      return;
    }
    if (!this.feedback.score || this.feedback.score <= 0) {
      this.toastr.warning('Please enter a valid score (1–100)');
      return;
    }
    if (this.feedback.score > 100) {
      this.toastr.warning('Score Cannot be more than 100');
      return;
    }

    this.loader.show();

    this.onboardingService
      .CreatenInterviewsFeedback(this.selectedSessionId, {
        score: this.feedback.score,
        remarks: this.feedback.remarks,
        notes: this.feedback.notes,
      })
      .subscribe({
        next: (response: any) => {
          this.loader.hide();
          this.toastr.success('Feedback submitted successfully');
          this.resetForm();
        },
        error: (err: any) => {
          this.loader.hide();
          const msg = err?.error?.message || 'Submission failed';
          if (err?.error?.actionCode === 'BAD400' && msg.includes('not an active member')) {
            this.sessions = this.sessions.filter((s) => s.publicId !== this.selectedSessionId);
            this.selectedSessionId = '';
            this.toastr.warning(
              'You are not panel member of this session. Please select another session',
            );
          } else {
            this.toastr.error(msg);
          }
        },
      });
  }

  cancel(): void {
    console.log('🔙 Cancel clicked');
    this.router.navigate(['/panel/onboarding/view-interview-feedback-list']);
  }

  private resetForm(): void {
    console.log('🔄 Resetting form');
    this.selectedPanelId = '';
    this.selectedSessionId = '';
    this.sessions = [];
    this.feedback = { score: null, remarks: '', notes: '' };
    this.scorePct = 0;
  }
  formatDate(dateString: string): string {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  }

  formatTime(timeString: string): string {
    if (!timeString) return '';
    return timeString.substring(0, 5);
  }
}
