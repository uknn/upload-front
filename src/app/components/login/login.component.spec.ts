import {
  ComponentFixture,
  TestBed, waitForAsync
} from '@angular/core/testing';
import { LoginComponent } from "./login.component";
import { of, Subscription, throwError } from "rxjs";
import { AuthService } from '../../services/auth.service';
import { StorageService } from '../../services/storage.service';
import { User } from '../../models/user.model';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { ImageListComponent } from '../image-list/image-list.component';


const mockAuthService = {
  login: jest.fn(),
}

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let storageService: StorageService;
  let authService: AuthService;
  let router: Router;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        StorageService],
      declarations: [ LoginComponent, ImageListComponent ],
      imports: [RouterTestingModule.withRoutes([
        { path: "image", component: ImageListComponent },
        { path: "**", redirectTo: "" }
      ])]
    });
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    storageService = TestBed.inject(StorageService);
    authService = TestBed.inject(AuthService);
    router = TestBed.inject(Router);
  }));

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should exist', () => {
    expect(component).toBeDefined();
  });

  describe('onInit', () => {
    it('should call storageService.getUser when a user is loggedIn', () => {
      jest.spyOn(storageService, 'getUser').mockReturnValue({ username: 'username' } as User);
      jest.spyOn(StorageService.prototype, 'loggedIn$', 'get').mockReturnValue(of(true))
      component.ngOnInit();
      expect(storageService.getUser).toHaveBeenCalled();
      expect(component.name).toEqual('username');
      expect(component.isLoggedIn).toBeTruthy();
    });
  })

  describe('ngOnDestroy', () => {
    it('should call unsubscribe', () => {
      jest.spyOn(Subscription.prototype, 'unsubscribe');
      component.ngOnDestroy();
      expect(Subscription.prototype.unsubscribe).toHaveBeenCalled();

    });
  })

  describe('getUsernameControl', () => {
    it('should return a formControl', () => {
      component.form = new FormGroup({
        password: new FormControl('password'),
        username: new FormControl('username'),
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
      });
      const result = component.getPasswordControl();
      expect((result as FormControl).value).toEqual('password');
    });
  })

  describe('onSubmit', () => {
    it('should do nothing if the form is invalid', () => {
      component.form = new FormGroup({
        password: new FormControl(),
        username: new FormControl('username'),
      });
      component.form.setErrors({ 'invalid': true });
      component.onSubmit();
      expect(mockAuthService.login).not.toHaveBeenCalled();
    });

    it('should do nothing if the form is invalid', () => {
      component.form = new FormGroup({
        password: new FormControl('password'),
        username: new FormControl('username'),
      });
      const user: User = {
        username: '',
        email: '',
        password: '',
        id: ''
      }
      const saveUserSpy = jest.spyOn(storageService, 'saveUser');
      // @ts-ignore
      const routerNavigateSpy = jest.spyOn(router, 'navigate').mockImplementation(() => of(true).toPromise());
      mockAuthService.login.mockReturnValue(of(user))
      component.onSubmit();
      expect(mockAuthService.login).toHaveBeenCalled();
      expect(saveUserSpy).toHaveBeenCalled();
      expect(routerNavigateSpy).toHaveBeenCalledWith(['/image']);
    });

    it('should catch an error', () => {
      component.form = new FormGroup({
        password: new FormControl('password'),
        username: new FormControl('username'),
      });
      mockAuthService.login.mockReturnValue(throwError(() => ({ error: 'test' })));
      component.onSubmit();
      expect(component.errorMessage).toEqual('test');
    });
  })
});
