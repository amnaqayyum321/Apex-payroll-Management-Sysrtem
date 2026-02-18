import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LoaderService } from '../../../../core/services/management-services/loader.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
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
  constructor(
    private loader: LoaderService,
    private toastr: ToastrService,
    private router: Router,
    private userSv: UsersAndRolesService,
  ) {}
  ngOnInit() {
    this.GetRolePermission();
  }
  GetRolePermission() {
    this.userSv.GetpermissionRole().subscribe(
      (res: any) => {
        if (res.success) {
          this.PermissionList = Object.keys(res.data).map((moduleName) => ({
            moduleName,
            permissions: res.data[moduleName],
          }));
          console.log('Permission Role Get Successfully', res);
        }
      },
      (err: any) => {
        console.log(err);
      },
    );
  }
  onPermissionChange(permission: string, event: any) {
    if (event.target.checked) {
      this.selectedPermissions.push(permission);
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
        this.selectedPermissions = rolePermission.permissionCodes;
        console.log('Get Role Permission Get successfully', res);
      } else {
        this.toastr.error('Role not found');
      }
    });
  }
  updateRolePermission() {
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
    this.loader.show();
    this.userSv.UpdateRoleByPublicId(this.publicId, UpdatePayloadRolePermission).subscribe(
      (res: any) => {
        this.loader.hide();
        if (res.success) {
          this.toastr.success('Role updated successfully');
          this.ResetRoleUpdatePermissionForm();
          this.router.navigate(['/panel/users-and-roles/view-roles']);
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
}
