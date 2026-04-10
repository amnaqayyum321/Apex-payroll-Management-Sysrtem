import { Component } from '@angular/core';
import { FormsService } from '../../Services/forms';
import { ToastrService } from 'ngx-toastr';
import { LoaderService } from '../../../../core/services/management-services/loader.service';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MasterTable } from '../master-table/master-table';

@Component({
  selector: 'app-view-pay-element-list',
  imports: [RouterModule, CommonModule, FormsModule,MasterTable],
  templateUrl: './view-pay-element-list.html',
  styleUrl: './view-pay-element-list.scss',
  standalone: true,
})
export class ViewPayElementList {
     constructor(public formService: FormsService) {}


     payElementTransform = (item: any) => {
  return {
    ...item,
    taxableBadge: item.isTaxable ? 'Yes' : 'No'
  };
};
}
