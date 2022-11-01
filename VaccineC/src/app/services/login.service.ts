import { EventEmitter, Injectable, Output } from '@angular/core';
import { Router } from '@angular/router';
import { UserModel } from '../models/user-model';
import { JwtHelperService } from "@auth0/angular-jwt";

@Injectable()
export class LoginService {

  @Output() loginChanged = new EventEmitter<UserModel>();

  private loggedUser!: UserModel;
  private jwtHelper = new JwtHelperService();

  constructor(
    private router: Router
  ) {
    this.loadDataFromToken();
  }

  private loadDataFromToken() {
    let token = localStorage.getItem('token');
    if (!token)
      return false;

    let data = this.jwtHelper.decodeToken(token);
    this.loggedUser = new UserModel();
    this.loggedUser.id = data.id;
    this.loggedUser.email = data.email;
    this.loginChanged.emit(this.loggedUser);

    return data;
  }

  public getLoggedUser(): UserModel {
    return this.loggedUser;
  }

  public setLogin(token: string): void {
    localStorage.setItem('token', token);
    this.loginChanged.emit(this.loggedUser);
  }

  public logout() {
    localStorage.removeItem('token');
    this.loginChanged.emit(this.loggedUser);
    this.router.navigateByUrl('/login');
  }

  public validLogin(): boolean {
    let token = localStorage.getItem('token');
    if (!token)
      return false;

    let tokenExpired = this.jwtHelper.isTokenExpired(token);
    return !tokenExpired;
  }
}
