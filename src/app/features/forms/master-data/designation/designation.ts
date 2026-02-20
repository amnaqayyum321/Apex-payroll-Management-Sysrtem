import { Component } from '@angular/core';
import { LoaderService } from '../../../../core/services/management-services/loader.service';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsService } from '../../Services/forms';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-designation',
  imports: [CommonModule, FormsModule],
  templateUrl: './designation.html',
  styleUrl: './designation.scss',
})
export class Designation {
  email: string = '';
  code: string = '';
  name: string = '';
  description: string = '';
  currentPage: number = 0; // page number
  pageSize: number = 100;
  publicId: string | null = null;
  isEditMode = false;
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
      this.loadSingleDesignation();
    }
  }

  loadSingleDesignation() {
    this.loader.show();
    this.formsService.getDesignationById(this.publicId!).subscribe({
      next: (res: any) => {
        this.loader.hide();
        this.code = res.data.code;
        this.name = res.data.name;
        this.description = res.data.description;
      },
      error: () => {
        this.loader.hide();
        this.toastr.error('Failed to load designation');
      },
    });
  }

  createDesignation() {
    if (!this.code || !this.name || !this.description) {
      this.toastr.error('Please fill in all required fields');
      return;
    }
    let payload = {
      email: this.email,
      code: this.code,
      name: this.name,
      description: this.description,
    };
    this.loader.show();
    this.formsService.CreatenewDesignation(payload).subscribe({
      next: (response: any) => {
        this.loader.hide();
        this.toastr.success('Designation created successfully', 'Success');
        this.resetDesignationForm();
        setTimeout(() => {
          this.router.navigate(['/panel/forms/view-designations']);
        }, 1500);
      },
      error: (error: any) => {
        this.loader.hide();
        this.toastr.error(
          error.error.message || 'Failed to create designation. Please try again.',
          'Error',
        );
      },
    });
  }
  resetDesignationForm() {
    this.code = '';
    this.name = '';
    this.description = '';
  }
  cancel() {
    this.router.navigate(['/panel/forms/view-designations']);
  }

  updateDesignation() {
    const payload = {
      code: this.code,
      name: this.name,
      description: this.description,
    };

    this.loader.show();

    this.formsService.updateDesignation(this.publicId!, payload).subscribe({
      next: () => {
        this.loader.hide();
        this.toastr.success('Designation updated');
        this.resetDesignationForm();
        this.router.navigate(['/panel/forms/view-designations']);
      },
      error: () => {
        this.loader.hide();
        this.toastr.error('Update failed');
      },
    });
  }
}
