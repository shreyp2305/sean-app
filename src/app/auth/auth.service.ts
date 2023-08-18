import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthData } from './auth-data.model';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private status: boolean = false;
  private authStatusSubject = new Subject<boolean>();
  private token: string;
  private tokenTimer: any;
  private userId: number;

  constructor(private http: HttpClient, private router: Router) {}
  getUserId() {
    return this.userId;
  }

  getToken() {
    return this.token;
  }

  getAuthStatus() {
    return this.status;
  }

  getAuthStatusSubject() {
    return this.authStatusSubject.asObservable();
  }

  createUser(email: string, password: string) {
    const authData: AuthData = { email: email, password: password };
    this.http
      .post('http://localhost:3000/api/user/signup', authData)
      .subscribe({
        next: (response) => {
          this.router.navigate(['/']);
        },
        error: (error) => {
          this.authStatusSubject.next(false);
        },
      });
  }

  login(email: string, password: string) {
    const authData: AuthData = { email: email, password: password };
    this.http
      .post<{ token: string; expiresIn: number; userId: number }>(
        'http://localhost:3000/api/user/login',
        authData
      )
      .subscribe({
        next: (response) => {
          if (response.token) {
            this.userId = response.userId;
            this.token = response.token;
            this.status = true;
            this.authStatusSubject.next(true);

            const expiresInDuration = response.expiresIn;
            this.setAuthTimer(expiresInDuration);

            this.saveAuthDataToLocalStorage(
              this.userId,
              this.token,
              new Date(new Date().getTime() + expiresInDuration * 1000)
            );

            this.router.navigate(['/']);
          }
        },
        error: (error) => {
          this.authStatusSubject.next(false);
        },
      });
  }

  logout() {
    this.userId = null;
    this.token = null;
    this.status = false;
    this.authStatusSubject.next(false);

    clearTimeout(this.tokenTimer);
    this.clearAuthDataFromLocalStorage();

    this.router.navigate(['/']);
  }

  autoAuth() {
    const authInfo = this.getAuthDataFromLocalStorage();
    if (!authInfo) {
      return;
    }
    const expiresIn = authInfo.expirationDate.getTime() - new Date().getTime();
    if (expiresIn > 0) {
      this.userId = +authInfo.userId;
      this.token = authInfo.token;
      this.status = true;
      this.authStatusSubject.next(true);

      this.setAuthTimer(expiresIn / 1000);
    }
  }

  private saveAuthDataToLocalStorage(
    userId: number,
    token: string,
    expirationDate: Date
  ) {
    localStorage.setItem('userId', userId.toString());
    localStorage.setItem('token', token);
    localStorage.setItem('expiration', expirationDate.toISOString());
  }

  private clearAuthDataFromLocalStorage() {
    localStorage.removeItem('userId');
    localStorage.removeItem('token');
    localStorage.removeItem('expiration');
  }

  private getAuthDataFromLocalStorage() {
    const userId = localStorage.getItem('userId');
    const token = localStorage.getItem('token');
    const expirationDate = localStorage.getItem('expiration');
    if (!token || !expirationDate) {
      return;
    }
    return {
      userId: userId,
      token: token,
      expirationDate: new Date(expirationDate),
    };
  }

  private setAuthTimer(duration: number) {
    this.tokenTimer = setTimeout(() => {
      this.logout();
    }, duration * 1000);
  }
}
