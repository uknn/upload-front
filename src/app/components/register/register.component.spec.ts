import {
  ComponentFixture,
  TestBed, waitForAsync
} from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/user.model';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { ImageListComponent } from '../image-list/image-list.component';
import { RegisterComponent } from '../register/register.component';


const mockAuthService = {
  login: jest.fn(),
  register: jest.fn()
}

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  let authService: AuthService;
  let router: Router;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: AuthService, useValue: mockAuthService }],
      declarations: [ RegisterComponent, ImageListComponent ],
      imports: [RouterTestingModule.withRoutes([
        { path: 'image', component: ImageListComponent },
        { path: '**', redirectTo: '' }
      ])]
    });
    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService);
    router = TestBed.inject(Router);
  }));

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should exist', () => {
    expect(component).toBeDefined();
  });

  describe('getUsernameControl', () => {
    it('should return a formControl', () => {
      component.form = new FormGroup({
        password: new FormControl('password'),
        username: new FormControl('username'),
        email: new FormControl('email'),
      });
      const result = component.getUsernameControl();
      expect((result as FormControl).value).toEqual('username');
    });
  })

  describe('getPasswordControl', () => {
    it('should return a formControl', () => {
      component.form = new FormGroup({
        password: new FormControl('password'),
        username: new FormControl('username'),
        email: new FormControl('email'),
      });
      const result = component.getPasswordControl();
      expect((result as FormControl).value).toEqual('password');
    });
  })

  describe('getEmailControl', () => {
    it('should return a formControl', () => {
      component.form = new FormGroup({
        password: new FormControl('password'),
        username: new FormControl('username'),
        email: new FormControl('email'),
      });
      const result = component.getEmailControl();
      expect((result as FormControl).value).toEqual('email');
    });
  })

  describe('onSubmit', () => {
    it('should do nothing if the form is invalid', () => {
      component.form = new FormGroup({
        password: new FormControl(),
        username: new FormControl('username'),
        email: new FormControl('email'),
      });
      component.form.setErrors({ 'invalid': true });
      component.onSubmit();
      expect(mockAuthService.register).not.toHaveBeenCalled();
    });

    it('should do nothing if the form is invalid', () => {
      component.form = new FormGroup({
        password: new FormControl('password'),
        username: new FormControl('username'),
        email: new FormControl('email'),
      });
      const user: User = {
        username: '',
        email: '',
        password: '',
        id: ''
      }
      mockAuthService.register.mockReturnValue(of(user))
      component.onSubmit();
      expect(mockAuthService.register).toHaveBeenCalled();
    });

    it('should catch an error', () => {
      component.form = new FormGroup({
        password: new FormControl('password'),
        username: new FormControl('username'),
        email: new FormControl('email'),
      });
      mockAuthService.register.mockReturnValue(throwError(() => ({ error: 'test' })));
      component.onSubmit();
      expect(component.errorMessage).toEqual('test');
    });
  })
});
