export interface Tab {
  id: string;
  title: string;
}

export interface ExperienceEntry {
  companyName: string;
  position: string;
  fromDate: string;
  toDate: string;
  isContinue: boolean;
  salary: number | null;
  expRemarks: string;
}

export interface SkillEntry {
  skillName: string;
  skillRating: number;
  skillRemarks: string;
}

export interface QualificationEntry {
  qualificationName: string;
  passingYear: string;
  isStudying: boolean;
  institute: string;
  grade: string;
  qualRemarks: string;
}

export interface AttachmentEntry {
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
