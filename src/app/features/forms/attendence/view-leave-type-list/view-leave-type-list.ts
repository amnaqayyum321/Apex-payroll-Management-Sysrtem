import { Component } from '@angular/core';
import { FormsService } from '../../Services/forms';
import { ToastrService } from 'ngx-toastr';
import { LoaderService } from '../../../../core/services/management-services/loader.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MasterTable } from '../../master-data/master-table/master-table';

@Component({
  selector: 'app-view-leave-type-list',
  imports: [CommonModule, FormsModule, RouterModule, MasterTable],
  templateUrl: './view-leave-type-list.html',
  styleUrl: './view-leave-type-list.scss',
})
export class ViewLeaveTypeList {
     constructor(public formService: FormsService) {}

}
