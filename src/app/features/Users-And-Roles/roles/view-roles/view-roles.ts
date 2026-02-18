  import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { LoaderService } from '../../../../core/services/management-services/loader.service';
// import { PaginationComponent } from '../../../../shared/components/commons/components/pagination/pagination.component';
@Component({
  selector: 'app-view-roles',
  imports: [CommonModule, RouterModule, NgbDropdownModule],
  templateUrl: './view-roles.html',
  styleUrl: './view-roles.scss',
})
export class ViewRoles {
  constructor(
    private toastr: ToastrService,
    private loader: LoaderService,
    private router: Router
  ) { }

 


}
