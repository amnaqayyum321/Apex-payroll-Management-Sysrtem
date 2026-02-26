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
  emailAddress: string = '';
  internetAddress: string = '';
  telephone: string = '';
  description: string = '';
  disabled: boolean = true;
  currentPage: number = 0; // page number
  pageSize: number = 100;
  publicId: string | null = null;
  isEditMode = false;
  active: boolean = false;

  constructor(
    private loader: LoaderService,
    private formsService: FormsService,
    private toastr: ToastrService,
    private router: Router,
    private route: ActivatedRoute,
  ) {}
  ngOnInit() {
    // this.loader.show();
    this.publicId = this.route.snapshot.paramMap.get('id');

    if (this.publicId) {
      this.isEditMode = true;
      this.loadSingleCompanyBranch();
    }
  }

  loadSingleCompanyBranch() {
    this.loader.show();
    this.formsService.getCompanyBranchById(this.publicId!).subscribe({
      next: (res: any) => {
        this.loader.hide();
        this.code = res.data.code;
        this.name = res.data.name;
        this.emailAddress = res.data.emailAddress;
        this.internetAddress = res.data.internetAddress;
        this.telephone = res.data.telephone;
        this.description = res.data.description;
        this.active = res.data.isActive;
      },
      error: () => {
        this.loader.hide();
        this.toastr.error('Failed to load company branch');
      },
    });
  }

  createCompanyBranch() {
    if (!this.code || !this.name || !this.description) {
      this.toastr.error('Please fill in all required fields');
      return;
    }
    let payload = {
      code: this.code,
      name: this.name,
      emailAddress: this.emailAddress,
      internetAddress: this.internetAddress,
      telephone: this.telephone,
      description: this.description,
      active: this.active,
    };
    this.loader.show();
    this.disabled = true;
    this.formsService.createCompanyBranch(payload).subscribe({
      next: (response: any) => {
        this.loader.hide();
        this.toastr.success('Company branch created successfully', 'Success');
        this.resetCompanyBranchForm();
        setTimeout(() => {
          this.router.navigate(['/panel/forms/view-company-branches']);
        }, 1500);
      },
      error: (error: any) => {
        this.loader.hide();
        this.disabled = false;
        this.toastr.error(
          error.error.message || 'Failed to create company branch. Please try again.',
          'Error',
        );
      },
    });
  }
  resetCompanyBranchForm() {
    this.code = '';
    this.name = '';
    this.emailAddress = '';
    this.internetAddress = '';
    this.telephone = '';
    this.description = '';
    this.active = true;
    this.disabled = false;
  }
  cancel() {
    this.router.navigate(['/panel/forms/view-company-branches']);
  }

  updateCompanyBranch() {
    const payload = {
      code: this.code,
      name: this.name,
      description: this.description,
      active: this.active ? true : false,
      emailAddress: this.emailAddress,
      internetAddress: this.internetAddress,
      telephone: this.telephone,
    };

    this.loader.show();

    this.formsService.UpdateCompanyBranch(this.publicId!, payload).subscribe({
      next: () => {
        this.loader.hide();
        this.toastr.success('Company branch updated');
        this.resetCompanyBranchForm();
        this.router.navigate(['/panel/forms/view-company-branches']);
      },
      error: () => {
        this.loader.hide();
        this.toastr.error('Update failed');
      },
    });
  }
}
