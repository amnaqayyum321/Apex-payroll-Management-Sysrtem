import { Component } from '@angular/core';
import { LoaderService } from '../../../../core/services/management-services/loader.service';
import { FormsService } from '../../Services/forms';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-company',
  imports: [CommonModule, FormsModule],
  templateUrl: './company.html',
  styleUrl: './company.scss',
})
export class Company {

  code: string = '';
  name: string = '';
  description: string = '';
  internetAddress: string = '';
  emailAddress: string = '';
  telephone: string = '';
  disabled: boolean = false;
  currentPage: number = 0; // page number
  pageSize: number = 100;
  publicId: string | null = null;
  isEditMode = false;
  constructor(
    private loader: LoaderService,
    private FormSv: FormsService,
    private toastr:   ToastrService,
    private router: Router,
    private route: ActivatedRoute,
  ) {}

  ngOnInit() {
    this.publicId = this.route.snapshot.paramMap.get('id');
    if (this.publicId) {
      this.isEditMode = true;
      this.loadSingleCompanyBranch(this.publicId);
    }
  }
  createCompanyBranch() {
    if (!this.code || !this.name|| !this.emailAddress|| !this.telephone || !this.internetAddress) {
      this.toastr.error('Please fill in all required fields');
      return;
    }
    let payload = {
      code: this.code,
      name: this.name,
      description: this.description,
      internetAddress: this.internetAddress,
      emailAddress: this.emailAddress,
      telephone: this.telephone
    };
    this.loader.show();
    this.disabled = true;
    this.FormSv.createCompanyBranch(payload).subscribe({
      next: (res: any) => {
        this.loader.hide();
        this.toastr.success('Company Branch created successfully', 'Success');
        this.resetDepartmentForm();
        setTimeout(() => {
          this.router.navigate(['/panel/forms/view-company-branches']);
        }, 1500);
      },
      error: (error: any) => {
        this.loader.hide();
        this.disabled = false;
        this.toastr.error(
          error.error.message || 'Failed to create Department. Please try again.',
          'Error',
        );
      },
    });
  }
  resetDepartmentForm() {
    this.code = '';
    this.name = '';
    this.description = '';
    this.internetAddress = '';
    this.emailAddress = '';
    this.telephone = '';

    this.disabled = false;
  }
  cancel() {
    this.router.navigate(['/panel/forms/view-company-branches']);
  }
  loadSingleCompanyBranch(publicId: string) {
    this.loader.show();
    this.FormSv.getCompanyBranchById(publicId!).subscribe({
      next: (res: any) => {
        this.loader.hide();
        this.code = res.data.code;
        this.name = res.data.name;
        this.description = res.data.description;
        this.internetAddress = res.data.internetAddress;
        this.emailAddress = res.data.emailAddress;
        this.telephone = res.data.telephone;
      },
      error: () => {
        this.loader.hide();
        this.toastr.error('Failed to load company branch details  ');
      },
    });
  }
  updateCompanyBranch() {
    const payload = {
      code: this.code,
      name: this.name,
      description: this.description,
      internetAddress: this.internetAddress,
      emailAddress: this.emailAddress,
      telephone: this.telephone
    };

    this.loader.show();

    this.FormSv.UpdateCompanyBranch(this.publicId!, payload).subscribe({
      next: () => {
        this.loader.hide();
        this.toastr.success('Company Branch updated');
        this.resetDepartmentForm();
        setTimeout(() => {
          this.router.navigate(['/panel/forms/view-company-branches']);
        }, 1500);
      },
      error: () => {
        this.loader.hide();
        this.toastr.error('Company Branch Update failed');
      },
    });
  }
}
