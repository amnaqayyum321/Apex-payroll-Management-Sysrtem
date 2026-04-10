import { ExperienceEntry, SkillEntry, QualificationEntry } from './Candidate-interfaces';

export interface CandidatePayloadInput {
  firstName: string;
  lastName: string;
  email: string;
  contactNumber1: string;
  contactNumber2: string;
  dateOfBirth: string;
  gender: string;
  selectedCountry: string;
  selectedCity: string;
  religion: string;
  linkedinUrl: string;
  source: string;
  active: boolean;
  remarks: string;
  experienceList: ExperienceEntry[];
  skillList: SkillEntry[];
  qualificationList: QualificationEntry[];
}

export function buildCandidatePayload(input: CandidatePayloadInput) {
  return {
    code: '',
    firstName: input.firstName ?? null,
    lastName: input.lastName ?? null,
    email: input.email ?? null,
    contactNumber1: input.contactNumber1 ?? null,
    contactNumber2: input.contactNumber2 ?? null,
    dateOfBirth: input.dateOfBirth ?? null,
    gender: input.gender ?? null,
    country: input.selectedCountry ?? null,
    city: input.selectedCity ?? null,
    religion: input.religion ?? null,
    linkedinUrl: input.linkedinUrl ?? null,
    source: input.source ?? null,
    active: input.active ?? null,
    remarks: input.remarks ?? null,

    experiences: input.experienceList.map((exp, index) => ({
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

    skills: input.skillList.map((skill, index) => ({
      skillName: skill.skillName,
      skillRating: skill.skillRating,
      lineNumber: index + 1,
      status: 'ACTIVE',
      remarks: skill.skillRemarks,
    })),

    qualifications: input.qualificationList.map((qual, index) => ({
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
