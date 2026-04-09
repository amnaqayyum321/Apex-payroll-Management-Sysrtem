// ─────────────────────────────────────────────────────────────────────────────
// employees/utils/employee-payload.builder.ts
// Pure functions that transform component state → API payload shapes.
// Keeping this logic outside the component makes it independently testable.
// ─────────────────────────────────────────────────────────────────────────────

import {
  Experience,
  EmployeeDocument,
  Position,
  Leave,
  Qualification,
  Skill,
  BankAccount,
  Belonging,
  FamilyMember,
} from '../models/employee.interfaces';

function resolvePublicId(value: string | { publicId: string } | null): string | null {
  if (!value) return null;
  if (typeof value === 'object') return value.publicId ?? null;
  return value;
}

export function buildExperiencePayload(experiences: Experience[]) {
  return experiences.map((exp) => ({
    ...exp,
    endDate: exp.endDate || null,
  }));
}

export function buildDocumentPayload(documents: EmployeeDocument[]) {
  return documents.map((doc) => ({
    ...doc,
    idTypePublicId: resolvePublicId(doc.idTypePublicId as any),
  }));
}

export function buildPositionPayload(positions: Position[]) {
  return positions.map((pos) => ({
    ...pos,
    isPrimaryPosition: (pos as any).primaryPosition ?? pos.isPrimaryPosition,
  }));
}

export function buildLeavePayload(leaves: Leave[]) {
  return leaves.map((leave) => ({
    leaveTypePublicId: resolvePublicId(leave.leaveTypePublicId as any),
    totalLeavesPerYear: Number(leave.totalLeavesPerYear),
    remarks: leave.remarks,
    active: leave.active,
  }));
}
export interface EmployeePayloadOptions {
  code: string;
  userFirstName: string;
  userLastName: string;
  email: string;
  mobileNumber: string;
  employmentStatus: string;
  onboardingStatus: string;
  employeeType: string;
  dateOfBirth: string;
  dateOfJoining: string;
  dateOfLeaving: string;
  remarks: string;
  qualifications: Qualification[];
  skills: Skill[];
  experiences: Experience[];
  bankAccounts: BankAccount[];
  documents: EmployeeDocument[];
  belongings: Belonging[];
  familyMembers: FamilyMember[];
  positions: Position[];
  leaves: Leave[];
}

export function buildEmployeePayload(opts: EmployeePayloadOptions) {
  return {
    code: opts.code,
    userFirstName: opts.userFirstName,
    userLastName: opts.userLastName,
    email: opts.email,
    mobileNumber: opts.mobileNumber,
    employmentStatus: opts.employmentStatus,
    onboardingStatus: opts.onboardingStatus,
    employeeType: opts.employeeType,
    dateOfBirth: opts.dateOfBirth || null,
    dateOfJoining: opts.dateOfJoining || null,
    dateOfLeaving: opts.dateOfLeaving || null,
    remarks: opts.remarks,
    qualifications: opts.qualifications,
    skills: opts.skills,
    experiences: buildExperiencePayload(opts.experiences),
    bankAccounts: opts.bankAccounts,
    documents: buildDocumentPayload(opts.documents),
    belongings: opts.belongings,
    familyMembers: opts.familyMembers,
    positions: buildPositionPayload(opts.positions),
    leaveEntitlements: buildLeavePayload(opts.leaves),
  };
}
