import { Component } from '@angular/core';
import { FormsService } from '../../Services/forms';
import { ToastrService } from 'ngx-toastr';
import { LoaderService } from '../../../../core/services/management-services/loader.service';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MasterTable } from '../master-table/master-table';

@Component({
  selector: 'app-pay-period',
  imports: [RouterModule, CommonModule, FormsModule,MasterTable],
  templateUrl: './view-pay-period.html',
  styleUrl: './view-pay-period.scss',
})
export class ViewPayPeriod {
   constructor(public formService: FormsService) {}

}
