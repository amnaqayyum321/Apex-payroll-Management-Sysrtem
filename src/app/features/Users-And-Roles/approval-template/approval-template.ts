import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FormsService } from '../../forms/Services/forms';
import { UsersAndRolesService } from '../Services/user-roles';
import { Toast, ToastrService } from 'ngx-toastr';
import { LoaderService } from '../../../core/services/management-services/loader.service';
import { ActivatedRoute, Router } from '@angular/router';

interface Approver {
  id: string;
  userPublicId: string;
  roleCode: string;
  sequence: number;
}

interface Stage {
  id: string;
  stageCode: string;
  stageName: string;
  stageOrder: number;
  minApprovals: number;
  approvers: Approver[];
  collapsed: boolean;
}

interface TemplateForm {
  code: string;
  name: string;
  entityName: string;
  description: string;
  conditionJson: string;
  remarks: string;
}

@Component({
  selector: 'app-approval-template',
  imports: [CommonModule, FormsModule],
  templateUrl: './approval-template.html',
  styleUrl: './approval-template.scss',
})
export class ApprovalTemplate {
  activeTab: 'form' | 'preview' = 'form';
  submitted = false;
  jsonCopied = false;
  currentpage: number = 0;
  Pagesize: number = 100;
  publicId: string | null = null;
  isEditMode = false;
  constructor(
    private UserSv: UsersAndRolesService,
    private toastr: ToastrService,
    private loader: LoaderService,
    private route: ActivatedRoute,
    private router: Router,
  ) {}
  ngOnInit() {
    this.publicId = this.route.snapshot.paramMap.get('id');
    if (this.publicId) {
      this.isEditMode = true;
      this.loadApprovalTemplate(this.publicId);
    }
    this.GetUsers();
  }
  form: TemplateForm = {
    code: '',
    name: '',
    entityName: '',
    description: '',
    conditionJson: '',
    remarks: '',
  };
  userList: any;
  stages: Stage[] = [];

  GetUsers() {
    this.UserSv.getAllUser(this.currentpage, this.Pagesize).subscribe(
      (res: any) => {
        if (res.success) {
          this.userList = res.data;
          console.log('All User Get Successfully', res);
        }
      },
      (err: any) => {
        console.log(err);
      },
    );
  }
  loadApprovalTemplate(publicId: string) {
    this.loader.show();
    this.UserSv.GetApprovalTempByPublicId(publicId).subscribe(
      (res: any) => {
        if (res.success) {
          this.loader.hide();
          const result = res.data;
          this.form.code = result.code;
          this.form.name = result.name;
          this.form.entityName = result.entityName;
          this.form.description = result.description;
          this.form.conditionJson = result.conditionJson;
          this.form.remarks = result.remarks;
          this.stages = (result.stages || []).map((s: any) => ({
            id: this.genId(),
            stageCode: s.stageCode,
            stageName: s.stageName,
            stageOrder: s.stageOrder,
            minApprovals: s.minApprovals,
            collapsed: false,
            approvers: (s.approvers || []).map((ap: any) => ({
              id: this.genId(),
              userPublicId: ap.userPublicId,
              roleCode: ap.roleCode,
              sequence: ap.sequence,
            })),
          }));
        }
        this.loader.hide();
      },
      (err: any) => {
        console.log(err);
        this.loader.hide();
      },
    );
  }
  addStage(): void {
    const stage: Stage = {
      id: this.genId(),
      stageCode: '',
      stageName: '',
      stageOrder: this.stages.length + 1,
      minApprovals: 1,
      approvers: [],
      collapsed: false,
    };
    this.stages.push(stage);
  }

  removeStage(id: string): void {
    this.stages = this.stages.filter((s) => s.id !== id);
    this.reorderStages();
  }

  toggleCollapse(stage: Stage): void {
    stage.collapsed = !stage.collapsed;
  }

  moveStage(id: string, dir: -1 | 1): void {
    const idx = this.stages.findIndex((s) => s.id === id);
    const next = idx + dir;
    if (next < 0 || next >= this.stages.length) return;
    [this.stages[idx], this.stages[next]] = [this.stages[next], this.stages[idx]];
    this.reorderStages();
  }

  private reorderStages(): void {
    this.stages.forEach((s, i) => (s.stageOrder = i + 1));
  }

  // ── Approver Operations ────────────────────────────────────────────

  addApprover(stage: Stage): void {
    stage.approvers.push({
      id: this.genId(),
      userPublicId: '',
      roleCode: '',
      sequence: stage.approvers.length + 1,
    });
  }

  removeApprover(stage: Stage, apId: string): void {
    stage.approvers = stage.approvers.filter((a) => a.id !== apId);
  }

  buildPayload() {
    return {
      code: this.form.code,
      name: this.form.name,
      entityName: this.form.entityName,
      description: this.form.description,
      conditionJson: this.form.conditionJson,
      remarks: this.form.remarks,
      stages: this.stages.map((s) => ({
        stageCode: s.stageCode,
        stageName: s.stageName,
        stageOrder: s.stageOrder,
        minApprovals: s.minApprovals,
        approvers: s.approvers.map((ap) => ({
          userPublicId: ap.userPublicId,
          roleCode: ap.roleCode,
          sequence: ap.sequence,
        })),
      })),
    };
  }

  get jsonPayload(): string {
    return JSON.stringify(this.buildPayload(), null, 2);
  }

  handleSubmit(): void {
    if (!this.form.code || !this.form.name || !this.form.entityName) {
      this.toastr.warning('Please fill all required fields');
      return;
    }

    if (this.stages.length === 0) {
      this.toastr.warning('Please add at least one stage');
      return;
    }

    for (const stage of this.stages) {
      if (!stage.stageCode || !stage.stageName) {
        this.toastr.warning(`Stage ${stage.stageOrder}: Code and Name required`);
        return;
      }
      if (stage.approvers.length === 0) {
        this.toastr.warning(`Stage ${stage.stageOrder}: Add at least one approver`);
        return;
      }
      for (const ap of stage.approvers) {
        if (!ap.userPublicId) {
          this.toastr.warning(`Stage ${stage.stageOrder}: Select user for all approvers`);
          return;
        }
      }
    }
    const payload = this.buildPayload();
    console.log('Payload', payload);
    this.loader.show();
    if (this.isEditMode) {
      this.UserSv.UpdateApprovalTempByPublicId(this.publicId!, payload).subscribe((res: any) => {
        if (res.success) {
          this.loader.hide();
          this.toastr.success('Template updated successfully');
          setTimeout(() => {
            this.router.navigate(['/panel/users-and-roles/view-template-approval']);
          }, 1500);
        }
      });
    } else {
      this.UserSv.CreateApprovalTemplate(payload).subscribe(
        (res: any) => {
          if (res.success) {
            this.loader.hide();
            this.toastr.success('Approval Template Craeted Successfully');
            this.resetForm();
          }
        },
        (err: any) => {
          this.loader.hide();
          this.toastr.error('Error creating approval template');
          console.log(err);
        },
      );
    }
  }

  copyJson(): void {
    navigator.clipboard?.writeText(this.jsonPayload).then(() => {
      this.jsonCopied = true;
      setTimeout(() => (this.jsonCopied = false), 2000);
    });
  }
  onUserSelect(ap: Approver): void {
    const selectedUser = this.userList?.find((users: any) => users.publicId === ap.userPublicId);
    if (selectedUser) {
      ap.roleCode = selectedUser.roleCode ?? '';
    }
  }
  resetForm(): void {
    this.form = {
      code: '',
      name: '',
      entityName: '',
      description: '',
      conditionJson: '',
      remarks: '',
    };
    this.stages = [];
    this.submitted = false;
    this.activeTab = 'form';
  }

  private genId(): string {
    return Math.random().toString(36).substr(2, 9);
  }

  trackById(_: number, item: { id: string }): string {
    return item.id;
  }
}
