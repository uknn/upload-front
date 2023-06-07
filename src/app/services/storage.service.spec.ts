import { TestBed } from '@angular/core/testing';
import { ImageUploadService } from './image-upload.service';
import { StorageService } from './storage.service';
import { User } from '../models/user.model';


describe('StorageService', () => {
  let service: StorageService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ImageUploadService]
    });
    service = TestBed.inject(StorageService);
  });

  describe('loggedIn$', () => {
    it('should return an observable of true', () => {
      (service as any).loggedIn.next(true);
      const result = service.loggedIn$;
      result.subscribe((value) => {
        expect(value).toBeTruthy();
      })
    });
  });

  describe('window', () => {
    beforeEach(() => {
      window.sessionStorage.clear();
    })

    it('clean() should call clear on sessionStorage', () => {
      window.sessionStorage.setItem('test', 'test');
      service.clean();
      expect(window.sessionStorage.getItem('test')).toBeNull();
    });

    it('saveUser() should set the session storage', () => {
      service.USER_KEY = 'test'
      service.saveUser('test');
      expect(window.sessionStorage.getItem('test')).toEqual('\"test\"');
    });

    it('saveUser() should call isLoggedIn', () => {
      jest.spyOn(service, 'isLoggedIn')
      service.saveUser('test');
      expect(service.isLoggedIn).toHaveBeenCalled();
    });

    it('getUser() should return undefined', () => {
      service.USER_KEY = 'test'
      const user = service.getUser();
      expect(user).toBeUndefined();
    });

    it('getUser() should return a user', () => {
      service.USER_KEY = 'test'
      const expectedUser: User = {
        email: 'email',
        password: 'pass',
        id: 'id',
        username: 'username'
      }
      window.sessionStorage.setItem('test', JSON.stringify(expectedUser));
      const user = service.getUser();

      expect(user).toEqual(expectedUser);
    });

    it('isLoggedIn() should return true when a user is loggedIn', () => {
      service.USER_KEY = 'test'
      const user: User = {
        email: 'email',
        password: 'pass',
        id: 'id',
        username: 'username'
      }
      window.sessionStorage.setItem('test', JSON.stringify(user));
      const result = service.isLoggedIn()
      expect(result).toBeTruthy();
    });

    it('isLoggedIn() should return false when the user is not loggedIn', () => {
      service.USER_KEY = 'test'
      const result = service.isLoggedIn()
      expect(result).toBeFalsy();
    });
  });
});
