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
import { forkJoin } from 'rxjs';
import { HttpParams } from '@angular/common/http';
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
  file: File | null;
  fileName: string;
  fileSize: string;
  fileType: string;
  remarks: string;
  context: string;
  description: string;
  publicId?: string;
  isServerFile?: boolean;
}
@Component({
  selector: 'app-candidate',
  imports: [FormsModule, CommonModule],
  templateUrl: './candidate.html',
  styleUrl: './candidate.scss',
})
export class Candidate {
  activeTabId: string = 'experience';
  activeTab: string = 'experience';
  countries: ICountry[] = [];
  cities: string[] = [];
  selectedCountry: string = '';
  selectedCity: string = '';
  remarks: string = '';
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

  attachForm: { file: File | null; remarks: string; context: string; description: string } = {
    file: null,
    remarks: '',
    context: 'CANDIDATE_DOCUMENTS',
    description: '',
  };
  code = '';
  firstName = '';
  lastName = '';
  email = '';
  contactNumber1 = '';
  contactNumber2 = '';
  dateOfBirth = '';
  gender = '';
  religion = '';
  linkedinUrl = '';
  source = '';
  active = false;
  title: 'create' | 'edit' = 'create';
  candidateId!: string;

  // Dropdown flags
  isGenderDropdownOpen = false;
  isReligionDropdownOpen = false;
  isCountryDropdownOpen = false;
  isCityDropdownOpen = false;
  isSourceDropdownOpen = false;

  // Option lists (if you want to keep values as objects; you can also use plain strings)
  genderOptions = [
    { value: 'MALE', label: 'Male' },
    { value: 'FEMALE', label: 'Female' },
    { value: 'OTHER', label: 'Other' },
  ];

  religionOptions = [
    { value: 'ISLAM', label: 'Islam' },
    { value: 'CHRISTIANITY', label: 'Christianity' },
    { value: 'HINDUISM', label: 'Hinduism' },
    { value: 'BUDDHISM', label: 'Buddhism' },
    { value: 'SIKHISM', label: 'Sikhism' },
    { value: 'JUDAISM', label: 'Judaism' },
    { value: 'OTHER', label: 'Other' },
  ];

  sourceOptions = [
    { value: 'REQUISITION', label: 'Requisition' },
    { value: 'WALK_IN', label: 'Walk In' },
    { value: 'REFERRAL', label: 'Referral' },
    { value: 'PORTAL', label: 'Portal' },
    { value: 'OTHER', label: 'Other' },
  ];

  // For country and city we already have arrays, but we need to store selected objects.
  // We'll keep selectedCountry and selectedCity as codes/names.

  // Selected labels for display
  selectedGenderLabel = '';
  selectedReligionLabel = '';
  selectedCountryLabel = '';
  selectedCityLabel = '';
  selectedSourceLabel = '';
  constructor(
    private router: Router,
    private toastr: ToastrService,
    private loader: LoaderService,
    private onboardingService: OnboardingService,
    private formsService: FormsService,
    private activatedRoute: ActivatedRoute,
    private countryCityService: CountryCityService,
  ) {}

  ngOnInit() {
    this.countries = this.countryCityService.getCountries();
    const id = this.activatedRoute.snapshot.paramMap.get('id');
    if (id) {
      this.title = 'edit';
      this.candidateId = id;
      this.getCandidateById(id);
    }
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
    this.resetForm();
    this.router.navigate(['/panel/onboarding/view-candidate-list']);
  }
  setTab(tab: string) {
    this.activeTab = tab;
    this.activeTabId = tab;
  }

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
    if (!this.attachForm.file) {
      this.toastr.warning('Please select a file');
      return;
    }

    this.attachmentList.push({
      file: this.attachForm.file,
      fileName: this.attachForm.file.name,
      fileSize: this.getFileSize(this.attachForm.file.size),
      fileType: this.getFileIcon(this.attachForm.file.type),
      remarks: this.attachForm.remarks,
      context: this.attachForm.context,
      description: this.attachForm.description,
    });
    this.attachForm = { file: null, remarks: '', context: 'CANDIDATE_DOCUMENTS', description: '' };
    const fileInput = document.getElementById('attachFile') as HTMLInputElement;
    if (fileInput) fileInput.value = '';

    this.toastr.success('Attachment added!');
  }

  removeAttachment(index: number) {
    this.attachmentList.splice(index, 1);
  }
  // Candidate Validation
  validateCandidateForm(): boolean {
    if (!this.firstName?.trim()) {
      this.toastr.error('First Name is required');
      return false;
    }
    if (!this.lastName?.trim()) {
      this.toastr.error('Last Name is required');
      return false;
    }
    if (!this.email?.trim()) {
      this.toastr.error('Email is required');
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.email)) {
      this.toastr.error('Please enter a valid Email');
      return false;
    }
    if (!this.contactNumber1?.trim()) {
      this.toastr.error('Contact Number 1 is required');
      return false;
    }
    if (!this.gender) {
      this.toastr.error('Gender is required');
      return false;
    }

    return true;
  }
  // Tabs Validation
  validateExperienceList(): boolean {
    if (this.experienceList.length === 0) return true;
    for (let i = 0; i < this.experienceList.length; i++) {
      const exp = this.experienceList[i];

      if (!exp.companyName?.trim()) {
        this.toastr.error(`Experience ${i + 1}: Company Name required`);
        return false;
      }
      if (!exp.fromDate) {
        this.toastr.error(`Experience ${i + 1}: From Date required`);
        return false;
      }
      if (!exp.position?.trim()) {
        this.toastr.error(`Experience ${i + 1}: Position required`);
        return false;
      }
      if (!exp.isContinue && !exp.toDate) {
        this.toastr.error(`Experience ${i + 1}: To Date required`);
        return false;
      }
    }

    return true;
  }
  validateSkillList(): boolean {
    if (this.skillList.length === 0) return true;
    for (let i = 0; i < this.skillList.length; i++) {
      const skills = this.skillList[i];
      if (!skills.skillName?.trim()) {
        this.toastr.error(`Skill${i + 1}:Skill Name Required`);
        return false;
      }
      if (!skills.skillRating) {
        this.toastr.error(`Skill ${i + 1}: Rating required`);
        return false;
      }
    }
    return true;
  }
  validateQualificationList(): boolean {
    if (this.qualificationList.length === 0) return true;

    for (let i = 0; i < this.qualificationList.length; i++) {
      const q = this.qualificationList[i];

      if (!q.qualificationName?.trim()) {
        this.toastr.error(`Qualification ${i + 1}: Name required`);
        return false;
      }

      if (!q.institute?.trim()) {
        this.toastr.error(`Qualification ${i + 1}: Institute required`);
        return false;
      }

      if (!q.isStudying && !q.passingYear) {
        this.toastr.error(`Qualification ${i + 1}: Passing Year required`);
        return false;
      }
    }

    return true;
  }
  validateAttachmentList(): boolean {
    if (this.attachmentList.length === 0) return true;

    for (let i = 0; i < this.attachmentList.length; i++) {
      const a = this.attachmentList[i];

      if (!a.fileName) {
        this.toastr.error(`Attachment ${i + 1}: File required`);
        return false;
      }
    }

    return true;
  }
  ValidateAllTabs(): boolean {
    if (!this.validateExperienceList()) {
      this.setTab('experience');
      return false;
    }
    if (!this.validateSkillList()) {
      this.setTab('skills');
      return false;
    }
    if (!this.validateQualificationList()) {
      this.setTab('qualification');
      return false;
    }

    if (!this.validateAttachmentList()) {
      this.setTab('attachment');
      return false;
    }
    return true;
  }
  buildPayload() {
    return {
      code: '',
      firstName: this.firstName ?? null,
      lastName: this.lastName ?? null,
      email: this.email ?? null,
      contactNumber1: this.contactNumber1 ?? null,
      contactNumber2: this.contactNumber2 ?? null,
      dateOfBirth: this.dateOfBirth ?? null,
      gender: this.gender ?? null,
      country: this.selectedCountry ?? null,
      city: this.selectedCity ?? null,
      religion: this.religion ?? null,
      linkedinUrl: this.linkedinUrl ?? null,
      source: this.source ?? null,
      active: this.active ?? null,
      remarks: this.remarks ?? null,

      experiences: this.experienceList.map((exp, index) => ({
        companyName: exp.companyName,
        fromDate: exp.fromDate,
        toDate: exp.isContinue ? null : exp.toDate,
        currentlyWorking: exp.isContinue,
        position: exp.position,
        lastSalaryDrawn: exp.salary ?? 0,
        lineNumber: index + 1,
        status: 'ACTIVE',
        remarks: exp.expRemarks,
      })),
      skills: this.skillList.map((skill, index) => ({
        skillName: skill.skillName,
        skillRating: skill.skillRating,
        lineNumber: index + 1,
        status: 'ACTIVE',
        remarks: skill.skillRemarks,
      })),
      qualifications: this.qualificationList.map((qual, index) => ({
        qualificationName: qual.qualificationName,
        passingYear: qual.passingYear,
        currentlyStudying: qual.isStudying,
        institute: qual.institute,
        gradeCgpa: qual.grade,
        lineNumber: index + 1,
        status: 'ACTIVE',
        remarks: qual.qualRemarks,
      })),
    };
  }
  SubmitCandidate() {
    if (!this.validateCandidateForm()) {
      return;
    }
    if (!this.ValidateAllTabs()) {
      return;
    }
    const payload = this.buildPayload();
    console.log('Payload Object:', payload);
    console.log('Payload JSON:', JSON.stringify(payload, null, 2));
    this.loader.show();
    this.onboardingService.CreatenewCandidate(payload).subscribe(
      (res: any) => {
        this.loader.hide();
        if (res.success) {
          const candidatePublicId = res.data?.publicId;
          if (this.attachmentList.length > 0) {
            this.uploadAttachments(candidatePublicId, 'CANDIDATE');
          }
          this.resetForm();
          this.toastr.success('Candidate Created Successfully');
          setTimeout(() => {
            this.router.navigate(['/panel/onboarding/view-candidate-list']);
          }, 1500);
        }
      },
      (err) => {
        console.log(err);
        this.toastr.error('Error creating candidate');
        this.loader.hide();
      },
    );
  }
  UpdateCandidate() {
    if (!this.validateCandidateForm()) {
      return;
    }
    if (!this.ValidateAllTabs()) {
      return;
    }
    const payload = this.buildPayload();
    console.log('Payload Object:', payload);
    console.log('Payload JSON:', JSON.stringify(payload, null, 2));
    this.loader.show();
    this.onboardingService.updateCandidate(this.candidateId, payload).subscribe(
      (res: any) => {
        if (res.success) {
          const hasNewAttachments = this.attachmentList.some((a) => !a.isServerFile && a.file);
          if (hasNewAttachments) {
            this.uploadAttachments(this.candidateId, 'CANDIDATE');
          }
          this.resetForm();
          this.toastr.success('Candidate Updated Successfully!');
          setTimeout(() => {
            this.router.navigate(['/panel/onboarding/view-candidate-list']);
          }, 1500);
        }
      },
      (err: any) => {
        this.loader.hide();
        this.toastr.error('Error updating candidate');
        console.error(err);
      },
    );
  }
  getCandidateById(id: string) {
    this.loader.show();
    this.onboardingService.getCandidateById(id).subscribe((res: any) => {
      if (res.success) {
        this.loader.hide();
        const data = res.data;
        this.code = data.code;
        this.firstName = data.firstName;
        this.lastName = data.lastName;
        this.email = data.email;
        this.contactNumber1 = data.contactNumber1;
        this.contactNumber2 = data.contactNumber2;
        this.dateOfBirth = data.dateOfBirth;
        this.gender = data.gender;
        this.selectedCountry = data.country;
        this.cities = this.countryCityService.getCitiesByCountryCode(data.country);
        this.selectedCity = data.city;
        this.religion = data.religion;
        this.linkedinUrl = data.linkedinUrl;
        this.source = data.source;
        this.remarks = data.remarks;
        this.active = data.isActive;
        // After setting gender, religion, etc.
        this.selectedGenderLabel =
          this.genderOptions.find((g) => g.value === this.gender)?.label || '';
        this.selectedReligionLabel =
          this.religionOptions.find((r) => r.value === this.religion)?.label || '';
        this.selectedCountryLabel =
          this.countries.find((c) => c.code === this.selectedCountry)?.name || '';
        this.selectedCityLabel = this.selectedCity;
        this.selectedSourceLabel =
          this.sourceOptions.find((s) => s.value === this.source)?.label || '';
        this.experienceList = res.data.experiences.map((e: any) => ({
          companyName: e.companyName,
          position: e.position,
          fromDate: e.fromDate,
          toDate: e.toDate,
          isContinue: e.currentlyWorking,
          salary: e.lastSalaryDrawn,
          expRemarks: e.remarks,
        }));
        this.skillList = res.data.skills.map((s: any) => ({
          skillName: s.skillName,
          skillRating: s.skillRating,
          skillRemarks: s.remarks,
        }));

        this.qualificationList = res.data.qualifications.map((q: any) => ({
          qualificationName: q.qualificationName,
          passingYear: q.passingYear,
          isStudying: q.currentlyStudying,
          institute: q.institute,
          grade: q.gradeCgpa,
          qualRemarks: q.remarks,
        }));
        this.attachmentList = (res.data.attachments || []).map((a: any) => ({
          file: null,
          fileName: a.fileName,
          fileSize: this.getFileSize(a.fileSize),
          fileType: this.getFileIcon(a.fileType),
          remarks: '',
          context: a.storageContext,
          description: a.description,
          publicId: a.publicId,
          isServerFile: true,
        }));
      }
    });
  }
  save() {
    if (!this.validateCandidateForm()) return;
    this.title === 'create' ? this.SubmitCandidate() : this.UpdateCandidate();
  }

  uploadAttachments(entityPublicId: string, entityType: string) {
    const newAttachments = this.attachmentList.filter((a) => !a.isServerFile && a.file);
    if (newAttachments.length === 0) {
      this.loader.hide();
      return;
    }
    const uploadObservables = newAttachments.map((attachment) => {
      const formData = new FormData();
      formData.append('file', attachment.file!);

      const params = new HttpParams()
        .set('context', attachment.context)
        .set('entityType', entityType)
        .set('entityPublicId', entityPublicId)
        .set('description', attachment.description);

      return this.onboardingService.uploadAttachment(formData, params);
    });

    forkJoin(uploadObservables).subscribe(
      (results) => {
        console.log('All attachments uploaded:', results);
        this.loader.hide();
      },
      (err: any) => {
        console.error('Attachment upload failed:', err);
        this.toastr.error('Some attachments failed to upload');
        this.loader.hide();
      },
    );
  }
  resetForm(): void {
    this.title = 'create';
    this.candidateId = '';
    this.code = '';
    this.firstName = '';
    this.lastName = '';
    this.email = '';
    this.contactNumber1 = '';
    this.contactNumber2 = '';
    this.dateOfBirth = '';
    this.gender = '';
    this.religion = 'ISLAM';
    this.linkedinUrl = '';
    this.source = 'REQUISITION';
    this.active = false;
    this.remarks = '';
    this.selectedCountry = '';
    this.selectedCity = '';
    this.selectedGenderLabel = '';
    this.selectedReligionLabel = '';
    this.selectedCountryLabel = '';
    this.selectedCityLabel = '';
    this.selectedSourceLabel = '';
    this.cities = [];
    this.experienceList = [];
    this.expForm = {
      companyName: '',
      position: '',
      fromDate: '',
      toDate: '',
      isContinue: false,
      salary: null,
      expRemarks: '',
    };
    this.skillList = [];
    this.skillForm = {
      skillName: '',
      skillRating: 1,
      skillRemarks: '',
    };
    this.qualificationList = [];
    this.qualForm = {
      qualificationName: '',
      passingYear: '',
      isStudying: false,
      institute: '',
      grade: '',
      qualRemarks: '',
    };
    this.attachmentList = [];
    this.attachForm = {
      file: null,
      remarks: '',
      context: 'CANDIDATE_DOCUMENTS',
      description: '',
    };

    const fileInput = document.getElementById('attachFile') as HTMLInputElement;
    if (fileInput) fileInput.value = '';
    this.activeTab = 'experience';
    this.activeTabId = 'experience';
  }
  downloadAttachment(publicId: string | undefined, attachment?: AttachmentEntry) {
    if (!publicId && attachment?.file) {
      const url = URL.createObjectURL(attachment.file);
      const a = document.createElement('a');
      a.href = url;
      a.download = attachment.fileName;
      a.click();
      URL.revokeObjectURL(url);
      return;
    }
    if (!publicId) return;
    debugger;
    this.loader.show();
    this.onboardingService.downloadAttachment(publicId).subscribe(
      (res: any) => {
        if (res?.message) {
          console.log('downalod res', res);
          this.loader.hide();
          window.open(res.message, '_blank');
        }
      },
      (err: any) => {
        this.toastr.error('Download failed');
        console.log(err);
      },
    );
  }
  getFileType(fileName: string): string {
    const ext = fileName.split('.').pop()?.toLowerCase();
    if (!ext) return 'file';
    if (ext === 'pdf') return 'pdf';
    if (['png', 'jpg', 'jpeg', 'gif', 'webp', 'svg'].includes(ext)) return 'img';
    if (['doc', 'docx'].includes(ext)) return 'doc';
    if (['xls', 'xlsx', 'csv'].includes(ext)) return 'xls'; // ← xlsx was missing
    return 'file';
  }

  toggleGenderDropdown(event: Event) {
    event.stopPropagation();
    this.isGenderDropdownOpen = !this.isGenderDropdownOpen;
    // close other dropdowns
    this.isReligionDropdownOpen = false;
    this.isCountryDropdownOpen = false;
    this.isCityDropdownOpen = false;
    this.isSourceDropdownOpen = false;
  }

  selectGender(option: any, event: Event) {
    event.stopPropagation();
    this.gender = option.value;
    this.selectedGenderLabel = option.label;
    this.isGenderDropdownOpen = false;
  }

  // Similarly for religion
  toggleReligionDropdown(event: Event) {
    event.stopPropagation();
    this.isReligionDropdownOpen = !this.isReligionDropdownOpen;
    this.closeOtherDropdowns('religion');
  }

  selectReligion(option: any, event: Event) {
    event.stopPropagation();
    this.religion = option.value;
    this.selectedReligionLabel = option.label;
    this.isReligionDropdownOpen = false;
  }

  // Country dropdown
  toggleCountryDropdown(event: Event) {
    event.stopPropagation();
    this.isCountryDropdownOpen = !this.isCountryDropdownOpen;
    this.closeOtherDropdowns('country');
  }

  selectCountry(country: any, event: Event) {
    event.stopPropagation();
    this.selectedCountry = country.code;
    this.selectedCountryLabel = country.name;
    this.isCountryDropdownOpen = false;
    // Also clear city selection when country changes
    this.selectedCity = '';
    this.selectedCityLabel = '';
    this.cities = this.countryCityService.getCitiesByCountryCode(country.code);
  }

  // City dropdown
  toggleCityDropdown(event: Event) {
    event.stopPropagation();
    this.isCityDropdownOpen = !this.isCityDropdownOpen;
    this.closeOtherDropdowns('city');
  }

  selectCity(city: string, event: Event) {
    event.stopPropagation();
    this.selectedCity = city;
    this.selectedCityLabel = city;
    this.isCityDropdownOpen = false;
  }

  // Source dropdown
  toggleSourceDropdown(event: Event) {
    event.stopPropagation();
    this.isSourceDropdownOpen = !this.isSourceDropdownOpen;
    this.closeOtherDropdowns('source');
  }

  selectSource(option: any, event: Event) {
    event.stopPropagation();
    this.source = option.value;
    this.selectedSourceLabel = option.label;
    this.isSourceDropdownOpen = false;
  }

  // Helper to close all other dropdowns
  private closeOtherDropdowns(current: string) {
    if (current !== 'gender') this.isGenderDropdownOpen = false;
    if (current !== 'religion') this.isReligionDropdownOpen = false;
    if (current !== 'country') this.isCountryDropdownOpen = false;
    if (current !== 'city') this.isCityDropdownOpen = false;
    if (current !== 'source') this.isSourceDropdownOpen = false;
  }

  @HostListener('document:click', ['$event'])
  closeAllDropdowns(event?: Event) {
    // ← add event parameter (optional)
    this.isGenderDropdownOpen = false;
    this.isReligionDropdownOpen = false;
    this.isCountryDropdownOpen = false;
    this.isCityDropdownOpen = false;
    this.isSourceDropdownOpen = false;
  }
}
