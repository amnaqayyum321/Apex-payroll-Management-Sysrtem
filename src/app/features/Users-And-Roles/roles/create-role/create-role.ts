import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { LoaderService } from '../../../../core/services/management-services/loader.service';

@Component({
  selector: 'app-create-role',
  imports: [CommonModule, FormsModule],
  standalone: true,
  templateUrl: './create-role.html',
  styleUrl: './create-role.scss',
})
export class CreateRole {

  




  constructor(
    private loader: LoaderService,
    private toastr: ToastrService,
    private router: Router
  ) {
   
  }

  


}
