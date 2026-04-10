import { Component, HostListener, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpParams } from '@angular/common/http';
import { forkJoin } from 'rxjs';

import { ToastrService } from 'ngx-toastr';
import { LoaderService } from '../../../../core/services/management-services/loader.service';
import { OnboardingService } from '../../Services/onboarding';
import { FormsService } from '../../../forms/Services/forms';
import { CountryCityService, ICountry } from '../../../../Service/country';

import { CandidateListOps } from '../../ALL-Candidate-Data/candidate-list-ops';
import { Tab, AttachmentEntry } from '../../ALL-Candidate-Data/Candidate-interfaces';
import { SIDEBAR_TABS } from '../../ALL-Candidate-Data/Candidate-constants';
import {
  validateCandidateForm,
  validateExperienceList,
  validateSkillList,
  validateQualificationList,
  validateAttachmentList,
} from '../../ALL-Candidate-Data/Candidate-validators';
import {
  buildCandidatePayload,
  CandidatePayloadInput,
} from '../../ALL-Candidate-Data/Candidate-payload';

@Component({
  selector: 'app-candidate',
  imports: [FormsModule, CommonModule],
  templateUrl: './candidate.html',
  styleUrl: './candidate.scss',
})
export class Candidate extends CandidateListOps implements OnInit {
  activeTabId = 'experience';
  activeTab = 'experience';
  sidebarTabs: Tab[] = SIDEBAR_TABS;

  code = '';
  firstName = '';
  lastName = '';
  email = '';
  contactNumber1 = '';
  contactNumber2 = '';
  dateOfBirth = '';
  gender = '';
  religion = '';
  source = '';
  linkedinUrl = '';
  active = false;
  remarks = '';
  title: 'create' | 'edit' = 'create';
  candidateId!: string;

  countries: ICountry[] = [];
  cities: string[] = [];
  selectedCountry = '';
  selectedCity = '';

  constructor(
    private router: Router,
    private toastr: ToastrService,
    private loader: LoaderService,
    private onboardingService: OnboardingService,
    private formsService: FormsService,
    private activatedRoute: ActivatedRoute,
    private countryCityService: CountryCityService,
  ) {
    super();
  }

  protected get _toastr(): ToastrService {
    return this.toastr;
  }
  protected get _countryCityService(): CountryCityService {
    return this.countryCityService;
  }

  ngOnInit() {
    this.countries = this.countryCityService.getCountries();
    const id = this.activatedRoute.snapshot.paramMap.get('id');
    if (id) {
      this.title = 'edit';
      this.candidateId = id;
      this.getCandidateById(id);
    }
  }

  setTab(tab: string) {
    this.activeTab = tab;
    this.activeTabId = tab;
  }

  onCountryChange(countryCode: string): void {
    this.cities = this.countryCityService.getCitiesByCountryCode(countryCode);
    this.selectedCity = '';
  }

  private validateForm(): boolean {
    return validateCandidateForm(
      {
        firstName: this.firstName,
        lastName: this.lastName,
        email: this.email,
        contactNumber1: this.contactNumber1,
        gender: this.gender,
      },
      this.toastr,
    );
  }

  private validateAllTabs(): boolean {
    if (!validateExperienceList(this.experienceList, this.toastr)) {
      this.setTab('experience');
      return false;
    }
    if (!validateSkillList(this.skillList, this.toastr)) {
      this.setTab('skills');
      return false;
    }
    if (!validateQualificationList(this.qualificationList, this.toastr)) {
      this.setTab('qualification');
      return false;
    }
    if (!validateAttachmentList(this.attachmentList, this.toastr)) {
      this.setTab('attachment');
      return false;
    }
    return true;
  }

  private getPayloadInput(): CandidatePayloadInput {
    return {
      firstName: this.firstName,
      lastName: this.lastName,
      email: this.email,
      contactNumber1: this.contactNumber1,
      contactNumber2: this.contactNumber2,
      dateOfBirth: this.dateOfBirth,
      gender: this.gender,
      selectedCountry: this.selectedCountry,
      selectedCity: this.selectedCity,
      religion: this.religion,
      linkedinUrl: this.linkedinUrl,
      source: this.source,
      active: this.active,
      remarks: this.remarks,
      experienceList: this.experienceList,
      skillList: this.skillList,
      qualificationList: this.qualificationList,
    };
  }

  save() {
    if (!this.validateForm()) return;
    if (!this.validateAllTabs()) return;
    this.title === 'create' ? this.SubmitCandidate() : this.UpdateCandidate();
  }

  SubmitCandidate() {
    const payload = buildCandidatePayload(this.getPayloadInput());
    console.log('Payload Object:', payload);
    console.log('Payload JSON:', JSON.stringify(payload, null, 2));

    this.loader.show();
    this.onboardingService.CreatenewCandidate(payload).subscribe(
      (res: any) => {
        this.loader.hide();
        if (res.success) {
          if (this.attachmentList.length > 0) {
            this.uploadAttachments(res.data?.publicId, 'CANDIDATE');
          }
          this.resetForm();
          this.toastr.success('Candidate Created Successfully');
          setTimeout(() => this.router.navigate(['/panel/onboarding/view-candidate-list']), 1500);
        }
      },
      (err: any) => {
        console.log(err);
        this.toastr.error('Error creating candidate');
        this.loader.hide();
      },
    );
  }

  UpdateCandidate() {
    const payload = buildCandidatePayload(this.getPayloadInput());
    console.log('Payload Object:', payload);
    console.log('Payload JSON:', JSON.stringify(payload, null, 2));

    this.loader.show();
    this.onboardingService.updateCandidate(this.candidateId, payload).subscribe(
      (res: any) => {
        if (res.success) {
          const hasNew = this.attachmentList.some((a) => !a.isServerFile && a.file);
          if (hasNew) this.uploadAttachments(this.candidateId, 'CANDIDATE');
          this.resetForm();
          this.toastr.success('Candidate Updated Successfully!');
          setTimeout(() => this.router.navigate(['/panel/onboarding/view-candidate-list']), 1500);
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
        const d = res.data;

        this.code = d.code;
        this.firstName = d.firstName;
        this.lastName = d.lastName;
        this.email = d.email;
        this.contactNumber1 = d.contactNumber1;
        this.contactNumber2 = d.contactNumber2;
        this.dateOfBirth = d.dateOfBirth;
        this.gender = d.gender;
        this.religion = d.religion;
        this.linkedinUrl = d.linkedinUrl;
        this.source = d.source;
        this.remarks = d.remarks;
        this.active = d.isActive;

        this.selectedCountry = d.country;
        this.cities = this.countryCityService.getCitiesByCountryCode(d.country);
        this.selectedCity = d.city;

        this.selectedGenderLabel =
          this.genderOptions.find((g) => g.value === this.gender)?.label || '';
        this.selectedReligionLabel =
          this.religionOptions.find((r) => r.value === this.religion)?.label || '';
        this.selectedCountryLabel =
          this.countries.find((c) => c.code === this.selectedCountry)?.name || '';
        this.selectedCityLabel = this.selectedCity;
        this.selectedSourceLabel =
          this.sourceOptions.find((s) => s.value === this.source)?.label || '';

        this.experienceList = d.experiences.map((e: any) => ({
          companyName: e.companyName,
          position: e.position,
          fromDate: e.fromDate,
          toDate: e.toDate,
          isContinue: e.currentlyWorking,
          salary: e.lastSalaryDrawn,
          expRemarks: e.remarks,
        }));

        this.skillList = d.skills.map((s: any) => ({
          skillName: s.skillName,
          skillRating: s.skillRating,
          skillRemarks: s.remarks,
        }));

        this.qualificationList = d.qualifications.map((q: any) => ({
          qualificationName: q.qualificationName,
          passingYear: q.passingYear,
          isStudying: q.currentlyStudying,
          institute: q.institute,
          grade: q.gradeCgpa,
          qualRemarks: q.remarks,
        }));

        this.attachmentList = (d.attachments || []).map((a: any) => ({
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

  uploadAttachments(entityPublicId: string, entityType: string) {
    const newAttachments = this.attachmentList.filter((a) => !a.isServerFile && a.file);
    if (newAttachments.length === 0) {
      this.loader.hide();
      return;
    }

    const uploads = newAttachments.map((att) => {
      const fd = new FormData();
      fd.append('file', att.file!);
      const params = new HttpParams()
        .set('context', att.context)
        .set('entityType', entityType)
        .set('entityPublicId', entityPublicId)
        .set('description', att.description);
      return this.onboardingService.uploadAttachment(fd, params);
    });

    forkJoin(uploads).subscribe(
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

    this.loader.show();
    this.onboardingService.downloadAttachment(publicId).subscribe(
      (res: any) => {
        if (res?.message) {
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
    this.cities = [];
    this.selectedGenderLabel = '';
    this.selectedReligionLabel = '';
    this.selectedCountryLabel = '';
    this.selectedCityLabel = '';
    this.selectedSourceLabel = '';

    this.resetAllListsAndForms();

    this.activeTab = 'experience';
    this.activeTabId = 'experience';
  }

  hideForm() {
    this.resetForm();
  }
  cancelForm() {
    this.resetForm();
    this.router.navigate(['/panel/onboarding/view-candidate-list']);
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(_event?: Event) {
    this.closeAllDropdowns();
  }
}
