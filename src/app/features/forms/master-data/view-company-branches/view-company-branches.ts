import { Component } from '@angular/core';
import { FormsService } from '../../Services/forms';
import { ToastrService } from 'ngx-toastr';
import { LoaderService } from '../../../../core/services/management-services/loader.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { MasterTable } from '../master-table/master-table';

@Component({
  selector: 'app-view-company-branches',
  imports: [CommonModule, FormsModule, RouterModule, MasterTable],


  templateUrl: './view-company-branches.html',
  styleUrl: './view-company-branches.scss',
})
export class ViewCompanyBranches {

    constructor(public formService: FormsService) {}
}
