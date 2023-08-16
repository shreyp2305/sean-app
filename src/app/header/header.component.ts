import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit, OnDestroy {
  isAuthenticated: boolean = false;
  private authSub: Subscription;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.isAuthenticated = this.authService.getAuthStatus();
    this.authSub = this.authService
      .getAuthStatusSubject()
      .subscribe((authStatus) => {
        this.isAuthenticated = authStatus;
      });
  }

  ngOnDestroy(): void {
    this.authSub.unsubscribe();
  }

  onLogout() {
    this.authService.logout();
  }
}
