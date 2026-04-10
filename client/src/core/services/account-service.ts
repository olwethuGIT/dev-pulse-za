import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { LoginCreds, RegisterCreds, User } from '../../types/user';
import { tap } from 'rxjs/internal/operators/tap';

@Injectable({
  providedIn: 'root',
})
export class AccountService {
  private http = inject(HttpClient);
  currentUser = signal<User | null>(null);

  private baseUrl = environment.apiUrl;

  register(creds: RegisterCreds) {
    return this.http.post<User>(`${this.baseUrl}account/register`, creds).pipe(
      tap((user) => {
        if (user) {
          this.setCurrentUser(user);
        }
      }),
    );
  }

  login(creds: LoginCreds) {
    return this.http.post<User>(`${this.baseUrl}account/login`, creds).pipe(
      tap((user) => {
        if (user) {
          this.setCurrentUser(user);
        }
      }),
    );
  }

  googleLogin(token: any) {
    return this.http.post<User>(`${this.baseUrl}account/google`, {token: token}).pipe(
      tap((user) => {
        if (user) {
          this.setCurrentUser(user);
        }
      }),
    );
  }

  githubLogin() {
    window.location.href = `https://github.com/login/oauth/authorize?client_id=Ov23lidgsagbNnbeDOb8&redirect_uri=${this.baseUrl}account/github&scope=user:email`;

    // return this.http.get<User>(`${this.baseUrl}account/github`).pipe(
    //   tap((user) => {
    //     if (user) {
    //       this.setCurrentUser(user);
    //     }
    //   }),
    // );
  }

  setCurrentUser(user: User) {
    localStorage.setItem('user', JSON.stringify(user));
    this.currentUser.set(user);
  }

  logout() {
    localStorage.removeItem('user');
    this.currentUser.set(null);
  }
}
