import { Component, OnDestroy, OnInit } from '@angular/core';
import { StorageService } from './services/storage.service';
import { AuthService } from './services/auth.service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'photo-front';
  isLoggedIn = false;
  username?: string;
  subscription = new Subscription();
  errorMessage = '';

  constructor(private storageService: StorageService, private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
    this.subscription.add(this.storageService.loggedIn$.subscribe((isLoggedIn) => {
      this.isLoggedIn = isLoggedIn;
      if (this.isLoggedIn) {
        const user = this.storageService.getUser();
        this.username = user?.username;
      }
    }))
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  /**
   * Logout the user, clear the session storage then redirect to login page
   */
  logout(): void {
    this.subscription.add(this.authService.logout().subscribe({
      next: res => {
        this.storageService.clean();
        void this.router.navigate(['/login']);
      },
      error: err => {
        this.errorMessage = err.error;
      }
    }));
  }
}
