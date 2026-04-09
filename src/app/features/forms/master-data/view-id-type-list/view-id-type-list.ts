import { Component } from '@angular/core';
import { FormsService } from '../../Services/forms';
import { ToastrService } from 'ngx-toastr';
import { LoaderService } from '../../../../core/services/management-services/loader.service';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MasterTable } from '../master-table/master-table';

@Component({
  selector: 'app-view-id-type-list',
  imports: [RouterModule, FormsModule, CommonModule,MasterTable],
  templateUrl: './view-id-type-list.html',
  styleUrl: './view-id-type-list.scss',
  standalone :true,
})
export class ViewIDTypeList {
  
     constructor(public formService: FormsService) {}

}
