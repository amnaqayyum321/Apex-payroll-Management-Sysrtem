import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UsersAndRolesService } from '../Services/user-roles';
import { ToastrService } from 'ngx-toastr';
import { LoaderService } from '../../../core/services/management-services/loader.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsService } from '../../forms/Services/forms';

interface TemplateForm {
  code: string;
  name: string;
  entityName: string;
  description: string;
  conditionJson: string;
  remarks: string;
  originatorUserPublicIds: string[];
  stageDefinitionPublicIds: string[];
  
}

@Component({
  selector: 'app-approval-template',
  imports: [CommonModule, FormsModule],
  templateUrl: './approval-template.html',
  styleUrl: './approval-template.scss',
})
export class ApprovalTemplate {
  activeTab: 'form' | 'preview' = 'form';
  /** Inner tab inside the form for Originators vs Stages */
  innerTab: 'originators' | 'stages' = 'originators';

  submitted = false;
  jsonCopied = false;
  currentpage: number = 0;
  Pagesize: number = 100;
  publicId: string | null = null;
  isEditMode = false;
  // Dropdown state variables
isEntityDropdownOpen = false;
selectedEntityLabel = '';
// Originator dropdown variables
isOriginatorDropdownOpen = false;
selectedOriginatorLabel = '';

// Stage dropdown variables
isStageDropdownOpen = false;
selectedStageLabel = '';

  entityNameOptions: string[] = ['LEAVE_APPLICATION'];

  constructor(
    private UserSv: UsersAndRolesService,
    private toastr: ToastrService,
    private loader: LoaderService,
    private route: ActivatedRoute,
    private router: Router,
    private FormSv: FormsService,
  ) {}

ngOnInit() {
  this.publicId = this.route.snapshot.paramMap.get('id');

  this.GetEmployee();

  this.GetStageDefinitions(() => {
    if (this.publicId) {
      this.isEditMode = true;
      this.loadApprovalTemplate(this.publicId);
    }
  });
}

  form: TemplateForm = {
    code: '',
    name: '',
    entityName: '',
    description: '',
    conditionJson: '',
    remarks: '',
    originatorUserPublicIds: [],
    stageDefinitionPublicIds: [],
  };
  templateStages: any[] = [];
  EmployeeList: any[] = [];
  stageDefinitionList: any[] = []; // fetched from API

  // ── Users ─────────────────────────────────────────────────────────

  GetEmployee() {
    this.FormSv.GetEmployees(this.currentpage, this.Pagesize).subscribe(
      (res: any) => {
        if (res.success) {
          this.EmployeeList = res.data;
          console.log('Employee List', res);
        }
      },
      (err: any) => console.log(err),
    );
  }

  // GetStageDefinitions() {
  //   this.UserSv.getApprovaLStages(this.currentpage, this.Pagesize).subscribe(
  //     (res: any) => {
  //       if (res.success) {
  //         this.stageDefinitionList = res.data;
  //         console.log('All Stages Get Successfully', res);
  //       }
  //     },
  //     (err: any) => console.log(err),
  //   );
  // }
  GetStageDefinitions(callback?: () => void) {
  this.UserSv.getApprovaLStages(this.currentpage, this.Pagesize).subscribe(
    (res: any) => {
      if (res.success) {
        this.stageDefinitionList = res.data;
        callback?.(); // stage list load hone ke baad edit data load
      }
    },
    (err: any) => console.log(err),
  );
}
  getStageDefinitionById(publicId: string): any {
    return this.stageDefinitionList.find((d: any) => d.publicId === publicId) ?? null;
  }
  loadApprovalTemplate(publicId: string) {
    this.loader.show();
    this.UserSv.GetApprovalTempByPublicId(publicId).subscribe(
      (res: any) => {
        if (res.success) {
          const result = res.data;
          console.log('All result', result);
          this.form.code = result.code;
          this.form.name = result.name;
          this.form.entityName = result.entityName;
          this.form.description = result.description;
          this.form.conditionJson = result.conditionJson ?? '';
          this.form.remarks = result.remarks ?? '';
          // loadApprovalTemplate method mein
this.selectedEntityLabel = result.entityName;
          this.form.originatorUserPublicIds = (result.originators || []).map(
            (o: any) => o.userPublicId,
          );
          this.form.stageDefinitionPublicIds = (result.stages || [])
            .sort((a: any, b: any) => a.stageOrder - b.stageOrder)
            .map((s: any) => {
              const match = this.stageDefinitionList.find((d: any) => d.code === s.stageCode);
              return match?.publicId ?? null;
            })
            .filter((id: string | null) => id !== null);
        }
        this.loader.hide();
      },
      (err: any) => {
        console.log(err);
        this.loader.hide();
      },
    );
  }
  onOriginatorSelect(event: Event): void {
    const select = event.target as HTMLSelectElement;
    const userPublicId = select.value;
    if (userPublicId && !this.form.originatorUserPublicIds.includes(userPublicId)) {
      this.form.originatorUserPublicIds.push(userPublicId);
    }
    select.value = '';
  }

  removeOriginator(index: number): void {
    this.form.originatorUserPublicIds.splice(index, 1);
  }

  // ── Stage Definition Operations ───────────────────────────────────

  onStageDefinitionSelect(event: Event): void {
    const select = event.target as HTMLSelectElement;
    const publicId = select.value;
    if (publicId && !this.form.stageDefinitionPublicIds.includes(publicId)) {
      this.form.stageDefinitionPublicIds.push(publicId);
    }
    select.value = '';
  }

  removeStageDefinition(index: number): void {
    this.form.stageDefinitionPublicIds.splice(index, 1);
  }

  moveStageDefinition(index: number, dir: -1 | 1): void {
    const next = index + dir;
    if (next < 0 || next >= this.form.stageDefinitionPublicIds.length) return;
    const ids = this.form.stageDefinitionPublicIds;
    [ids[index], ids[next]] = [ids[next], ids[index]];
  }

  // ── Payload ───────────────────────────────────────────────────────

  buildPayload() {
    return {
      code: this.form.code,
      name: this.form.name,
      entityName: this.form.entityName,
      description: this.form.description,
      conditionJson: this.form.conditionJson || null,
      remarks: this.form.remarks,
      stageDefinitionPublicIds: this.form.stageDefinitionPublicIds,
      originatorUserPublicIds: this.form.originatorUserPublicIds.filter((id) => id.trim() !== ''),
    };
  }

  get jsonPayload(): string {
    return JSON.stringify(this.buildPayload(), null, 2);
  }

  // ── Validation & Submit ───────────────────────────────────────────

  handleSubmit(): void {
    if (!this.form.code || !this.form.name || !this.form.entityName) {
      this.toastr.warning('Please fill all required fields (Code, Name, Entity Name)');
      return;
    }

    if (this.form.stageDefinitionPublicIds.length === 0) {
      this.toastr.warning('Please add at least one approval stage');
      return;
    }

    const payload = this.buildPayload();
    this.loader.show();

    if (this.isEditMode) {
      this.UserSv.UpdateApprovalTempByPublicId(this.publicId!, payload).subscribe(
        (res: any) => {
          this.loader.hide();
          if (res.success) {
            this.toastr.success('Template updated successfully');
            setTimeout(() => {
              this.router.navigate(['/panel/users-and-roles/view-template-approval']);
            }, 1500);
          }
        },
        (err: any) => {
          this.loader.hide();
          this.toastr.error('Error updating approval template');
          console.log(err);
        },
      );
    } else {
      this.UserSv.CreateApprovalTemplate(payload).subscribe(
        (res: any) => {
          this.loader.hide();
          if (res.success) {
            this.toastr.success('Approval Template Created Successfully');
            this.resetForm();
            setTimeout(() => {
              this.router.navigate(['/panel/users-and-roles/view-template-approval']);
            }, 1500);
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
resetForm(): void {
  this.form = {
    code: '',
    name: '',
    entityName: '',
    description: '',
    conditionJson: '',
    remarks: '',
    originatorUserPublicIds: [],
    stageDefinitionPublicIds: [],
  };
  this.selectedEntityLabel = '';
  this.selectedOriginatorLabel = '';
  this.selectedStageLabel = '';
  this.submitted = false;
  this.activeTab = 'form';
  this.innerTab = 'originators';
}
  cancel() {
    this.router.navigate(['/panel/users-and-roles/view-template-approval']);
  }
  trackByIndex(index: number): number {
    return index;
  }


  toggleEntityDropdown(event: Event) {
  event.stopPropagation();
  this.isEntityDropdownOpen = !this.isEntityDropdownOpen;
}

selectEntity(entity: string, event: Event) {
  event.stopPropagation();
  this.form.entityName = entity;
  this.selectedEntityLabel = entity;
  this.isEntityDropdownOpen = false;
}
@HostListener('document:click', ['$event'])
closeAllDropdowns(event?: Event) {
  this.isEntityDropdownOpen = false;
  this.isOriginatorDropdownOpen = false;
  this.isStageDropdownOpen = false;
}

toggleOriginatorDropdown(event: Event) {
  event.stopPropagation();
  this.isOriginatorDropdownOpen = !this.isOriginatorDropdownOpen;
}

selectOriginator(employee: any, event: Event) {
  event.stopPropagation();
  const userPublicId = employee.userPublicId;
  if (userPublicId && !this.form.originatorUserPublicIds.includes(userPublicId)) {
    this.form.originatorUserPublicIds.push(userPublicId);
    this.selectedOriginatorLabel = ''; // Reset after selection
  }
  this.isOriginatorDropdownOpen = false;
}

toggleStageDropdown(event: Event) {
  event.stopPropagation();
  this.isStageDropdownOpen = !this.isStageDropdownOpen;
}

selectStage(stage: any, event: Event) {
  event.stopPropagation();
  const publicId = stage.publicId;
  if (publicId && !this.form.stageDefinitionPublicIds.includes(publicId)) {
    this.form.stageDefinitionPublicIds.push(publicId);
    this.selectedStageLabel = ''; // Reset after selection
  }
  this.isStageDropdownOpen = false;
}
}
