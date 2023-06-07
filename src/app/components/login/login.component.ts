import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { StorageService } from '../../services/storage.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AbstractControl, FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {
  form = new FormGroup({
    password: new FormControl(''),
    username: new FormControl(''),
  });
  isLoggedIn = false;
  isLoginFailed = false;
  errorMessage = '';
  name: string | undefined = '';
  subscription = new Subscription();

  constructor(private authService: AuthService, private storageService: StorageService, private router: Router) { }

  ngOnInit(): void {
    this.subscription.add(this.storageService.loggedIn$.subscribe((isLoggedIn) => {
      this.isLoggedIn = isLoggedIn;
      this.name = this.storageService.getUser()?.username;
    }))
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  getUsernameControl(): AbstractControl {
    return this.form.get('username') as FormControl;
  }

  getPasswordControl(): AbstractControl {
    return this.form.get('password') as FormControl;
  }

  /**
   * Login and save the user to the session storage then redirect to the image list
   */
  onSubmit(): void {
    if (this.form.valid) {
      this.authService.login(this.getUsernameControl().value, this.getPasswordControl().value).subscribe({
        next: data => {
          this.storageService.saveUser(data);

          this.isLoginFailed = false;
          this.isLoggedIn = true;
          this.name = this.storageService.getUser()?.username;

          void this.router.navigate(['/image']);
        },
        error: err => {
          this.errorMessage = err.error;
          this.isLoginFailed = true;
        }
      });
    }

  }
}
