import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LoaderComponent } from './shared/components/commons/components/loader/loader.component';
import { SessionService } from './core/services/management-services/Session.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, LoaderComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected readonly title = signal('apex-onboarding-recruitment');
  // constructor(private sessionService: SessionService) {}
  // ngOnInit() {
  //   const userId = localStorage.getItem('userId');

  //   if (userId) {
  //     // Reload permissions on every page refresh
  //     this.sessionService.loadUserAndApplyMenu(userId);
  //   }
  // }
}
