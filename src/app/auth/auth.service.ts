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

  constructor(private http: HttpClient, private router: Router) {}
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
      .subscribe((response) => {
        console.log(response);
        this.router.navigate(['/']);
      });
  }

  login(email: string, password: string) {
    const authData: AuthData = { email: email, password: password };
    this.http
      .post<{ token: string; expiresIn: number }>(
        'http://localhost:3000/api/user/login',
        authData
      )
      .subscribe((response) => {
        if (response.token) {
          this.token = response.token;
          this.status = true;
          this.authStatusSubject.next(true);

          const expiresInDuration = response.expiresIn;
          this.setAuthTimer(expiresInDuration);

          this.saveAuthData(
            this.token,
            new Date(new Date().getTime() + expiresInDuration * 1000)
          );

          this.router.navigate(['/']);
        }
      });
  }

  logout() {
    this.token = null;
    this.status = false;
    this.authStatusSubject.next(false);

    clearTimeout(this.tokenTimer);
    this.clearAuthData();

    this.router.navigate(['/']);
  }

  autoAuth() {
    const authInfo = this.getAuthData();
    if (!authInfo) {
      return;
    }
    const expiresIn = authInfo.expirationDate.getTime() - new Date().getTime();
    if (expiresIn > 0) {
      this.token = authInfo.token;
      this.status = true;
      this.authStatusSubject.next(true);

      this.setAuthTimer(expiresIn / 1000);
    }
  }

  private saveAuthData(token: string, expirationDate: Date) {
    localStorage.setItem('token', token);
    localStorage.setItem('expiration', expirationDate.toISOString());
  }

  private clearAuthData() {
    localStorage.removeItem('token');
    localStorage.removeItem('expiration');
  }

  private getAuthData() {
    const token = localStorage.getItem('token');
    const expirationDate = localStorage.getItem('expiration');
    if (!token || !expirationDate) {
      return;
    }
    return {
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
