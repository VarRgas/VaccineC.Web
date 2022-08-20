import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { LoginModel } from "../models/login-model";

const baseURL = 'http://localhost:5000/api/Login';

@Injectable({
  providedIn: 'root'
})

export class LoginDispatcherService {
  constructor(private httpClient: HttpClient) { }

  public Login(loginModel: LoginModel): Observable<any> {
    return this.httpClient.post(baseURL, loginModel);
  }
}

