import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthData } from './auth-data.model';
import { Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private status: boolean = false;
  private authStatusSubject = new Subject<boolean>();
  private token: string;

  constructor(private http: HttpClient) {}
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
      });
  }

  login(email: string, password: string) {
    const authData: AuthData = { email: email, password: password };
    this.http
      .post<{ token: string }>('http://localhost:3000/api/user/login', authData)
      .subscribe((response) => {
        if (response.token) {
          this.token = response.token;
          this.status = true;
          this.authStatusSubject.next(true);
        }
      });
  }

  logout() {
    this.token = null;
    this.status = false;
    this.authStatusSubject.next(false);
  }
}
