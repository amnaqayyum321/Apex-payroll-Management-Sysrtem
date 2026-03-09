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
  imports: [CommonModule, FormsModule],
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
    private loader: LoaderService,
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
    this.onboarding.getAllCandidateApplications(0, 100).subscribe((res: any) => {
      this.applications = res?.data?.content || res?.data || [];
    });
  }

  loadPayElements() {
    this.formsService.GetPayElement(0, 100, 'ALL').subscribe((res: any) => {
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
      remarks: '',
    });
  }

  removeRow(index: number) {
    this.salaryRows.splice(index, 1);
  }
  validateForm(): boolean {
    if (!this.code?.trim()) {
      this.toastr.error('Offer Code is required');
      return false;
    }

    if (!this.name?.trim()) {
      this.toastr.error('Offer Name is required');
      return false;
    }
    if (!this.applicationPublicId) {
      this.toastr.error('Candidate selection is required');
      return false;
    }
    if (!this.offerDate) {
      this.toastr.error('Offer Date is required');
      return false;
    }
    if (!this.expiryDate) {
      this.toastr.error('Expiry Date is required');
      return false;
    }
    if (!this.joiningDate) {
      this.toastr.error('Joining Date is required');
      return false;
    }
    const parseDate = (d: string) => {
      const [y, m, day] = d.split('-').map(Number);
      return new Date(y, m - 1, day);
    };
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const offer = parseDate(this.offerDate);
    const expiry = parseDate(this.expiryDate);
    const joining = parseDate(this.joiningDate);
    if (!this.isEditMode && offer < today) {
      this.toastr.error('Offer Date cannot be in the past');
      return false;
    }

    if (expiry <= offer) {
      this.toastr.error('Expiry Date must be greater than Offer Date');
      return false;
    }

    if (joining < offer) {
      this.toastr.error('Joining Date cannot be before Offer Date');
      return false;
    }
    if (this.remarks && this.remarks.length > 500) {
      this.toastr.error('Remarks cannot exceed 500 characters');
      return false;
    }
    if (!this.salaryRows || this.salaryRows.length === 0) {
      this.toastr.error('At least one salary component is required');
      return false;
    }
    const usedElements = new Set();

    for (let i = 0; i < this.salaryRows.length; i++) {
      const row = this.salaryRows[i];
      if (!row.payElementPublicId) {
        this.toastr.error(`Salary Row ${i + 1}: Pay Element is required`);
        return false;
      }
      if (usedElements.has(row.payElementPublicId)) {
        this.toastr.error(`Salary Row ${i + 1}: Duplicate Pay Element not allowed`);
        return false;
      }
      usedElements.add(row.payElementPublicId);
      if (row.amount === null || row.amount === undefined || row.amount <= 0) {
        this.toastr.error(`Salary Row ${i + 1}: Amount must be greater than 0`);
        return false;
      }
      if (row.amount > 100000000) {
        this.toastr.error(`Salary Row ${i + 1}: Amount is too large`);
        return false;
      }
      if (!row.payFrequency) {
        this.toastr.error(`Salary Row ${i + 1}: Pay Frequency is required`);
        return false;
      }
      if (!row.effectiveDate) {
        this.toastr.error(`Salary Row ${i + 1}: Effective Date is required`);
        return false;
      }

      const effDate = parseDate(row.effectiveDate);

      if (effDate < offer) {
        this.toastr.error(`Salary Row ${i + 1}: Effective Date cannot be before Offer Date`);
        return false;
      }
      if (row.remarks && row.remarks.length > 250) {
        this.toastr.error(`Salary Row ${i + 1}: Remarks cannot exceed 250 characters`);
        return false;
      }
    }

    return true;
  }
  createOffer() {
    if (!this.validateForm()) return;
    const payload = {
      code: this.code,
      name: this.name,
      applicationPublicId: this.applicationPublicId,
      offerDate: this.offerDate,
      expiryDate: this.expiryDate,
      joiningDate: this.joiningDate,
      approvedByPublicId: null, // 👈 as required
      remarks: this.remarks,
      salaryRows: this.salaryRows,
    };

    this.loader.show();

    this.onboarding.CreatenewOffer(payload).subscribe({
      next: () => {
        this.loader.hide();
        this.toastr.success('Offer Created Successfully');
        this.router.navigate(['/panel/onboarding/view-offers-list']);
      },
      error: (err) => {
        this.loader.hide();
        this.toastr.error(err.error?.message || 'Creation Failed');
      },
    });
  }

  updateOffer() {
    if (!this.validateForm()) return;
    const payload = {
      code: this.code,
      name: this.name,
      applicationPublicId: this.applicationPublicId,
      offerDate: this.offerDate,
      expiryDate: this.expiryDate,
      joiningDate: this.joiningDate,
      approvedByPublicId: null,
      remarks: this.remarks,
      salaryRows: this.salaryRows,
    };

    this.loader.show();

    this.onboarding.updateOffer(this.publicId!, payload).subscribe({
      next: () => {
        this.loader.hide();
        this.toastr.success('Updated Successfully');
        this.router.navigate(['/panel/onboarding/view-offers-list']);
      },
      error: () => {
        this.loader.hide();
        this.toastr.error('Update Failed');
      },
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
      },
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
    this.router.navigate(['/panel/onboarding/view-offers-list']);
  }
}
