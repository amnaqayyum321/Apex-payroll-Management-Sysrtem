import { Component } from '@angular/core';
import { FormsService } from '../../Services/forms';
import { ToastrService } from 'ngx-toastr';
import { LoaderService } from '../../../../core/services/management-services/loader.service';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MasterTable } from '../master-table/master-table';

@Component({
  selector: 'app-view-job-title-list',
  imports: [RouterModule, CommonModule, FormsModule, MasterTable],
  templateUrl: './view-job-title-list.html',
  styleUrl: './view-job-title-list.scss',
  standalone: true,
})
export class ViewJobTitleList {
     constructor(public formService: FormsService) {}

}
