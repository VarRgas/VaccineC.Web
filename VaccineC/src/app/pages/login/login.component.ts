import { Component, OnInit } from '@angular/core';
import { LoginModel } from 'src/app/models/login-model';
import { LoginDispatcherService } from 'src/app/services/login-dispatcher.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  constructor(private loginDispatcherService: LoginDispatcherService) {

  }

  ngOnInit(): void {
  }

  public validateLogin(): void {
    let login = new LoginModel();
    login.email = 'teste';
    login.password = 'teste'
    this.loginDispatcherService.Login(login).subscribe(a => {
    })
  }
}
