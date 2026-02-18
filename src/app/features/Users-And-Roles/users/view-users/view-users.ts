 import { Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { LoaderService } from '../../../../core/services/management-services/loader.service';
import { CommonModule } from '@angular/common';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { RouterModule } from '@angular/router';
import { UsersAndRolesService } from '../../Services/user-roles';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-view-users',
  imports: [CommonModule, FormsModule, RouterModule, NgbDropdownModule],
  standalone: true,
  templateUrl: './view-users.html',
  styleUrl: './view-users.scss',
})
export class ViewUsers {
 


  usersList: any[] = [];
  totalItems: number = 0;
  totalPagesCount: number = 0;

  constructor(private getAllUser: UsersAndRolesService, private toastr: ToastrService, private loader: LoaderService) {

  }

  currentPage = 1;
  itemsPerPage = 7;
  paginatedUsersList: any[] = [];

  get totalPages() {
    return this.totalPagesCount || Math.ceil(this.totalItems / this.itemsPerPage);
  }

  get totalPagesArray() {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    
    this.loader.show();
    this.getAllUser.getAllUser().subscribe({
      next: (response: any) => {
        this.loader.hide();
        this.usersList = response.data;
        console.log(this.usersList);
        this.totalItems = response.paginator.totalItems;
        this.totalPagesCount = response.paginator.totalPages;
        this.currentPage = response.paginator.currentPage + 1; // Backend 0-indexed
        this.paginatedUsersList = this.usersList;
      }
      ,
      error: (error) => {
        this.loader.hide();
        this.toastr.error('Error fetching users list');
      }
    });
  }



  changePage(page: number) {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    this.loadUsers();
  }

  formatRoleName(role: string): string {
  if (!role) return "";

  return role
    .toLowerCase()                       
    .replace(/_/g, " ")                  
    .replace(/\b\w/g, (c) => c.toUpperCase()); 
}
}


