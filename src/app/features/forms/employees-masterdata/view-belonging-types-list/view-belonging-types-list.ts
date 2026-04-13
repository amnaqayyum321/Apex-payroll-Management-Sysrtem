import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsService } from '../../Services/forms';
import { ToastrService } from 'ngx-toastr';
import { LoaderService } from '../../../../core/services/management-services/loader.service';
import { MasterTable } from '../../master-data/master-table/master-table';

@Component({
  selector: 'app-view-belonging-types-list',
  imports: [CommonModule, FormsModule, RouterModule, MasterTable],
  templateUrl: './view-belonging-types-list.html',
  styleUrl: './view-belonging-types-list.scss',
})
export class ViewBelongingTypesList {
     constructor(public formService: FormsService) {}

}
