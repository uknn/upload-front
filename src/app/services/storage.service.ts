import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  USER_KEY = 'auth-user';
  private loggedIn = new BehaviorSubject<boolean>(false);

  get loggedIn$(): Observable<boolean> {
    return this.loggedIn.asObservable();
  }

  clean(): void {
    window.sessionStorage.clear();
  }

  saveUser(user: any): void {
    window.sessionStorage.removeItem(this.USER_KEY);
    window.sessionStorage.setItem(this.USER_KEY, JSON.stringify(user));
    this.isLoggedIn();
  }

  getUser(): User | undefined {
    const user = window.sessionStorage.getItem(this.USER_KEY);
    if (user) {
      return JSON.parse(user);
    }

    return undefined;
  }

  isLoggedIn(): boolean {
    const user = window.sessionStorage.getItem(this.USER_KEY);
    if (user) {
      this.loggedIn.next(true);
      return true;
    }
    this.loggedIn.next(false);
    return false;
  }
}
