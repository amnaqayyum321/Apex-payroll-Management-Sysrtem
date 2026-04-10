import { Component } from '@angular/core';
import { FormsService } from '../../Services/forms';
import { ToastrService } from 'ngx-toastr';
import { LoaderService } from '../../../../core/services/management-services/loader.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MasterTable } from '../master-table/master-table';

@Component({
  selector: 'app-view-project-list',
  imports: [CommonModule, FormsModule, RouterModule, MasterTable],
  templateUrl: './view-project-list.html',
  styleUrl: './view-project-list.scss',
})
export class ViewProjectList {
      constructor(public formService: FormsService) {  }
}
