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
          const expiresInDuration = response.expiresIn;
          this.tokenTimer = setTimeout(() => {
            this.logout();
            console.log('logged out');
          }, expiresInDuration * 1000);
          this.status = true;
          this.authStatusSubject.next(true);
          this.router.navigate(['/']);
        }
      });
  }

  logout() {
    this.token = null;
    this.status = false;
    this.authStatusSubject.next(false);
    clearTimeout(this.tokenTimer);
    this.router.navigate(['/']);
  }
}
