/**
 * emp.form-list.ts
 *
 * Abstract mixin base class.
 * Employees component extends this → HTML bindings stay 100% unchanged.
 * All arrays, forms, edit-flags declared HERE so the component
 * does NOT redeclare them.
 */
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
import {
  DEFAULT_SKILLS_FORM,
  DEFAULT_EXP_FORM,
  DEFAULT_LEAVE_FORM,
  DEFAULT_QUALIFICATION_FORM,
  DEFAULT_BANK_ACCOUNT_FORM,
  DEFAULT_DOCUMENT_FORM,
  DEFAULT_BELONGING_FORM,
  DEFAULT_FAMILY_MEMBER_FORM,
  DEFAULT_POSITION_FORM,
} from '../state/employee-form-defaults.defaults';
import { EmpDropdown } from '../state/employee-dropdown.state';

export abstract class EmpFormList extends EmpDropdown {
  // ─── Data Arrays ───────────────────────────────────────────────────────────
  qualifications: Qualification[] = [];
  skills: Skill[] = [];
  experiences: Experience[] = [];
  Leaves: Leave[] = [];
  bankAccounts: BankAccount[] = [];
  documents: EmployeeDocument[] = [];
  belongings: Belonging[] = [];
  familyMembers: FamilyMember[] = [];
  positions: Position[] = [];

  // ─── Form Models ───────────────────────────────────────────────────────────
  skillsForm = { ...DEFAULT_SKILLS_FORM };
  expform = { ...DEFAULT_EXP_FORM };
  leaveForm = { ...DEFAULT_LEAVE_FORM };
  qualificationForm = { ...DEFAULT_QUALIFICATION_FORM };
  bankAccountForm = { ...DEFAULT_BANK_ACCOUNT_FORM };
  documentForm = { ...DEFAULT_DOCUMENT_FORM };
  belongingForm = { ...DEFAULT_BELONGING_FORM };
  familyMemberForm = { ...DEFAULT_FAMILY_MEMBER_FORM };
  positionForm = { ...DEFAULT_POSITION_FORM };

  // ─── Edit Flags & Indices ──────────────────────────────────────────────────
  isEditingExperience = false;
  editingExperienceIndex = -1;
  isEditingSkill = false;
  editingSkillIndex = -1;
  isEditingQualification = false;
  editingQualificationIndex = -1;
  isEditingBankAccount = false;
  editingBankAccountIndex = -1;
  isEditingDocument = false;
  editingDocumentIndex = -1;
  isEditingBelonging = false;
  editingBelongingIndex = -1;
  isEditingFamilyMember = false;
  editingFamilyMemberIndex = -1;
  isEditingPosition = false;
  editingPositionIndex = -1;
  isEditingLeave = false;
  editingLeaveIndex = -1;

  // ─── Shared list references (set by component, used in editPosition) ───────
  departmentList: any;
  designationList: any;
  companyBranchList: any;
  EmployeeList: any[] = [];
  EmployeeGradeList: any;
  EmployeeCategoryList: any;
  JobTitleList: any;
  shiftList: any;
  WorkScheduleList: any[] = [];

  // ═══════════════════════════════════════════════════════════════════════════
  // HELPER
  // ═══════════════════════════════════════════════════════════════════════════
  protected reindexArray(arr: { lineNumber: number }[]) {
    arr.forEach((item, i) => (item.lineNumber = i + 1));
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // QUALIFICATION
  // ═══════════════════════════════════════════════════════════════════════════
  addQualification() {
    if (this.isEditingQualification) {
      this.updateQualification();
    } else {
      this.qualifications.push({
        lineNumber: this.qualifications.length + 1,
        qualificationName: this.qualificationForm.qualificationName,
        institutionName: this.qualificationForm.institutionName,
        passingYear: this.qualificationForm.passingYear,
        grade: this.qualificationForm.grade,
        resultStatus: this.qualificationForm.resultStatus,
        status: this.qualificationForm.status,
        remarks: this.qualificationForm.remarks,
      });
      this.resetQualificationForm();
    }
  }

  editQualification(index: number) {
    const qual = this.qualifications[index];
    this.qualificationForm = {
      qualificationName: qual.qualificationName,
      institutionName: qual.institutionName,
      passingYear: qual.passingYear,
      grade: qual.grade,
      resultStatus: qual.resultStatus,
      status: qual.status,
      remarks: qual.remarks,
    };
    this.selectedResultStatus = qual.resultStatus;
    this.selectedQualificationStatus = qual.status;
    this.isEditingQualification = true;
    this.editingQualificationIndex = index;
  }

  updateQualification() {
    if (this.editingQualificationIndex !== -1) {
      this.qualifications[this.editingQualificationIndex] = {
        ...this.qualifications[this.editingQualificationIndex],
        qualificationName: this.qualificationForm.qualificationName,
        institutionName: this.qualificationForm.institutionName,
        passingYear: this.qualificationForm.passingYear,
        grade: this.qualificationForm.grade,
        resultStatus: this.qualificationForm.resultStatus,
        status: this.qualificationForm.status,
        remarks: this.qualificationForm.remarks,
      };
      this.reindexArray(this.qualifications);
      this.resetQualificationForm();
    }
  }

  resetQualificationForm() {
    this.qualificationForm = { ...DEFAULT_QUALIFICATION_FORM };
    this.selectedResultStatus = '';
    this.selectedQualificationStatus = '';
    this.isEditingQualification = false;
    this.editingQualificationIndex = -1;
  }

  removeQualification(index: number) {
    this.qualifications.splice(index, 1);
    this.reindexArray(this.qualifications);
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // SKILL
  // ═══════════════════════════════════════════════════════════════════════════
  addSkill() {
    if (this.isEditingSkill) {
      this.updateSkill();
    } else {
      this.skills.push({
        lineNumber: this.skills.length + 1,
        skillName: this.skillsForm.skillName,
        proficiencyLevel: this.skillsForm.proficiencyLevel,
        yearsOfExperience: this.skillsForm.yearsOfExperience,
        lastUsedYear: this.skillsForm.lastUsedYear,
        status: this.skillsForm.status,
        remarks: this.skillsForm.remarks,
      });
      this.resetSkillForm();
    }
  }

  editSkill(index: number) {
    const skill = this.skills[index];
    this.skillsForm = {
      skillName: skill.skillName,
      proficiencyLevel: skill.proficiencyLevel,
      yearsOfExperience: skill.yearsOfExperience,
      lastUsedYear: skill.lastUsedYear,
      remarks: skill.remarks,
      status: skill.status,
    };
    this.selectedProficiency = skill.proficiencyLevel;
    this.selectedSkillStatus = skill.status;
    this.isEditingSkill = true;
    this.editingSkillIndex = index;
  }

  updateSkill() {
    if (this.editingSkillIndex !== -1) {
      this.skills[this.editingSkillIndex] = {
        ...this.skills[this.editingSkillIndex],
        skillName: this.skillsForm.skillName,
        proficiencyLevel: this.skillsForm.proficiencyLevel,
        yearsOfExperience: this.skillsForm.yearsOfExperience,
        lastUsedYear: this.skillsForm.lastUsedYear,
        status: this.skillsForm.status,
        remarks: this.skillsForm.remarks,
      };
      this.reindexArray(this.skills);
      this.resetSkillForm();
    }
  }

  resetSkillForm() {
    this.skillsForm = { ...DEFAULT_SKILLS_FORM };
    this.selectedProficiency = '';
    this.selectedSkillStatus = '';
    this.isEditingSkill = false;
    this.editingSkillIndex = -1;
  }

  removeSkill(index: number) {
    this.skills.splice(index, 1);
    this.reindexArray(this.skills);
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // EXPERIENCE
  // ═══════════════════════════════════════════════════════════════════════════
  addExperience() {
    if (this.isEditingExperience) {
      this.updateExperience();
    } else {
      this.experiences.push({
        lineNumber: this.experiences.length + 1,
        organizationName: this.expform.organizationName,
        roleName: this.expform.roleName,
        startDate: this.expform.startDate,
        endDate: this.expform.endDate,
        currentlyWorking: this.expform.currentlyWorking,
        responsibilities: this.expform.responsibilities,
        status: this.expform.status,
        remarks: this.expform.remarks,
      });
      this.resetExpForm();
    }
  }

  editExperience(index: number) {
    const exp = this.experiences[index];
    this.expform = {
      lineNumber: '',
      organizationName: exp.organizationName,
      roleName: exp.roleName,
      startDate: exp.startDate,
      endDate: exp.endDate,
      currentlyWorking: exp.currentlyWorking,
      responsibilities: exp.responsibilities,
      status: exp.status,
      remarks: exp.remarks,
    };
    this.selectedExperienceStatus = exp.status;
    this.isEditingExperience = true;
    this.editingExperienceIndex = index;
  }

  updateExperience() {
    if (this.editingExperienceIndex !== -1) {
      this.experiences[this.editingExperienceIndex] = {
        ...this.experiences[this.editingExperienceIndex],
        organizationName: this.expform.organizationName,
        roleName: this.expform.roleName,
        startDate: this.expform.startDate,
        endDate: this.expform.endDate,
        currentlyWorking: this.expform.currentlyWorking,
        responsibilities: this.expform.responsibilities,
        status: this.expform.status,
        remarks: this.expform.remarks,
      };
      this.reindexArray(this.experiences);
      this.resetExpForm();
    }
  }

  resetExpForm() {
    this.expform = { ...DEFAULT_EXP_FORM };
    this.selectedExperienceStatus = '';
    this.isEditingExperience = false;
    this.editingExperienceIndex = -1;
  }

  removeExperience(index: number) {
    this.experiences.splice(index, 1);
    this.reindexArray(this.experiences);
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // BANK ACCOUNT
  // ═══════════════════════════════════════════════════════════════════════════
  addBankAccount() {
    if (this.isEditingBankAccount) {
      this.updateBankAccount();
    } else {
      this.bankAccounts.push({
        lineNumber: this.bankAccounts.length + 1,
        bankName: this.bankAccountForm.bankName,
        branchCode: this.bankAccountForm.branchCode,
        accountNumber: this.bankAccountForm.accountNumber,
        accountHolderName: this.bankAccountForm.accountHolderName,
        iban: this.bankAccountForm.iban,
        swiftCode: this.bankAccountForm.swiftCode,
        isPrimaryAccount:
          this.bankAccounts.length === 0 ? true : this.bankAccountForm.isPrimaryAccount,
        status: this.bankAccountForm.status,
        remarks: this.bankAccountForm.remarks,
      });
      this.resetBankAccountForm();
    }
  }

  editBankAccount(index: number) {
    const acc = this.bankAccounts[index];
    this.bankAccountForm = {
      bankName: acc.bankName,
      branchCode: acc.branchCode,
      accountNumber: acc.accountNumber,
      accountHolderName: acc.accountHolderName,
      iban: acc.iban,
      swiftCode: acc.swiftCode,
      isPrimaryAccount: acc.isPrimaryAccount,
      status: acc.status,
      remarks: acc.remarks,
    };
    this.selectedBankStatus = acc.status;
    this.isEditingBankAccount = true;
    this.editingBankAccountIndex = index;
  }

  updateBankAccount() {
    if (this.editingBankAccountIndex !== -1) {
      this.bankAccounts[this.editingBankAccountIndex] = {
        ...this.bankAccounts[this.editingBankAccountIndex],
        bankName: this.bankAccountForm.bankName,
        branchCode: this.bankAccountForm.branchCode,
        accountNumber: this.bankAccountForm.accountNumber,
        accountHolderName: this.bankAccountForm.accountHolderName,
        iban: this.bankAccountForm.iban,
        swiftCode: this.bankAccountForm.swiftCode,
        isPrimaryAccount: this.bankAccountForm.isPrimaryAccount,
        status: this.bankAccountForm.status,
        remarks: this.bankAccountForm.remarks,
      };
      this.reindexArray(this.bankAccounts);
      this.resetBankAccountForm();
    }
  }

  resetBankAccountForm() {
    this.bankAccountForm = { ...DEFAULT_BANK_ACCOUNT_FORM };
    this.selectedBankStatus = '';
    this.isEditingBankAccount = false;
    this.editingBankAccountIndex = -1;
  }

  removeBankAccount(index: number) {
    this.bankAccounts.splice(index, 1);
    this.reindexArray(this.bankAccounts);
  }

  setPrimaryAccount(index: number) {
    this.bankAccounts.forEach((acc, i) => (acc.isPrimaryAccount = i === index));
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // DOCUMENT
  // ═══════════════════════════════════════════════════════════════════════════
  addDocument() {
    if (this.isEditingDocument) {
      this.updateDocument();
    } else {
      this.documents.push({
        lineNumber: this.documents.length + 1,
        idTypePublicId: this.documentForm.idTypePublicId,
        idTypeName: this.documentForm.idTypeName,
        documentNumber: this.documentForm.documentNumber,
        issuedDate: this.documentForm.issuedDate,
        expiryDate: this.documentForm.expiryDate,
        fileUrl: this.documentForm.fileUrl,
        status: this.documentForm.status,
        remarks: this.documentForm.remarks,
      });
      this.resetDocumentForm();
    }
  }

  editDocument(index: number) {
    const doc = this.documents[index];
    this.documentForm = {
      idTypePublicId: doc.idTypePublicId,
      idTypeName: doc.idTypeName,
      documentNumber: doc.documentNumber,
      issuedDate: doc.issuedDate,
      expiryDate: doc.expiryDate,
      fileUrl: doc.fileUrl,
      status: doc.status,
      remarks: doc.remarks,
    };
    this.selectedDocType = doc.idTypeName;
    this.selectedDocStatus = doc.status;
    this.isEditingDocument = true;
    this.editingDocumentIndex = index;
  }

  updateDocument() {
    if (this.editingDocumentIndex !== -1) {
      this.documents[this.editingDocumentIndex] = {
        ...this.documents[this.editingDocumentIndex],
        idTypePublicId: this.documentForm.idTypePublicId,
        idTypeName: this.documentForm.idTypeName,
        documentNumber: this.documentForm.documentNumber,
        issuedDate: this.documentForm.issuedDate,
        expiryDate: this.documentForm.expiryDate,
        fileUrl: this.documentForm.fileUrl,
        status: this.documentForm.status,
        remarks: this.documentForm.remarks,
      };
      this.reindexArray(this.documents);
      this.resetDocumentForm();
    }
  }

  resetDocumentForm() {
    this.documentForm = { ...DEFAULT_DOCUMENT_FORM };
    this.selectedDocType = '';
    this.selectedDocStatus = '';
    this.isEditingDocument = false;
    this.editingDocumentIndex = -1;
  }

  removeDocument(index: number) {
    this.documents.splice(index, 1);
    this.reindexArray(this.documents);
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // BELONGING
  // ═══════════════════════════════════════════════════════════════════════════
  addBelonging() {
    if (this.isEditingBelonging) {
      this.updateBelonging();
    } else {
      this.belongings.push({
        lineNumber: this.belongings.length + 1,
        belongingTypePublicId: this.belongingForm.belongingTypePublicId,
        belongingname: this.belongingForm.belongingname,
        serialNumber: this.belongingForm.serialNumber,
        issuedDate: this.belongingForm.issuedDate,
        returnDate: this.belongingForm.returnDate,
        conditionStatus: this.belongingForm.conditionStatus,
        status: this.belongingForm.status,
        remarks: this.belongingForm.remarks,
      });
      this.resetBelongingForm();
    }
  }

  editBelonging(index: number) {
    const b = this.belongings[index];
    this.belongingForm = {
      belongingTypePublicId: b.belongingTypePublicId,
      belongingname: b.belongingname,
      serialNumber: b.serialNumber,
      issuedDate: b.issuedDate,
      returnDate: b.returnDate,
      conditionStatus: b.conditionStatus,
      status: b.status,
      remarks: b.remarks,
    };
    this.selectedBelongingType = b.belongingname;
    this.selectedConditionStatus = b.conditionStatus;
    this.selectedBelongingStatus = b.status;
    this.isEditingBelonging = true;
    this.editingBelongingIndex = index;
  }

  updateBelonging() {
    if (this.editingBelongingIndex !== -1) {
      this.belongings[this.editingBelongingIndex] = {
        ...this.belongings[this.editingBelongingIndex],
        belongingTypePublicId: this.belongingForm.belongingTypePublicId,
        belongingname: this.belongingForm.belongingname,
        serialNumber: this.belongingForm.serialNumber,
        issuedDate: this.belongingForm.issuedDate,
        returnDate: this.belongingForm.returnDate,
        conditionStatus: this.belongingForm.conditionStatus,
        status: this.belongingForm.status,
        remarks: this.belongingForm.remarks,
      };
      this.reindexArray(this.belongings);
      this.resetBelongingForm();
    }
  }

  resetBelongingForm() {
    this.belongingForm = { ...DEFAULT_BELONGING_FORM };
    this.selectedBelongingType = '';
    this.selectedConditionStatus = '';
    this.selectedBelongingStatus = '';
    this.isEditingBelonging = false;
    this.editingBelongingIndex = -1;
  }

  removeBelonging(index: number) {
    this.belongings.splice(index, 1);
    this.reindexArray(this.belongings);
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // FAMILY MEMBER
  // ═══════════════════════════════════════════════════════════════════════════
  addFamilyMember() {
    if (this.isEditingFamilyMember) {
      this.updateFamilyMember();
    } else {
      this.familyMembers.push({
        lineNumber: this.familyMembers.length + 1,
        memberName: this.familyMemberForm.memberName,
        relationName: this.familyMemberForm.relationName,
        dateOfBirth: this.familyMemberForm.dateOfBirth,
        occupation: this.familyMemberForm.occupation,
        contactNumber: this.familyMemberForm.contactNumber,
        passportNo: this.familyMemberForm.passportNo,
        passportExpiry: this.familyMemberForm.passportExpiry,
        visaIqamaNo: this.familyMemberForm.visaIqamaNo,
        visaIqamaExpiry: this.familyMemberForm.visaIqamaExpiry,
        isDependent: this.familyMemberForm.isDependent,
        isBeneficiary: this.familyMemberForm.isBeneficiary,
        isEmergencyContact: this.familyMemberForm.isEmergencyContact,
        status: this.familyMemberForm.status,
        remarks: this.familyMemberForm.remarks,
      });
      this.resetFamilyMemberForm();
    }
  }

  editFamilyMember(index: number) {
    const fm = this.familyMembers[index];
    this.familyMemberForm = {
      memberName: fm.memberName,
      relationName: fm.relationName,
      dateOfBirth: fm.dateOfBirth,
      occupation: fm.occupation,
      contactNumber: fm.contactNumber,
      passportNo: fm.passportNo,
      passportExpiry: fm.passportExpiry,
      visaIqamaNo: fm.visaIqamaNo,
      visaIqamaExpiry: fm.visaIqamaExpiry,
      isDependent: fm.isDependent,
      isBeneficiary: fm.isBeneficiary,
      isEmergencyContact: fm.isEmergencyContact,
      status: fm.status,
      remarks: fm.remarks,
    };
    this.selectedRelation = fm.relationName;
    this.selectedFamilyMemberStatus = fm.status;
    this.isEditingFamilyMember = true;
    this.editingFamilyMemberIndex = index;
  }

  updateFamilyMember() {
    if (this.editingFamilyMemberIndex !== -1) {
      this.familyMembers[this.editingFamilyMemberIndex] = {
        ...this.familyMembers[this.editingFamilyMemberIndex],
        memberName: this.familyMemberForm.memberName,
        relationName: this.familyMemberForm.relationName,
        dateOfBirth: this.familyMemberForm.dateOfBirth,
        occupation: this.familyMemberForm.occupation,
        contactNumber: this.familyMemberForm.contactNumber,
        passportNo: this.familyMemberForm.passportNo,
        passportExpiry: this.familyMemberForm.passportExpiry,
        visaIqamaNo: this.familyMemberForm.visaIqamaNo,
        visaIqamaExpiry: this.familyMemberForm.visaIqamaExpiry,
        isDependent: this.familyMemberForm.isDependent,
        isBeneficiary: this.familyMemberForm.isBeneficiary,
        isEmergencyContact: this.familyMemberForm.isEmergencyContact,
        status: this.familyMemberForm.status,
        remarks: this.familyMemberForm.remarks,
      };
      this.reindexArray(this.familyMembers);
      this.resetFamilyMemberForm();
    }
  }

  resetFamilyMemberForm() {
    this.familyMemberForm = { ...DEFAULT_FAMILY_MEMBER_FORM };
    this.selectedRelation = '';
    this.selectedFamilyMemberStatus = '';
    this.isEditingFamilyMember = false;
    this.editingFamilyMemberIndex = -1;
  }

  removeFamilyMember(index: number) {
    this.familyMembers.splice(index, 1);
    this.reindexArray(this.familyMembers);
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // POSITION
  // ═══════════════════════════════════════════════════════════════════════════
  addPosition() {
    if (this.isEditingPosition) {
      this.updatePosition();
    } else {
      this.positions.push({
        lineNumber: this.positions.length + 1,
        departmentPublicId: this.positionForm.departmentPublicId,
        designationPublicId: this.positionForm.designationPublicId,
        branchPublicId: this.positionForm.branchPublicId,
        reportingManagerPublicId: this.positionForm.reportingManagerPublicId,
        employeeGradePublicId: this.positionForm.employeeGradePublicId,
        employeeCategoryPublicId: this.positionForm.employeeCategoryPublicId,
        jobTitlePublicId: this.positionForm.jobTitlePublicId,
        shiftPublicId: this.positionForm.shiftPublicId,
        workSchedulePublicId: this.positionForm.workSchedulePublicId,
        positionCode: this.positionForm.positionCode,
        positionName: this.positionForm.positionName,
        effectiveFrom: this.positionForm.effectiveFrom,
        effectiveTo: this.positionForm.effectiveTo,
        isPrimaryPosition: this.positions.length === 0 ? true : this.positionForm.isPrimaryPosition,
        status: this.positionForm.status,
        remarks: this.positionForm.remarks,
      });
      this.resetPositionForm();
    }
  }

  editPosition(index: number) {
    const pos = this.positions[index];
    this.positionForm = {
      departmentPublicId: pos.departmentPublicId,
      designationPublicId: pos.designationPublicId,
      branchPublicId: pos.branchPublicId,
      reportingManagerPublicId: pos.reportingManagerPublicId,
      employeeGradePublicId: pos.employeeGradePublicId,
      employeeCategoryPublicId: pos.employeeCategoryPublicId,
      jobTitlePublicId: pos.jobTitlePublicId,
      shiftPublicId: pos.shiftPublicId,
      workSchedulePublicId: pos.workSchedulePublicId,
      positionCode: pos.positionCode,
      positionName: pos.positionName,
      effectiveFrom: pos.effectiveFrom,
      effectiveTo: pos.effectiveTo,
      isPrimaryPosition: pos.isPrimaryPosition,
      status: pos.status,
      remarks: pos.remarks,
    };
    this.selectedPositionStatus = pos.status;

    if (pos.departmentPublicId && this.departmentList)
      this.selectedDepartment = this.departmentList.find(
        (d: any) => d.publicId === pos.departmentPublicId,
      );

    if (pos.designationPublicId && this.designationList)
      this.selectedDesignation = this.designationList.find(
        (d: any) => d.publicId === pos.designationPublicId,
      );

    if (pos.branchPublicId && this.companyBranchList)
      this.selcetedBranch = this.companyBranchList.find(
        (b: any) => b.publicId === pos.branchPublicId,
      );

    if (pos.reportingManagerPublicId && this.EmployeeList)
      this.selectedReportingManager = this.EmployeeList.find(
        (e: any) => e.employeePublicId === pos.reportingManagerPublicId,
      );

    if (pos.employeeGradePublicId && this.EmployeeGradeList)
      this.selectedEmployeeGrade = this.EmployeeGradeList.find(
        (g: any) => g.publicId === pos.employeeGradePublicId,
      );

    if (pos.employeeCategoryPublicId && this.EmployeeCategoryList)
      this.SlectedEmployeeCategory = this.EmployeeCategoryList.find(
        (c: any) => c.publicId === pos.employeeCategoryPublicId,
      );

    if (pos.jobTitlePublicId && this.JobTitleList)
      this.selectedJobTitle = this.JobTitleList.find(
        (j: any) => j.publicId === pos.jobTitlePublicId,
      );

    if (pos.shiftPublicId && this.shiftList)
      this.selectedShift = this.shiftList.find((s: any) => s.publicId === pos.shiftPublicId);

    if (pos.workSchedulePublicId && this.WorkScheduleList)
      this.selectedWorkSchedule = this.WorkScheduleList.find(
        (w: any) => w.publicId === pos.workSchedulePublicId,
      );

    this.isEditingPosition = true;
    this.editingPositionIndex = index;
  }

  updatePosition() {
    if (this.editingPositionIndex !== -1) {
      this.positions[this.editingPositionIndex] = {
        ...this.positions[this.editingPositionIndex],
        departmentPublicId: this.positionForm.departmentPublicId,
        designationPublicId: this.positionForm.designationPublicId,
        branchPublicId: this.positionForm.branchPublicId,
        reportingManagerPublicId: this.positionForm.reportingManagerPublicId,
        employeeGradePublicId: this.positionForm.employeeGradePublicId,
        employeeCategoryPublicId: this.positionForm.employeeCategoryPublicId,
        jobTitlePublicId: this.positionForm.jobTitlePublicId,
        shiftPublicId: this.positionForm.shiftPublicId,
        workSchedulePublicId: this.positionForm.workSchedulePublicId,
        positionCode: this.positionForm.positionCode,
        positionName: this.positionForm.positionName,
        effectiveFrom: this.positionForm.effectiveFrom,
        effectiveTo: this.positionForm.effectiveTo,
        isPrimaryPosition: this.positionForm.isPrimaryPosition,
        status: this.positionForm.status,
        remarks: this.positionForm.remarks,
      };
      this.reindexArray(this.positions);
      this.resetPositionForm();
    }
  }

  resetPositionForm() {
    this.positionForm = { ...DEFAULT_POSITION_FORM };
    this.selectedDepartment = null;
    this.selectedDesignation = null;
    this.selcetedBranch = null;
    this.selectedReportingManager = null;
    this.selectedEmployeeGrade = null;
    this.SlectedEmployeeCategory = null;
    this.selectedJobTitle = null;
    this.selectedShift = null;
    this.selectedWorkSchedule = null;
    this.selectedPositionStatus = '';
    this.isEditingPosition = false;
    this.editingPositionIndex = -1;
  }

  removePosition(index: number) {
    this.positions.splice(index, 1);
    this.reindexArray(this.positions);
  }

  setPrimaryPosition(index: number) {
    this.positions.forEach((pos, i) => (pos.isPrimaryPosition = i === index));
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // LEAVE
  // ═══════════════════════════════════════════════════════════════════════════
  addLeaveForm() {
    if (this.isEditingLeave) {
      this.updateLeave();
    } else {
      this.Leaves.push({
        leaveTypeName: this.leaveForm.leaveTypeName,
        leaveTypePublicId: this.leaveForm.leaveTypePublicId,
        totalLeavesPerYear: this.leaveForm.totalLeavesPerYear,
        remarks: this.leaveForm.remarks,
        active: this.leaveForm.active,
      });
      this.resetLeaveForm();
    }
  }

  editLeave(index: number) {
    const leave = this.Leaves[index];
    this.leaveForm = {
      leaveTypeName: leave.leaveTypeName,
      leaveTypePublicId: leave.leaveTypePublicId,
      totalLeavesPerYear: leave.totalLeavesPerYear,
      remarks: leave.remarks,
      active: leave.active,
    };
    this.selectLeaveType = leave.leaveTypeName;
    this.isEditingLeave = true;
    this.editingLeaveIndex = index;
  }

  updateLeave() {
    if (this.editingLeaveIndex !== -1) {
      this.Leaves[this.editingLeaveIndex] = {
        leaveTypeName: this.leaveForm.leaveTypeName,
        leaveTypePublicId: this.leaveForm.leaveTypePublicId,
        totalLeavesPerYear: this.leaveForm.totalLeavesPerYear,
        remarks: this.leaveForm.remarks,
        active: this.leaveForm.active,
      };
      this.resetLeaveForm();
    }
  }

  resetLeaveForm() {
    this.leaveForm = { ...DEFAULT_LEAVE_FORM };
    this.selectLeaveType = '';
    this.isEditingLeave = false;
    this.editingLeaveIndex = -1;
  }

  removeLeaveForm(index: number) {
    this.Leaves.splice(index, 1);
  }
}
