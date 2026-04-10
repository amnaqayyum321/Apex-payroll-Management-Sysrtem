export const DEFAULT_EXP_FORM = {
  companyName: '',
  position: '',
  fromDate: '',
  toDate: '',
  isContinue: false,
  salary: null as number | null,
  expRemarks: '',
};

export const DEFAULT_SKILL_FORM = {
  skillName: '',
  skillRating: 1,
  skillRemarks: '',
};

export const DEFAULT_QUAL_FORM = {
  qualificationName: '',
  passingYear: '',
  isStudying: false,
  institute: '',
  grade: '',
  qualRemarks: '',
};

export const DEFAULT_ATTACH_FORM: {
  file: File | null;
  remarks: string;
  context: string;
  description: string;
} = {
  file: null,
  remarks: '',
  context: 'CANDIDATE_DOCUMENTS',
  description: '',
};
