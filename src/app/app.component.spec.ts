import {
  ComponentFixture,
  TestBed, waitForAsync
} from '@angular/core/testing';
import { of, Subscription, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';
import { StorageService } from './services/storage.service';
import { AuthService } from './services/auth.service';
import { ImageListComponent } from './components/image-list/image-list.component';
import { User } from './models/user.model';


const mockAuthService = {
  logout: jest.fn(),
}

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let storageService: StorageService;
  let authService: AuthService;
  let router: Router;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        StorageService],
      declarations: [ AppComponent, ImageListComponent ],
      imports: [RouterTestingModule.withRoutes([
        { path: 'image', component: ImageListComponent },
        { path: '**', redirectTo: '' }
      ])]
    });
    fixture = TestBed.createComponent(AppComponent);
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
      expect(component.username).toEqual('username');
      expect(component.isLoggedIn).toBeTruthy();
    });

    it('should not call storageService.getUser when a user not loggedIn', () => {
      jest.spyOn(storageService, 'getUser').mockReturnValue({ username: 'username' } as User);
      jest.spyOn(StorageService.prototype, 'loggedIn$', 'get').mockReturnValue(of(false))
      component.ngOnInit();
      expect(storageService.getUser).not.toHaveBeenCalled();
      expect(component.isLoggedIn).toBeFalsy();
    });
  })

  describe('ngOnDestroy', () => {
    it('should call unsubscribe', () => {
      jest.spyOn(Subscription.prototype, 'unsubscribe');
      component.ngOnDestroy();
      expect(Subscription.prototype.unsubscribe).toHaveBeenCalled();
    });
  })

  describe('logout', () => {
    it('should call clean()', () => {
      // @ts-ignore
      const routerNavigateSpy = jest.spyOn(router, 'navigate').mockImplementation(() => of(true).toPromise());
      const storageCleanSpy = jest.spyOn(storageService, 'clean')
      mockAuthService.logout.mockReturnValue(of(true))
      component.logout();
      expect(storageCleanSpy).toHaveBeenCalled();
      expect(routerNavigateSpy).toHaveBeenCalledWith(['/login']);
    });

    it('should catch an error', () => {
      mockAuthService.logout.mockReturnValue(throwError(() => ({ error: 'test' })));
      component.logout();
      expect(component.errorMessage).toEqual('test');
    });
  })
});
