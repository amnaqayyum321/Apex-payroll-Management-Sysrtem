import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { LoaderService } from '../../../../core/services/management-services/loader.service';
import { UsersAndRolesService } from '../../Services/user-roles';

@Component({
  selector: 'app-create-role',
  imports: [CommonModule, FormsModule],
  standalone: true,
  templateUrl: './create-role.html',
  styleUrl: './create-role.scss',
})
export class CreateRole {
  PermissionList: any[] = [];
  selectedPermissions: string[] = [];
  roleCode: string = '';
  roleName: string = '';
  description: string = '';
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
  SubmitRolePermission() {
    if (!this.roleCode || !this.roleName) {
      this.toastr.error('Role Code and Role Name are required');
    }
    if (this.selectedPermissions.length === 0) {
      this.toastr.error('Please select at least one permission');
    }
    const payload = {
      code: this.roleCode,
      name: this.roleName,
      description: this.description,
      permissionCodes: this.selectedPermissions,
    };
    console.log('Final Payload:', payload);
    this.CreateRole(payload);
  }

  CreateRole(payload: any) {
    this.loader.show();
    this.userSv.CreateRolePermission(payload).subscribe(
      (res: any) => {
        this.loader.hide();
        if (res.success) {
          this.toastr.success('Role created successfully');
          this.ResetRolePermissionForm();
          this.router.navigate(['/panel/users-and-roles/view-roles']);
        } else {
          this.toastr.error(res.message || 'Something went wrong');
        }
      },
      (err: any) => {
        this.toastr.error('Server error');
        console.error(err);
      },
    );
  }
  ResetRolePermissionForm() {
    this.roleCode = '';
    this.roleName = '';
    this.description = '';
    this.selectedPermissions = [];
  }
}
