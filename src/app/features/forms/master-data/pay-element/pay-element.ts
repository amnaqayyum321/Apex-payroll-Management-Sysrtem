import { Component, HostListener } from '@angular/core';   // add HostListener
import { LoaderService } from '../../../../core/services/management-services/loader.service';
import { FormsService } from '../../Services/forms';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-pay-element',
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './pay-element.html',
  styleUrls: ['./pay-element.scss']          // note: styleUrl → styleUrls (optional)
})
export class PayElement {
  Code: string = '';
  Name: string = '';
  elementType: string = '';
  elementCategory: string = '';
  elementNature: string = '';
  description: string = '';
  disabled: boolean = false;
  currentPage: number = 0;
  pageSize: number = 100;
  publicId: string | null = null;
  isEditMode = false;
  active: boolean = false;
  taxable: boolean = false;

  // Dropdown data
  elementTypes = ['ADDITION', 'DEDUCTION'];
  elementNatures = ['FIXED', 'VARIABLE'];
  elementCategories = [
    'ACCOMMODATION', 'BASIC', 'DEPUTATION', 'DRIVER', 'FAMILY',
    'FOOD', 'GROSS', 'MEDICAL', 'OTHER', 'TRAVEL', 'WATCHMAN'
  ];

  // Dropdown open states
  isElementTypeOpen = false;
  isElementNatureOpen = false;
  isElementCategoryOpen = false;

  constructor(
    private loader: LoaderService,
    private FormSv: FormsService,
    private toastr: ToastrService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.publicId = this.route.snapshot.paramMap.get('id');
    if (this.publicId) {
      this.isEditMode = true;
      this.loadSinglePayElement(this.publicId);
    }
  }

  // ---------- Custom dropdown methods ----------
  toggleElementType(event: Event) {
    event.stopPropagation();
    this.isElementNatureOpen = false;
    this.isElementCategoryOpen = false;
    this.isElementTypeOpen = !this.isElementTypeOpen;
  }

  selectElementType(type: string, event: Event) {
    event.stopPropagation();
    this.elementType = type;
    this.isElementTypeOpen = false;
  }

  toggleElementNature(event: Event) {
    event.stopPropagation();
    this.isElementTypeOpen = false;
    this.isElementCategoryOpen = false;
    this.isElementNatureOpen = !this.isElementNatureOpen;
  }

  selectElementNature(nature: string, event: Event) {
    event.stopPropagation();
    this.elementNature = nature;
    this.isElementNatureOpen = false;
  }

  toggleElementCategory(event: Event) {
    event.stopPropagation();
    this.isElementTypeOpen = false;
    this.isElementNatureOpen = false;
    this.isElementCategoryOpen = !this.isElementCategoryOpen;
  }

  selectElementCategory(category: string, event: Event) {
    event.stopPropagation();
    this.elementCategory = category;
    this.isElementCategoryOpen = false;
  }

  // Close all dropdowns when clicking outside
@HostListener('document:click', ['$event'])
onDocumentClick(event: Event) {   // ✅ add the event parameter
  this.isElementTypeOpen = false;
  this.isElementNatureOpen = false;
  this.isElementCategoryOpen = false;
}

  // ---------- Original methods (unchanged) ----------
  createPayElement() {
    if (!this.Code || !this.Name) {
      this.toastr.error('Please fill in all required fields');
      return;
    }
    let payload = {
      code: this.Code,
      name: this.Name,
      description: this.description,
      elementCategory: this.elementCategory,
      elementNature: this.elementNature,
      elementType: this.elementType,
      taxable: this.taxable,
      active: this.active,
    };
    this.loader.show();
    this.disabled = true;
    this.FormSv.CreatePayElement(payload).subscribe({
      next: (res: any) => {
        this.loader.hide();
        this.toastr.success('PayElement created successfully', 'Success');
        this.resetPayElementForm();
        setTimeout(() => {
          this.router.navigate(['/panel/forms/view-pay-element']);
        }, 1500);
      },
      error: (error: any) => {
        this.loader.hide();
        this.disabled = false;
        this.toastr.error(
          error.error.message || 'Failed to create Department. Please try again.',
          'Error'
        );
      },
    });
  }

  resetPayElementForm() {
    this.Code = '';
    this.Name = '';
    this.description = '';
    this.elementCategory = '';
    this.elementNature = '';
    this.elementType = '';
    this.taxable = true;
    this.active = true;
    this.disabled = false;
  }

  cancel() {
    this.router.navigate(['/panel/forms/view-pay-element']);
  }

  loadSinglePayElement(publicId: string) {
    this.loader.show();
    this.FormSv.getPayElementById(publicId).subscribe({
      next: (res: any) => {
        this.loader.hide();
        this.Code = res.data.code;
        this.Name = res.data.name;
        this.description = res.data.description;
        this.active = res.data.isActive;
        this.taxable = res.data.isTaxable;
        this.elementType = res.data.elementType;
        this.elementNature = res.data.elementNature;
        this.elementCategory = res.data.elementCategory;
      },
      error: () => {
        this.loader.hide();
        this.toastr.error('Failed to load PayElement');
      },
    });
  }

  updatePayElement() {
    const payload = {
      code: this.Code,
      name: this.Name,
      description: this.description,
      elementType: this.elementType,
      elementNature: this.elementNature,
      elementCategory: this.elementCategory,
      taxable: this.taxable,
      active: this.active,
    };
    this.loader.show();
    this.FormSv.UpdatePayElement(this.publicId!, payload).subscribe({
      next: () => {
        this.loader.hide();
        this.toastr.success('PayElement updated');
        this.resetPayElementForm();
        setTimeout(() => {
          this.router.navigate(['/panel/forms/view-pay-element']);
        }, 1500);
      },
      error: () => {
        this.loader.hide();
        this.toastr.error('PayElement Update failed');
      },
    });
  }
}