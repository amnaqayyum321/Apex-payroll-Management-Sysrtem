import { Component, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LoaderComponent } from './shared/components/commons/components/loader/loader.component';
import { SessionService } from './core/services/management-services/Session.service';
import { EncryptionService } from './core/services/management-services/encryption.service';
import { MenuVisibilityService } from './core/services/management-services/menu-visibility.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, LoaderComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App implements OnInit {
  protected readonly title = signal('apex-onboarding-recruitment');
  constructor(private sessionService: SessionService) {}
  ngOnInit() {
    // const token = localStorage.getItem('token');
    // console.log('token get after login', token);
    // if (token) {
    //   this.sessionService.loadUserAndApplyMenu().subscribe({
    //     next: () => console.log('✅ Session restored'),
    //     error: (err) => {
    //       console.error('❌ Session restore failed:', err);
    //       localStorage.clear();
    //       window.location.href = '/login';
    //     },
    //   });
    // }
  }
}
