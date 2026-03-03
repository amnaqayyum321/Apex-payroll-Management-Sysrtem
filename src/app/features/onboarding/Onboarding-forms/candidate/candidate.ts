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
  activeTabId: string = 'experience';
  activeTab: string = 'experience';
  countries: ICountry[] = [];
  cities: string[] = [];
  selectedCountry: string = '';
  selectedCity: string = '';
  remarks: string = '';
  candiateObj = {};
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
  code = '';
  firstName = '';
  lastName = '';
  email = '';
  contactNumber1 = '';
  contactNumber2 = '';
  dateOfBirth = '';
  gender = 'MALE';
  religion = 'ISLAM';
  linkedinUrl = '';
  source = 'REQUISITION';
  active = false;
  title: 'create' | 'edit' = 'create';
  candidateId!: string;
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
    this.router.navigate(['/panel/onboarding/view-all-candidates']);
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
    debugger;
    const payload = this.buildPayload();
    console.log('Payload Object:', payload);
    console.log('Payload JSON:', JSON.stringify(payload, null, 2));
    this.loader.show();
    this.onboardingService.CreatenewCandidate(payload).subscribe(
      (res: any) => {
        if (res.success) {
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
    const payload = this.buildPayload();
    console.log('Payload Object:', payload);
    console.log('Payload JSON:', JSON.stringify(payload, null, 2));
    this.loader.show();
    this.onboardingService.updateCandidate(this.candidateId, payload).subscribe(
      (res: any) => {
        if (res.success) {
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
        this.firstName = data.firstName;
        this.lastName = data.lastName;
        this.email = data.email;
        this.contactNumber1 = data.contactNumber1;
        this.contactNumber2 = data.contactNumber2;
        this.dateOfBirth = data.dateOfBirth;
        this.gender = data.gender;
        this.selectedCountry = data.country;
        this.selectedCity = data.city;
        this.religion = data.religion;
        this.linkedinUrl = data.linkedinUrl;
        this.source = data.source;
        this.remarks = data.remarks;
        this.experienceList = res.experiences.map((e: any) => ({
          companyName: e.companyName,
          position: e.position,
          fromDate: e.fromDate,
          toDate: e.toDate,
          isContinue: e.currentlyWorking,
          salary: e.lastSalaryDrawn,
          expRemarks: e.remarks,
        }));
        this.skillList = res.skills.map((s: any) => ({
          skillName: s.skillName,
          skillRating: s.skillRating,
          skillRemarks: s.remarks,
        }));

        this.qualificationList = res.qualifications.map((q: any) => ({
          qualificationName: q.qualificationName,
          passingYear: q.passingYear,
          isStudying: q.currentlyStudying,
          institute: q.institute,
          grade: q.gradeCgpa,
          qualRemarks: q.remarks,
        }));
      }
    });
  }
  save() {
    this.title === 'create' ? this.SubmitCandidate() : this.UpdateCandidate();
  }

  cancel() {
    this.router.navigate(['/panel/onboarding/view-all-candidates']);
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
    this.gender = 'MALE';
    this.religion = 'ISLAM';
    this.linkedinUrl = '';
    this.source = 'REQUISITION';
    this.active = false;
    this.remarks = '';
    this.selectedCountry = '';
    this.selectedCity = '';
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
    };

    const fileInput = document.getElementById('attachFile') as HTMLInputElement;
    if (fileInput) fileInput.value = '';
    this.activeTab = 'experience';
    this.activeTabId = 'experience';
  }
}
