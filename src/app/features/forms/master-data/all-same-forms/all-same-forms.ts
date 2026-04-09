import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { LoaderService } from '../../../../core/services/management-services/loader.service';
import { FormsService } from '../../../forms/Services/forms';

@Component({
  selector: 'app-all-same-forms',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './all-same-forms.html',
  styleUrl: './all-same-forms.scss',
})
export class AllSameForms {
  type = '';
  title = '';
  publicId: string | null = null;
  isEditMode = false;
  disabled = false;
  

  formData = {
    code: '',
    name: '',
    description: '',
    active: true,
  };

  config: any;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private formSv: FormsService,
    private toastr: ToastrService,
    private loader: LoaderService
  ) {}

  ngOnInit() {
    this.type = this.route.snapshot.paramMap.get('type') || '';
    this.publicId = this.route.snapshot.paramMap.get('id');

    this.setConfig();

    if (this.publicId) {
      this.isEditMode = true;
      this.loadById();
    }
  }

  setConfig() {
    const map: any = {
      department: {
        title: 'Department',
        create: this.formSv.CreateDepartment.bind(this.formSv),
        update: this.formSv.UpdateDepartment.bind(this.formSv),
        getById: this.formSv.getDepartementById.bind(this.formSv),
        listRoute: '/panel/forms/view-department-list',
      },

      designation: {
        title: 'Designation',
        create: this.formSv.CreatenewDesignation.bind(this.formSv),
        update: this.formSv.updateDesignation.bind(this.formSv),
        getById: this.formSv.getDesignationById.bind(this.formSv),
        listRoute: '/panel/forms/view-designations',
      },

      'job-title': {
        title: 'Job Title',
        create: this.formSv.CreateJobTitle.bind(this.formSv),
        update: this.formSv.UpdateJobTitle.bind(this.formSv),
        getById: this.formSv.getJobTitleById.bind(this.formSv),
        listRoute: '/panel/forms/view-job-title-list',
      },

      'id-type': {
        title: 'ID Type',
        create: this.formSv.CreateIDType.bind(this.formSv),
        update: this.formSv.UpdateIDType.bind(this.formSv),
        getById: this.formSv.getIDTypeById.bind(this.formSv),
        listRoute: '/panel/forms/view-id-type-list',
      },

      'employees-grade': {
        title: 'Employee Grade',
        create: this.formSv.CreateEmployeeGrade.bind(this.formSv),
        update: this.formSv.UpdateEmployeeGrade.bind(this.formSv),
        getById: this.formSv.getEmployeeGradeById.bind(this.formSv),
        listRoute: '/panel/forms/view-employees-grade-list',
      },

   'employee-category': {
  title: 'Employee Category',
  create: this.formSv.CreateEmployeeCaterogy.bind(this.formSv),
  update: this.formSv.UpdateEmployeeCaterogy.bind(this.formSv),
  getById: this.formSv.getEmployeeCaterogyById.bind(this.formSv),
  listRoute: '/panel/forms/view-employee-category-list',
},

      'belonging-type': {
        title: 'Belonging Type',
        create: this.formSv.CreateBelongingType.bind(this.formSv),
        update: this.formSv.UpdateBelongingType.bind(this.formSv),
        getById: this.formSv.getBelongingTypeById.bind(this.formSv),
        listRoute: '/panel/forms/view-belonging-types-list',
      },
    };

    this.config = map[this.type];
    this.title = this.config?.title || 'Form';
  }

  loadById() {
    this.loader.show();

    this.config.getById(this.publicId).subscribe({
      next: (res: any) => {
        this.loader.hide();

        this.formData = {
          code: res.data.code,
          name: res.data.name,
          description: res.data.description,
          active: res.data.isActive,
        };
      },
      error: () => {
        this.loader.hide();
        this.toastr.error(`Failed to load ${this.title}`);
      },
    });
  }

  submit() {
    if (!this.formData.code || !this.formData.name) {
      this.toastr.error('Please fill required fields');
      return;
    }

    this.loader.show();
    this.disabled = true;

    const request = this.isEditMode
      ? this.config.update(this.publicId, this.formData)
      : this.config.create(this.formData);

    request.subscribe({
      next: () => {
        this.loader.hide();
        this.disabled = false;

        this.toastr.success(
          `${this.title} ${this.isEditMode ? 'updated' : 'created'} successfully`
        );

        this.resetForm();
        this.router.navigate([this.config.listRoute]);
      },
      error: (err: any) => {
        this.loader.hide();
        this.disabled = false;

        this.toastr.error(err.error?.message || `${this.title} failed`);
      },
    });
  }

  resetForm() {
    this.formData = {
      code: '',
      name: '',
      description: '',
      active: true,
    };
  }

  cancel() {
    this.router.navigate([this.config.listRoute]);
  }
}