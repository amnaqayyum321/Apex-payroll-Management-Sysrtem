import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsService } from '../../Services/forms';
import { ToastrService } from 'ngx-toastr';
import { LoaderService } from '../../../../core/services/management-services/loader.service';
import { FormsModule } from '@angular/forms';
import { MasterTable } from '../../master-data/master-table/master-table';

@Component({
  selector: 'app-view-employees-grade-list',
  imports: [CommonModule, RouterModule, MasterTable, FormsModule],
  templateUrl: './view-employees-grade-list.html',
  styleUrl: './view-employees-grade-list.scss',
})
export class ViewEmployeesGradeList {
    constructor(public formService: FormsService) {}

}
