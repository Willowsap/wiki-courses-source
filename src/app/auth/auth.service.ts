import { HttpClient } from '@angular/common/http';
import { Location } from '@angular/common';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { AuthData } from './auth-data.model';

import { environment } from 'src/environments/environment';
import { User } from './user.model';

const BACKEND_URL = environment.apiUrl + '/user/';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private isAuthenticated = false;
  private token: string = '';
  private user: User | null = null;
  private tokenTimer: NodeJS.Timer | null = null;
  private authStatusListener = new Subject<boolean>();
  private userListener = new Subject<User>();

  constructor(
    private http: HttpClient,
    private router: Router,
    private location: Location
  ) {}

  createUser(email: string, password: string) {
    const authData: AuthData = { email: email, password: password };
    this.http.post(BACKEND_URL + 'signup', authData).subscribe(
      (response) => {
        this.router.navigate(['/auth/login']);
      },
      (error) => {
        this.authStatusListener.next(false);
      }
    );
  }

  login(email: string, password: string) {
    const authData: AuthData = { email: email, password: password };
    this.http
      .post<{ user: User; token: string; expiresIn: number }>(
        BACKEND_URL + 'login',
        authData
      )
      .subscribe(
        (response) => {
          if (response.token) {
            const expiresInDuration = response.expiresIn;
            this.setAuthTimer(expiresInDuration);
            this.token = response.token;
            this.isAuthenticated = true;
            const expirationDate = new Date(
              new Date().getTime() + expiresInDuration * 1000
            );
            this.saveAuthData(response.user._id, this.token, expirationDate);
            this.user = response.user;
            this.userListener.next(this.user);
            this.authStatusListener.next(true);
            this.location.back();
          }
        },
        (error) => {
          this.authStatusListener.next(false);
        }
      );
  }

  autoAuthUser() {
    const authInformation = this.getAuthData();
    if (authInformation) {
      const expiresIn =
        authInformation.expirationDate.getTime() - new Date().getTime();
      if (expiresIn > 0) {
        this.token = authInformation.token;
        this.isAuthenticated = true;
        this.authStatusListener.next(true);
        this.setAuthTimer(expiresIn / 1000);
        this.getUserFromServer(authInformation.id);
      }
    }
  }

  logout() {
    this.token = '';
    this.isAuthenticated = false;
    this.authStatusListener.next(false);
    clearTimeout(this.tokenTimer!);
    this.clearAuthData();
    this.router.navigate(['/']);
  }

  setAuthTimer(duration: number) {
    this.tokenTimer = setTimeout(() => {
      this.logout();
    }, duration * 1000);
  }

  getToken() {
    return this.token;
  }
  getIsAuth() {
    return this.isAuthenticated;
  }
  getAuthStatusListener() {
    return this.authStatusListener.asObservable();
  }
  getUserListener() {
    return this.userListener.asObservable();
  }
  getAuthData() {
    const token = localStorage.getItem('token');
    const expirationDate = localStorage.getItem('expiration');
    const id = localStorage.getItem('id');
    if (token && expirationDate && id) {
      return {
        id: id,
        token: token,
        expirationDate: new Date(expirationDate),
      };
    }
    return null;
  }
  getUser() {
    return this.user as User;
  }
  getUserFromServer(_id: string) {
    this.http
      .get<{ user: User }>(BACKEND_URL + `single/${_id}`)
      .subscribe((response) => {
        if (response.user) {
          this.user = response.user;
          this.userListener.next(this.user);
        }
      });
  }
  verify(email: string) {
    return this.http.post<{ message: string }>(BACKEND_URL + 'verify', {
      email,
    });
  }
  private saveAuthData(id: string, token: string, expirationDate: Date) {
    localStorage.setItem('id', id);
    localStorage.setItem('token', token);
    localStorage.setItem('expiration', expirationDate.toISOString());
  }

  private clearAuthData() {
    localStorage.removeItem('id');
    localStorage.removeItem('token');
    localStorage.removeItem('expiration');
  }
}
