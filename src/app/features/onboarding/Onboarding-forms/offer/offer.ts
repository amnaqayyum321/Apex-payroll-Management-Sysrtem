import { Component, OnInit } from '@angular/core';
import { FormsService } from '../../../forms/Services/forms';
import { OnboardingService } from '../../Services/onboarding';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LoaderService } from '../../../../core/services/management-services/loader.service';

@Component({
  selector: 'app-offer',
  imports: [CommonModule,FormsModule],
  templateUrl: './offer.html',
  styleUrl: './offer.scss',
})
export class Offers implements OnInit {

  code = '';
  name = '';
  applicationPublicId = '';
  offerDate = '';
  expiryDate = '';
  joiningDate = '';
  remarks = '';

  applications: any[] = [];
  payElements: any[] = [];

  salaryRows: any[] = [];

  publicId: string | null = null;
  isEditMode = false;

  constructor(
    private formsService: FormsService,
    private onboarding: OnboardingService,
    private toastr: ToastrService,
private route: ActivatedRoute,
    private router: Router,
    private loader: LoaderService
  ) {}

  ngOnInit() {
    this.loadApplications();
    this.loadPayElements();

    this.publicId = this.route.snapshot.paramMap.get('id');
    if (this.publicId) {
      this.isEditMode = true;
      this.loadOfferById();
    }

    this.addRow();
  }

  loadApplications() {
    this.onboarding
      .getAllCandidateApplications(0, 100)
      .subscribe((res: any) => {
        this.applications = res?.data?.content || res?.data || [];
      });
  }

  loadPayElements() {
    this.formsService
      .GetPayElement(0, 100, 'ALL')
      .subscribe((res: any) => {
        this.payElements = res?.data?.content || res?.data || [];
      });
  }

  addRow() {
    this.salaryRows.push({
      payElementPublicId: '',
      amount: 0,
      currency: 'PKR',
      payFrequency: 'MONTHLY',
      effectiveDate: new Date().toISOString().split('T')[0],
      isVariable: false,
      lineNumber: this.salaryRows.length + 1,
      status: 'ACTIVE',
      remarks: ''
    });
  }

  removeRow(index: number) {
    this.salaryRows.splice(index, 1);
  }

  createOffer() {

    if (!this.applicationPublicId) {
      this.toastr.error('Application is required');
      return;
    }

    const payload = {
      code: this.code,
      name: this.name,
      applicationPublicId: this.applicationPublicId,
      offerDate: this.offerDate,
      expiryDate: this.expiryDate,
      joiningDate: this.joiningDate,
      approvedByPublicId: null, // 👈 as required
      remarks: this.remarks,
      salaryRows: this.salaryRows
    };

    this.loader.show();

    this.onboarding.CreatenewOffer(payload).subscribe({
      next: () => {
        this.loader.hide();
        this.toastr.success('Offer Created Successfully');
        this.router.navigate(['/panel/recruitment/view-offers']);
      },
      error: (err) => {
        this.loader.hide();
        this.toastr.error(err.error?.message || 'Creation Failed');
      }
    });
  }

  updateOffer() {

    const payload = {
      code: this.code,
      name: this.name,
      applicationPublicId: this.applicationPublicId,
      offerDate: this.offerDate,
      expiryDate: this.expiryDate,
      joiningDate: this.joiningDate,
      approvedByPublicId: null,
      remarks: this.remarks,
      salaryRows: this.salaryRows
    };

    this.loader.show();

    this.onboarding.updateOffer(this.publicId!, payload).subscribe({
      next: () => {
        this.loader.hide();
        this.toastr.success('Updated Successfully');
        this.router.navigate(['/panel/recruitment/view-offers']);
      },
      error: () => {
        this.loader.hide();
        this.toastr.error('Update Failed');
      }
    });
  }

  loadOfferById() {
    this.loader.show();

    this.onboarding.getOfferById(this.publicId!).subscribe({
      next: (res: any) => {
        this.loader.hide();
        const data = res?.data;

        this.code = data.code;
        this.name = data.name;
        this.applicationPublicId = data.applicationPublicId;
        this.offerDate = data.offerDate;
        this.expiryDate = data.expiryDate;
        this.joiningDate = data.joiningDate;
        this.remarks = data.remarks;
        this.salaryRows = data.salaryRows || [];
      },
      error: () => {
        this.loader.hide();
        this.toastr.error('Failed to load offer');
      }
    });
  }

  resetForm() {
    this.code = '';
    this.name = '';
    this.applicationPublicId = '';
    this.offerDate = '';
    this.expiryDate = '';
    this.joiningDate = '';
    this.remarks = '';
    this.salaryRows = [];
    this.addRow();
  }

  cancel() {
    this.router.navigate(['/panel/recruitment/view-offers']);
  }
}
