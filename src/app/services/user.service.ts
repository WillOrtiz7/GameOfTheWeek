import { Injectable } from '@angular/core';
import { User } from '../models/database';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private _user!: User | null;
  set user(user: User | null) {
    this._user = user;
    localStorage.setItem("currentUser", JSON.stringify(user));
  }
  get user() {
    return this._user || JSON.parse(localStorage.getItem("currentUser")!);
  }
  constructor() { }
}
