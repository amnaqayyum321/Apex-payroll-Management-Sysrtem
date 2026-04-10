/**
 * candidate.list-ops.ts
 *
 * Abstract base class for all list add/remove operations
 * and file helper methods.
 *
 * Extends CandidateDropdown.
 * Candidate component extends this.
 *
 * HTML mein koi change nahi — sab method/property names same hain.
 */
import { ToastrService } from 'ngx-toastr';
import { CandidateDropdown } from './Candidate-dropdown';
import {
  ExperienceEntry,
  SkillEntry,
  QualificationEntry,
  AttachmentEntry,
} from './Candidate-interfaces';
import {
  DEFAULT_EXP_FORM,
  DEFAULT_SKILL_FORM,
  DEFAULT_QUAL_FORM,
  DEFAULT_ATTACH_FORM,
} from './Candidate-form -defaults';

export abstract class CandidateListOps extends CandidateDropdown {
  // ─── Abstract service (provided by Candidate component) ───────────────────
  protected abstract get _toastr(): ToastrService;

  // ─── Lists ─────────────────────────────────────────────────────────────────
  experienceList: ExperienceEntry[] = [];
  skillList: SkillEntry[] = [];
  qualificationList: QualificationEntry[] = [];
  attachmentList: AttachmentEntry[] = [];

  // ─── Form Models ───────────────────────────────────────────────────────────
  expForm = { ...DEFAULT_EXP_FORM };
  skillForm = { ...DEFAULT_SKILL_FORM };
  qualForm = { ...DEFAULT_QUAL_FORM };
  attachForm = { ...DEFAULT_ATTACH_FORM };

  // ═══════════════════════════════════════════════════════════════════════════
  // EXPERIENCE
  // ═══════════════════════════════════════════════════════════════════════════
  addExperience() {
    if (!this.expForm.companyName || !this.expForm.position || !this.expForm.fromDate) {
      this._toastr.warning('Please fill required fields');
      return;
    }
    this.experienceList.push({ ...this.expForm });
    this.expForm = { ...DEFAULT_EXP_FORM };
    this._toastr.success('Experience added!');
  }

  removeExperience(index: number) {
    this.experienceList.splice(index, 1);
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // SKILL
  // ═══════════════════════════════════════════════════════════════════════════
  addSkill() {
    if (!this.skillForm.skillName || !this.skillForm.skillRating) {
      this._toastr.warning('Please fill required fields');
      return;
    }
    this.skillList.push({ ...this.skillForm });
    this.skillForm = { ...DEFAULT_SKILL_FORM };
    this._toastr.success('Skill added!');
  }

  removeSkill(index: number) {
    this.skillList.splice(index, 1);
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // QUALIFICATION
  // ═══════════════════════════════════════════════════════════════════════════
  addQualification() {
    if (!this.qualForm.qualificationName || !this.qualForm.institute) {
      this._toastr.warning('Please fill required fields');
      return;
    }
    this.qualificationList.push({ ...this.qualForm });
    this.qualForm = { ...DEFAULT_QUAL_FORM };
    this._toastr.success('Qualification added!');
  }

  removeQualification(index: number) {
    this.qualificationList.splice(index, 1);
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // ATTACHMENT
  // ═══════════════════════════════════════════════════════════════════════════
  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.attachForm.file = input.files[0];
    }
  }

  addAttachment() {
    if (!this.attachForm.file) {
      this._toastr.warning('Please select a file');
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
    this.attachForm = { ...DEFAULT_ATTACH_FORM };
    const fileInput = document.getElementById('attachFile') as HTMLInputElement;
    if (fileInput) fileInput.value = '';
    this._toastr.success('Attachment added!');
  }

  removeAttachment(index: number) {
    this.attachmentList.splice(index, 1);
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // FILE HELPERS
  // ═══════════════════════════════════════════════════════════════════════════
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

  getFileType(fileName: string): string {
    const ext = fileName.split('.').pop()?.toLowerCase();
    if (!ext) return 'file';
    if (ext === 'pdf') return 'pdf';
    if (['png', 'jpg', 'jpeg', 'gif', 'webp', 'svg'].includes(ext)) return 'img';
    if (['doc', 'docx'].includes(ext)) return 'doc';
    if (['xls', 'xlsx', 'csv'].includes(ext)) return 'xls';
    return 'file';
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // RESET SUB-FORMS
  // ═══════════════════════════════════════════════════════════════════════════
  resetAllListsAndForms() {
    this.experienceList = [];
    this.expForm = { ...DEFAULT_EXP_FORM };
    this.skillList = [];
    this.skillForm = { ...DEFAULT_SKILL_FORM };
    this.qualificationList = [];
    this.qualForm = { ...DEFAULT_QUAL_FORM };
    this.attachmentList = [];
    this.attachForm = { ...DEFAULT_ATTACH_FORM };

    const fileInput = document.getElementById('attachFile') as HTMLInputElement;
    if (fileInput) fileInput.value = '';
  }
}
