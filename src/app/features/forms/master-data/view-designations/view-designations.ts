import { Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { FormsService } from '../../Services/forms';
import { LoaderService } from '../../../../core/services/management-services/loader.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MasterTable } from '../master-table/master-table';

@Component({
  selector: 'app-view-designations',
  imports: [CommonModule, FormsModule, RouterModule,MasterTable],
  templateUrl: './view-designations.html',
  styleUrl: './view-designations.scss',
})
export class ViewDesignations {


     constructor(public formService: FormsService) {}

}
