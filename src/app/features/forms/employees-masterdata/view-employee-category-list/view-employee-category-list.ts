import { Component } from '@angular/core';
import { FormsService } from '../../Services/forms';
import { ToastrService } from 'ngx-toastr';
import { LoaderService } from '../../../../core/services/management-services/loader.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MasterTable } from '../../master-data/master-table/master-table';

@Component({
  selector: 'app-view-employee-category-list',
  imports: [FormsModule, CommonModule, MasterTable],
  templateUrl: './view-employee-category-list.html',
  styleUrl: './view-employee-category-list.scss',
})
export class ViewEmployeeCategoryList {
     constructor(public formService: FormsService) {}

}
