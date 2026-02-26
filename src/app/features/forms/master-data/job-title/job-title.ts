import { Component } from '@angular/core';
import { LoaderService } from '../../../../core/services/management-services/loader.service';
import { FormsService } from '../../Services/forms';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-job-title',
  imports: [CommonModule, FormsModule],
  templateUrl: './job-title.html',
  styleUrl: './job-title.scss',
})
export class JobTitle {
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
      this.loadSingleJobTitle();
    }
  }

  loadSingleJobTitle() {
    this.loader.show();
    this.formsService.getJobTitleById(this.publicId!).subscribe({
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

  createJobTitle() {
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
    this.formsService.CreateJobTitle(payload).subscribe({
      next: (response: any) => {
        this.loader.hide();
        this.toastr.success('Job Title created successfully', 'Success');
        this.resetJobTitleForm();
        setTimeout(() => {
          this.router.navigate(['/panel/forms/view-job-title-list']);
        }, 1500);
      },
      error: (error: any) => {
        this.loader.hide();
        this.disabled = false;
        this.toastr.error(
          error.error.message || 'Failed to create Job Title. Please try again.',
          'Error',
        );
      },
    });
  }
  resetJobTitleForm() {
    this.code = '';
    this.name = '';
    this.description = '';
    this.active = true;
    this.disabled = false;
  }
  cancel() {
    this.router.navigate(['/panel/forms/view-job-title-list']);
  }

  updateJobTitle() {
    const payload = {
      code: this.code,
      name: this.name,
      description: this.description,
      active: this.active ? true : false,
    };

    this.loader.show();

    this.formsService.UpdateJobTitle(this.publicId!, payload).subscribe({
      next: () => {
        this.loader.hide();
        this.toastr.success('Designation updated');
        this.resetJobTitleForm();
        this.router.navigate(['/panel/forms/view-job-title-list']);
      },
      error: () => {
        this.loader.hide();
        this.toastr.error('Update failed');
      },
    });
  }
}
