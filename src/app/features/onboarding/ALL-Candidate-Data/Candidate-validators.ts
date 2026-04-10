import { ToastrService } from 'ngx-toastr';
import {
  ExperienceEntry,
  SkillEntry,
  QualificationEntry,
  AttachmentEntry,
} from './Candidate-interfaces';

export function validateCandidateForm(
  fields: {
    firstName: string;
    lastName: string;
    email: string;
    contactNumber1: string;
    gender: string;
  },
  toastr: ToastrService,
): boolean {
  if (!fields.firstName?.trim()) {
    toastr.error('First Name is required');
    return false;
  }
  if (!fields.lastName?.trim()) {
    toastr.error('Last Name is required');
    return false;
  }
  if (!fields.email?.trim()) {
    toastr.error('Email is required');
    return false;
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(fields.email)) {
    toastr.error('Please enter a valid Email');
    return false;
  }
  if (!fields.contactNumber1?.trim()) {
    toastr.error('Contact Number 1 is required');
    return false;
  }
  if (!fields.gender) {
    toastr.error('Gender is required');
    return false;
  }
  return true;
}
export function validateExperienceList(list: ExperienceEntry[], toastr: ToastrService): boolean {
  if (list.length === 0) return true;

  for (let i = 0; i < list.length; i++) {
    const exp = list[i];
    if (!exp.companyName?.trim()) {
      toastr.error(`Experience ${i + 1}: Company Name required`);
      return false;
    }
    if (!exp.fromDate) {
      toastr.error(`Experience ${i + 1}: From Date required`);
      return false;
    }
    if (!exp.position?.trim()) {
      toastr.error(`Experience ${i + 1}: Position required`);
      return false;
    }
    if (!exp.isContinue && !exp.toDate) {
      toastr.error(`Experience ${i + 1}: To Date required`);
      return false;
    }
  }
  return true;
}

export function validateSkillList(list: SkillEntry[], toastr: ToastrService): boolean {
  if (list.length === 0) return true;

  for (let i = 0; i < list.length; i++) {
    const skill = list[i];
    if (!skill.skillName?.trim()) {
      toastr.error(`Skill ${i + 1}: Skill Name required`);
      return false;
    }
    if (!skill.skillRating) {
      toastr.error(`Skill ${i + 1}: Rating required`);
      return false;
    }
  }
  return true;
}

export function validateQualificationList(
  list: QualificationEntry[],
  toastr: ToastrService,
): boolean {
  if (list.length === 0) return true;

  for (let i = 0; i < list.length; i++) {
    const q = list[i];
    if (!q.qualificationName?.trim()) {
      toastr.error(`Qualification ${i + 1}: Name required`);
      return false;
    }
    if (!q.institute?.trim()) {
      toastr.error(`Qualification ${i + 1}: Institute required`);
      return false;
    }
    if (!q.isStudying && !q.passingYear) {
      toastr.error(`Qualification ${i + 1}: Passing Year required`);
      return false;
    }
  }
  return true;
}

export function validateAttachmentList(list: AttachmentEntry[], toastr: ToastrService): boolean {
  if (list.length === 0) return true;

  for (let i = 0; i < list.length; i++) {
    if (!list[i].fileName) {
      toastr.error(`Attachment ${i + 1}: File required`);
      return false;
    }
  }
  return true;
}
