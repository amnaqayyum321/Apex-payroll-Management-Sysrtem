import { Component } from '@angular/core';
import { FormsService } from '../../Services/forms';
import { LoaderService } from '../../../../core/services/management-services/loader.service';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { MasterTable } from '../master-table/master-table';

@Component({
  selector: 'app-view-work-schedule',
  imports: [CommonModule, FormsModule, RouterModule, MasterTable],
  templateUrl: './view-work-schedule.html',
  styleUrl: './view-work-schedule.scss',
})
export class ViewWorkSchedule {
   constructor(public formService: FormsService) {}

}
