import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { AbstractControl, FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  form = new FormGroup({
    password: new FormControl(''),
    username: new FormControl(''),
    email: new FormControl(''),
  });
  isSuccessful = false;
  isSignUpFailed = false;
  errorMessage = '';

  constructor(private authService: AuthService, private router: Router) { }

  getUsernameControl(): AbstractControl {
    return this.form.get('username') as FormControl;
  }

  getPasswordControl(): AbstractControl {
    return this.form.get('password') as FormControl;
  }

  getEmailControl(): AbstractControl {
    return this.form.get('email') as FormControl;
  }

  /**
   * Register the user
   */
  onSubmit(): void {
    if (this.form.valid) {
      this.authService.register(this.getUsernameControl().value,
        this.getEmailControl().value,
        this.getPasswordControl().value).subscribe({
        next: data => {
          this.isSuccessful = true;
          this.isSignUpFailed = false;
        },
        error: err => {
          this.errorMessage = err.error;
          this.isSignUpFailed = true;
        }
      });
    }

  }
}
