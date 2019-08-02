import { Injectable } from '@angular/core';
import { StorageService } from './storage.service';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { BehaviorSubject, Observable } from 'rxjs';
import * as jwt_decode from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly userSubject$ = new BehaviorSubject<string | null>(this.username);

  constructor(
    private readonly storage: StorageService,
    private readonly http: HttpClient,
  ) { }

  public get user$(): Observable<string | null> {
    return this.userSubject$.asObservable();
  }

  private get username(): string | null {
    const token = this.storage.get('token');
    const username = this.storage.get('username') || '';
    if (token) {
      return username;
    }
    return null;
  }

  public tokenPeyloadLogger(): any {
    const token = this.storage.get('token');
    const decoded = jwt_decode(token);
    console.log(decoded);
    return decoded;
  }

  public tokenPeyloadReader(token: string): any {
    const decoded = jwt_decode(token);
    return decoded;
  }

  public register(username: string, password: string, email: string, firstName: string, lastName: string) {
    const res = this.http.post('http://localhost:3000/api/register', {
      username,
      password,
      email,
      firstName,
      lastName,
    });

    return res;
  }

  public login(username: string, password: string) {

    return this.http
      .post('http://localhost:3000/api/login', {
        username,
        password,
      })
      .pipe(
        tap((res: any) => {

          const payload: any = this.tokenPeyloadReader(res.token);
          this.userSubject$.next(payload.username);
          this.storage.set('token', res.token);
          this.storage.set('username', payload.username);
          this.storage.set('recipe', '');
        })
      );
  }

  public logout(): void {
    this.storage.remove('token');
    this.storage.remove('username');
    this.storage.remove('recipe');
    this.userSubject$.next(null);
  }
}

