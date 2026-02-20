import { Component, HostListener } from '@angular/core';
import { LoaderService } from '../../../../core/services/management-services/loader.service';
import { UsersAndRolesService } from '../../../Users-And-Roles/Services/user-roles';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-department',
  imports: [CommonModule, FormsModule],
  templateUrl: './department.html',
  styleUrl: './department.scss',
})
export class Department {
  email: string = '';
  firstName: string = '';
  lastName: string = '';
  roleCode: string = '';
  phoneNumber: string = '';
  address: string = '';
  roles: any[] = [];
  disabled: boolean = false;
  isDropdownOpen: boolean = false;
  selectedRole: string = '';
  currentPage: number = 0; // page number
  pageSize: number = 100;
  constructor(
    private loader: LoaderService,
    private userSv: UsersAndRolesService,
    private toastr: ToastrService,
    private router: Router,
  ) {}
  ngOnInit() {
    this.loader.show();
    this.GetAllRole();
  }

  toggleDropdown(event: Event) {
    event.stopPropagation();
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  selectRole(role: any, event: Event) {
    event.stopPropagation();
    this.selectedRole = role.name;
    this.roleCode = role.code;
    this.isDropdownOpen = false;
  }

  @HostListener('document:click', ['$event'])
  closeDropdown(event: Event) {
    this.isDropdownOpen = false;
  }
  GetAllRole() {
    this.userSv.getRoles(this.currentPage, this.pageSize).subscribe({
      next: (response: any) => {
        this.loader.hide();
        this.roles = response.data;
        console.log('All role', this.roles);
      },
      error: (error: any) => {
        this.loader.hide();
      },
    });
  }
  createUser() {
    if (!this.email || !this.firstName || !this.lastName || !this.roleCode) {
      this.toastr.error('Please fill in all required fields');
      return;
    }
    let payload = {
      email: this.email,
      firstName: this.firstName,
      lastName: this.lastName,
      roleCode: this.roleCode,
      phoneNumber: this.phoneNumber,
      address: this.address,
    };
    this.loader.show();
    this.disabled = true;
    this.userSv.CreatenewUser(payload).subscribe({
      next: (response: any) => {
        this.loader.hide();
        this.toastr.success('User created successfully', 'Success');
        this.resetUserForm();
        setTimeout(() => {
          this.router.navigate(['/panel/users-and-roles/view-users']);
        }, 1500);
      },
      error: (error: any) => {
        this.loader.hide();
        this.disabled = false;
        this.toastr.error(
          error.error.message || 'Failed to create user. Please try again.',
          'Error',
        );
      },
    });
  }
  resetUserForm() {
    this.email = '';
    this.firstName = '';
    this.lastName = '';
    this.roleCode = '';
    this.phoneNumber = '';
    this.address = '';
    this.selectedRole = '';
    this.disabled = false;
  }
  cancel() {
    this.router.navigate(['/panel/forms/view-department-list']);
  }
}
