import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LoaderService } from '../../../../core/services/management-services/loader.service';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { UsersAndRolesService } from '../../Services/user-roles';

@Component({
  selector: 'app-view-permissions',
  imports: [CommonModule, FormsModule],
  templateUrl: './view-permissions.html',
  styleUrl: './view-permissions.scss',
})
export class ViewPermissions {
  PermissionList: any[] = [];
  PermissionRoleList: any[] = [];
  selectedPermissions: string[] = [];
  roleCode: string = '';
  roleName: string = '';
  description: string = '';
  publicId: string = '';
  selectedPermissionsMap: { [key: string]: boolean } = {};
  constructor(
    private loader: LoaderService,
    private toastr: ToastrService,
    private route: ActivatedRoute,
    private userSv: UsersAndRolesService,
    private router: Router,
  ) {}
  ngOnInit() {
    this.GetRolePermission(this.publicId);
    this.route.queryParamMap.subscribe((params) => {
      const publicId = params.get('publicId');
      if (publicId) {
        this.LoadRole(publicId);
      }
    });
  }

  GetRolePermission(publicId: string) {
    this.userSv.GetpermissionRole().subscribe(
      (res: any) => {
        if (res.success) {
          this.PermissionList = Object.keys(res.data).map((moduleName) => ({
            moduleName,
            permissions: res.data[moduleName],
          }));
          if (publicId) {
            this.LoadRole(publicId);
          }
        }
      },
      (err: any) => console.log(err),
    );
  }
  onPermissionChange(permission: string, event: any) {
    const checked = event.target.checked;
    this.selectedPermissionsMap[permission] = checked;

    if (checked) {
      if (!this.selectedPermissions.includes(permission)) {
        this.selectedPermissions.push(permission);
      }
    } else {
      this.selectedPermissions = this.selectedPermissions.filter((p) => p !== permission);
    }
  }

  LoadRole(publicId: string) {
    this.publicId = publicId;
    this.userSv.GetRoleByPublicId(publicId).subscribe((res: any) => {
      if (res.success) {
        const rolePermission = res.data;
        this.roleCode = rolePermission.code;
        this.roleName = rolePermission.name;
        this.description = rolePermission.description;
        this.selectedPermissionsMap = {};
        rolePermission.permissionCodes.forEach((code: string) => {
          this.selectedPermissionsMap[code] = true;
        });
        this.selectedPermissions = [...rolePermission.permissionCodes];
      } else {
        this.toastr.error('Role not found');
      }
    });
  }
  updateRolePermission() {
    debugger;
    if (!this.roleCode || !this.roleName) {
      this.toastr.error('Role Code and Role Name are required');
    }
    if (this.selectedPermissions.length === 0) {
      this.toastr.error('Please select at least one permission');
    }
    const UpdatePayloadRolePermission = {
      code: this.roleCode,
      name: this.roleName,
      description: this.description,
      permissionCodes: this.selectedPermissions,
    };
    console.log('final paylaod', UpdatePayloadRolePermission);
    this.loader.show();
    this.userSv.UpdateRoleByPublicId(this.publicId, UpdatePayloadRolePermission).subscribe(
      (res: any) => {
        this.loader.hide();
        if (res.success) {
          this.toastr.success('Role updated successfully');
          this.ResetRoleUpdatePermissionForm();
          setTimeout(() => {
            this.router.navigate(['/panel/users-and-roles/view-roles']);
          }, 1500);
        } else {
          this.toastr.error(res.message || 'Something went wrong');
        }
      },
      (err: any) => {
        console.log(err);
      },
    );
  }
  ResetRoleUpdatePermissionForm() {
    this.roleCode = '';
    this.roleName = '';
    this.description = '';
    this.selectedPermissions = [];
  }
  cancel() {
    this.router.navigate(['/panel/users-and-roles/view-roles']);
  }
}
