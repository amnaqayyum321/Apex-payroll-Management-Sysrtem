import { Component, HostListener, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ToastrService } from 'ngx-toastr';
import { LoaderService } from '../../../../core/services/management-services/loader.service';
import { PaginationComponent } from '../../../../shared/components/commons/components/pagination/pagination.component';
import { OnboardingService } from '../../Services/onboarding';
import { FormsService } from '../../../forms/Services/forms';
import { CountryCityService, ICountry } from '../../../../Service/country';
interface Tab {
  id: string;
  title: string;
}
interface ExperienceEntry {
  companyName: string;
  position: string;
  fromDate: string;
  toDate: string;
  isContinue: boolean;
  salary: number | null;
  expRemarks: string;
}
interface SkillEntry {
  skillName: string;
  skillRating: number;
  skillRemarks: string;
}
interface QualificationEntry {
  qualificationName: string;
  passingYear: string;
  isStudying: boolean;
  institute: string;
  grade: string;
  qualRemarks: string;
}
interface AttachmentEntry {
  file: File;
  fileName: string;
  fileSize: string;
  fileType: string;
  remarks: string;
}
@Component({
  selector: 'app-candidate',
  imports: [FormsModule, CommonModule],
  templateUrl: './candidate.html',
  styleUrl: './candidate.scss',
})
export class Candidate {
  title: 'create' | 'edit' = 'create';
  activeTabId: string = 'experience';
  activeTab: string = 'experience';
  countries: ICountry[] = [];
  cities: string[] = [];
  selectedCountry: string = '';
  selectedCity: string = '';
  experienceList: ExperienceEntry[] = [];
  sidebarTabs: Tab[] = [
    { id: 'experience', title: 'Experience' },
    { id: 'skills', title: 'Skills' },
    { id: 'qualification', title: 'Qualification' },
    { id: 'attachment', title: 'Attachment' },
  ];
  expForm = {
    companyName: '',
    position: '',
    fromDate: '',
    toDate: '',
    isContinue: false,
    salary: null as number | null,
    expRemarks: '',
  };
  skillList: SkillEntry[] = [];
  skillForm = {
    skillName: '',
    skillRating: 1,
    skillRemarks: '',
  };
  qualificationList: QualificationEntry[] = [];

  qualForm = {
    qualificationName: '',
    passingYear: '',
    isStudying: false,
    institute: '',
    grade: '',
    qualRemarks: '',
  };
  attachmentList: AttachmentEntry[] = [];

  attachForm = {
    file: null as File | null,
    remarks: '',
  };
  constructor(
    private router: Router,
    private toastr: ToastrService,
    private loader: LoaderService,
    private onboardingService: OnboardingService,
    private formsService: FormsService,
    private activatedRoute: ActivatedRoute,
    private countryCityService: CountryCityService,
  ) {}

  // filteredRequisitions() {
  //   if (!this.searchText.trim()) return this.requisition;

  //   return this.requisition.filter(this.requisition =>
  //     this.requisition.requisition_name.toLowerCase().includes(this.searchText.toLowerCase()) ||
  //     this.requisition.department.toLowerCase().includes(this.searchText.toLowerCase())
  //   );
  // }
  ngOnInit() {
    this.countries = this.countryCityService.getCountries();
  }
  hideForm() {
    this.resetForm();
  }
  onCountryChange(countryCode: string): void {
    this.cities = this.countryCityService.getCitiesByCountryCode(countryCode);
    this.selectedCity = '';
  }
  cancelForm() {
    // this.hideForm();
    this.router.navigate(['/panel/onboarding/view-all-candidates']);
  }
  setTab(tab: string) {
    this.activeTab = tab;
    this.activeTabId = tab;
  }
  onCancel(): void {
    this.router.navigate(['/panel/onboarding/view-all-candidates']);
  }

  resetForm(): void {}
  addExperience() {
    if (!this.expForm.companyName || !this.expForm.position || !this.expForm.fromDate) {
      this.toastr.warning('Please fill required fields');
      return;
    }

    this.experienceList.push({ ...this.expForm });

    // Reset form
    this.expForm = {
      companyName: '',
      position: '',
      fromDate: '',
      toDate: '',
      isContinue: false,
      salary: null,
      expRemarks: '',
    };

    this.toastr.success('Experience added!');
  }
  removeExperience(index: number) {
    this.experienceList.splice(index, 1);
  }
  addSkill() {
    if (!this.skillForm.skillName || !this.skillForm.skillRating) {
      this.toastr.warning('Please fill required fields');
      return;
    }

    this.skillList.push({ ...this.skillForm });

    this.skillForm = {
      skillName: '',
      skillRating: 1,
      skillRemarks: '',
    };

    this.toastr.success('Skill added!');
  }

  removeSkill(index: number) {
    this.skillList.splice(index, 1);
  }
  addQualification() {
    if (!this.qualForm.qualificationName || !this.qualForm.institute) {
      this.toastr.warning('Please fill required fields');
      return;
    }

    this.qualificationList.push({ ...this.qualForm });

    this.qualForm = {
      qualificationName: '',
      passingYear: '',
      isStudying: false,
      institute: '',
      grade: '',
      qualRemarks: '',
    };

    this.toastr.success('Qualification added!');
  }

  removeQualification(index: number) {
    this.qualificationList.splice(index, 1);
  }
  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.attachForm.file = input.files[0];
    }
  }

  getFileSize(bytes: number): string {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  }

  getFileIcon(type: string): string {
    if (type.includes('pdf')) return 'pdf';
    if (type.includes('image')) return 'img';
    if (type.includes('word') || type.includes('document')) return 'doc';
    if (type.includes('sheet') || type.includes('excel')) return 'xls';
    return 'file';
  }

  addAttachment() {
    if (!this.attachForm.file || !this.attachForm.remarks) {
      this.toastr.warning('Please select a file and enter remarks');
      return;
    }

    this.attachmentList.push({
      file: this.attachForm.file,
      fileName: this.attachForm.file.name,
      fileSize: this.getFileSize(this.attachForm.file.size),
      fileType: this.getFileIcon(this.attachForm.file.type),
      remarks: this.attachForm.remarks,
    });

    this.attachForm = { file: null, remarks: '' };
    const fileInput = document.getElementById('attachFile') as HTMLInputElement;
    if (fileInput) fileInput.value = '';

    this.toastr.success('Attachment added!');
  }

  removeAttachment(index: number) {
    this.attachmentList.splice(index, 1);
  }
}
