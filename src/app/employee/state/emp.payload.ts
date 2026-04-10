/**
 * emp.payload.ts
 *
 * Pure functions — no class needed.
 * Imported and called from employees.component.ts.
 */
import { ToastrService } from 'ngx-toastr';
import {
  Qualification,
  Skill,
  Experience,
  Leave,
  BankAccount,
  EmployeeDocument,
  Belonging,
  FamilyMember,
  Position,
} from '../models/employee.model';

export interface CoreFields {
  code: string;
  userFirstName: string;
  email: string;
  employmentStatus: string;
  employeeType: string;
}

export interface EmployeePayloadInput extends CoreFields {
  userLastName: string;
  mobileNumber: string;
  onboardingStatus: string;
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
  Leaves: Leave[];
}

// ─── Validation ────────────────────────────────────────────────────────────────

export function validateCoreFields(fields: CoreFields, toastr: ToastrService): boolean {
  if (
    !fields.code ||
    !fields.userFirstName ||
    !fields.email ||
    !fields.employmentStatus ||
    !fields.employeeType
  ) {
    toastr.error('Please fill in all required fields', 'Validation Error');
    return false;
  }
  return true;
}

export function validateNewUserFields(
  roleCode: string,
  userPassword: string,
  toastr: ToastrService,
): boolean {
  if (!roleCode || !userPassword) {
    toastr.error('Please fill in Role Code and Password', 'Validation Error');
    return false;
  }
  if (userPassword.length < 8) {
    toastr.error('Password must be at least 8 characters', 'Validation Error');
    return false;
  }
  return true;
}

// ─── Payload Builder ──────────────────────────────────────────────────────────

export function buildEmployeePayload(input: EmployeePayloadInput) {
  return {
    code: input.code,
    userFirstName: input.userFirstName,
    userLastName: input.userLastName,
    email: input.email,
    mobileNumber: input.mobileNumber,
    employmentStatus: input.employmentStatus,
    onboardingStatus: input.onboardingStatus,
    employeeType: input.employeeType,
    dateOfBirth: input.dateOfBirth || null,
    dateOfJoining: input.dateOfJoining || null,
    dateOfLeaving: input.dateOfLeaving || null,
    remarks: input.remarks,
    qualifications: input.qualifications,
    skills: input.skills,
    experiences: input.experiences.map((exp) => ({
      ...exp,
      endDate: exp.endDate || null,
    })),
    bankAccounts: input.bankAccounts,
    documents: input.documents.map((doc) => ({
      lineNumber: doc.lineNumber,
      idTypePublicId: doc.idTypePublicId,
      documentNumber: doc.documentNumber,
      issuedDate: doc.issuedDate,
      expiryDate: doc.expiryDate,
      fileUrl: doc.fileUrl,
      status: doc.status,
      remarks: doc.remarks,
    })),
    belongings: input.belongings,
    familyMembers: input.familyMembers,
    positions: input.positions.map((pos) => ({
      ...pos,
      isPrimaryPosition: (pos as any).primaryPosition ?? pos.isPrimaryPosition,
    })),
    leaveEntitlements: input.Leaves.map((leave) => ({
      leaveTypePublicId:
        typeof leave.leaveTypePublicId === 'object'
          ? ((leave.leaveTypePublicId as any)?.publicId ?? null)
          : leave.leaveTypePublicId,
      totalLeavesPerYear: Number(leave.totalLeavesPerYear),
      remarks: leave.remarks,
      active: leave.active,
    })),
  };
}

export function buildCreatePayload(
  employeePayload: ReturnType<typeof buildEmployeePayload>,
  userPublicId: string,
  email: string,
  userPassword: string,
  roleCode: string,
  userFirstName: string,
  userLastName: string,
  mobileNumber: string,
) {
  return {
    employee: employeePayload,
    userPublicId: userPublicId || null,
    user: {
      email,
      password: userPassword,
      roleCode,
      firstName: userFirstName,
      lastName: userLastName,
      phoneNumber: mobileNumber,
    },
  };
}
