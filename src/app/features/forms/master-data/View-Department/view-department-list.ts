import { Component } from '@angular/core';
import { UsersAndRolesService } from '../../../Users-And-Roles/Services/user-roles';
import { ToastrService } from 'ngx-toastr';
import { LoaderService } from '../../../../core/services/management-services/loader.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { FormsService } from '../../Services/forms';
import { MasterTable } from '../master-table/master-table';

@Component({
  selector: 'app-view-department-list',
  imports: [CommonModule, FormsModule, RouterModule,MasterTable],
  templateUrl: './view-department-list.html',
  styleUrl: './view-department-list.scss',
   standalone: true, // make sure this is standalone
})
export class ViewDepartmentList {
   constructor(public formService: FormsService) {}
 
}
