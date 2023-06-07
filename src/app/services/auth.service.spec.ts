import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from "@angular/common/http/testing";
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    service = TestBed.inject(AuthService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  describe('login', () => {
    it('should make a post http call ', () => {
      const username = 'username'
      const password = 'password'
      service.login(username, password).subscribe();
      const req = httpTestingController.expectOne('http://localhost:4000/api/auth/login');
      expect(req.request.method).toEqual("POST");
      expect(req.request.body).toEqual({
        username,
        password
      });
    });
  });

  describe('register', () => {
    it('should make a post http call ', () => {
      const username = 'username'
      const password = 'password'
      const email = 'email'
      service.register(username, email, password).subscribe();
      const req = httpTestingController.expectOne('http://localhost:4000/api/auth/register');
      expect(req.request.method).toEqual("POST");
      expect(req.request.body).toEqual({
        username,
        email,
        password
      });
    });
  });

  describe('logout', () => {
    it('should make a post http call ', () => {
      service.logout().subscribe();
      const req = httpTestingController.expectOne('http://localhost:4000/api/auth/logout');
      expect(req.request.method).toEqual("POST");
      expect(req.request.body).toEqual({
      });
    });
  });
});
