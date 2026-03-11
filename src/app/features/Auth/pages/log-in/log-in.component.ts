import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../service/auth.service';
import { EncryptionService } from '../../../../core/services/management-services/encryption.service';
import { LoaderService } from '../../../../core/services/management-services/loader.service';
import { ThemeService } from '../../../../core/services/management-services/Theme.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SessionService } from '../../../../core/services/management-services/Session.service';
import { MenuVisibilityService } from '../../../../core/services/management-services/menu-visibility.service';

@Component({
  selector: 'app-log-in',
  standalone: true,
  imports: [CommonModule, FormsModule],
  providers: [AuthService, EncryptionService, LoaderService, ThemeService],
  templateUrl: './log-in.component.html',
  styleUrl: './log-in.component.scss',
})
export class LogInComponent {
  isDarkMode = false;
  constructor(
    private router: Router,
    private authService: AuthService,
    private toaster: ToastrService,
    private encryptionService: EncryptionService,
    private loader: LoaderService,
    private themeService: ThemeService,
    private sessionSv: SessionService,
    private menuVisibilityService: MenuVisibilityService,
  ) {}
  ngOnInit() {
    this.themeService.isLightTheme$.subscribe((value) => {
      this.isDarkMode = !value;
    });
  }
  email: string = '';
  password: string = '';
  // onLogin() {
  //   if (!this.email || !this.password) {
  //     this.toaster.error('Please fill in all required fields.');
  //     return;
  //   }
  //   this.loading = true;
  //   this.loader.show();
  //   this.authService.logIn({ email: this.email, password: this.password }).subscribe({
  //     next: (response: any) => {
  //       this.loading = false;

  //       if (!response.data.preAuthToken) {
  //         this.toaster.success('Login successful!');
  //         // let userId = this.encryptionService.encrypt(response.data.userId);
  //         // localStorage.setItem('userId', userId);
  //         // this.sessionSv.loadUserAndApplyMenu(userId);
  //         // localStorage.setItem('token', response.data.accessToken);

  //         // localStorage.setItem('refreshToken', response.data.refreshToken);

  //         const rawUserId = response.data.userId; // ← raw userId
  //         const roleCode = response.data.roleCode;
  //         const encryptedUserId = this.encryptionService.encrypt(rawUserId);
  //         console.log('user raw id', rawUserId);

  //         localStorage.setItem('token', response.data.accessToken);
  //         localStorage.setItem('refreshToken', response.data.refreshToken);
  //         localStorage.setItem('userId', encryptedUserId);
  //         localStorage.setItem('roleCode', roleCode);
  //         // this.router.navigate(['/panel/dashboard']);
  //         this.sessionSv.loadUserAndApplyMenu(rawUserId);
  //         this.router.navigate(['/panel/dashboard']);
  //       } else {
  //         let preAuthToken = this.encryptionService.encrypt(response.data.preAuthToken);
  //         this.toaster.success('A verification code has been sent to your email.');
  //         this.router.navigate(['/verify-otp', preAuthToken]);
  //       }
  //       this.loader.hide();
  //     },
  //     error: (error) => {
  //       this.loading = false;

  //       this.toaster.error(error.error.message || 'Login failed. Please try again.');
  //       this.loader.hide();
  //     },
  //   });
  // }
  onLogin() {
    if (!this.email || !this.password) {
      this.toaster.error('Please fill in all required fields.');
      return;
    }

    this.loading = true;
    this.loader.show();

    this.authService.logIn({ email: this.email, password: this.password }).subscribe({
      next: (response: any) => {
        this.loading = false;

        if (!response.data.preAuthToken) {
          const rawUserId = response.data.userId;
          const encryptedUserId = this.encryptionService.encrypt(rawUserId);
          localStorage.setItem('token', response.data.accessToken);
          localStorage.setItem('refreshToken', response.data.refreshToken);
          localStorage.setItem('userId', encryptedUserId);

          this.sessionSv.loadUserAndApplyMenu().subscribe({
            next: () => {
              this.toaster.success('Login successful!');
              this.loader.hide();
              this.router.navigate(['/panel/dashboard']);
            },
            error: (err) => {
              console.error('❌ Menu load failed:', err);
              this.loader.hide();
              this.router.navigate(['/panel/dashboard']);
            },
          });
        } else {
          let preAuthToken = this.encryptionService.encrypt(response.data.preAuthToken);
          this.toaster.success('A verification code has been sent to your email.');
          this.loader.hide();
          this.router.navigate(['/verify-otp', preAuthToken]);
        }
      },
      error: (error) => {
        this.loading = false;
        this.toaster.error(error.error.message || 'Login failed. Please try again.');
        this.loader.hide();
      },
    });
  }
  loading = false;

  showPassword = false;

  togglePassword() {
    this.showPassword = !this.showPassword;
  }
}
