import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../interfaces/user';

@Injectable({
  providedIn: 'root',
})

export class LoginService {
  constructor(private http: HttpClient) { }
  static URL = 'https://6317ca93f6b281877c5d7785.mockapi.io/users';

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(LoginService.URL);
  }

  user: User | undefined;
  setUserLogin(user: User) {
    this.user = user;
  }

  logout() {
    this.user = undefined;
  }
}
