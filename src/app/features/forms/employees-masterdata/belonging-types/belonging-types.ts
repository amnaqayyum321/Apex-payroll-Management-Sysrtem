import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LoaderService } from '../../../../core/services/management-services/loader.service';
import { FormsService } from '../../Services/forms';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-belonging-types',
  imports: [CommonModule, FormsModule],
  templateUrl: './belonging-types.html',
  styleUrl: './belonging-types.scss',
})
export class BelongingTypes {
  code: string = '';
  name: string = '';
  description: string = '';
  disabled: boolean = false;
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
      this.loadSingleBelongingypes();
    }
  }

  loadSingleBelongingypes() {
    this.loader.show();
    this.formsService.getBelongingTypeById(this.publicId!).subscribe({
      next: (res: any) => {
        this.loader.hide();
        this.code = res.data.code;
        this.name = res.data.name;
        this.description = res.data.description;
        this.active = res.data.isActive;
      },
      error: () => {
        this.loader.hide();
        this.toastr.error('Failed to load designation');
      },
    });
  }

  createBelongingTypes() {
    if (!this.code || !this.name || !this.description) {
      this.toastr.error('Please fill in all required fields');
      return;
    }
    let payload = {
      code: this.code,
      name: this.name,
      description: this.description,
      active: this.active,
    };
    this.loader.show();
    this.disabled = true;
    this.formsService.CreateBelongingType(payload).subscribe({
      next: (response: any) => {
        this.loader.hide();
        this.toastr.success('Employee Grade created successfully', 'Success');
        this.resetBelongingTypesForm();
        setTimeout(() => {
          this.router.navigate(['/panel/forms/view-belonging-types-list']);
        }, 1500);
      },
      error: (error: any) => {
        this.loader.hide();
        this.disabled = false;
        this.toastr.error(
          error.error.message || 'Failed to create employee grade. Please try again.',
          'Error',
        );
      },
    });
  }
  resetBelongingTypesForm() {
    this.code = '';
    this.name = '';
    this.description = '';
    this.active = true;
    this.disabled = false;
  }
  cancel() {
    this.router.navigate(['/panel/forms/view-belonging-types-list']);
  }

  updateBelongingTypes() {
    const payload = {
      code: this.code,
      name: this.name,
      description: this.description,
      active: this.active ? true : false,
    };

    this.loader.show();

    this.formsService.UpdateBelongingType(this.publicId!, payload).subscribe({
      next: () => {
        this.loader.hide();
        this.toastr.success('Employee Grade updated');
        this.resetBelongingTypesForm();
        this.router.navigate(['/panel/forms/view-belonging-types-list']);
      },
      error: () => {
        this.loader.hide();
        this.toastr.error('Update failed');
      },
    });
  }
}
