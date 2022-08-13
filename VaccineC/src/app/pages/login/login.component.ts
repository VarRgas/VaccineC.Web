import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoginModel } from 'src/app/models/login-model';
import { LoginDispatcherService } from 'src/app/services/login-dispatcher.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {


  loginForm: FormGroup = this.formBuilder.group({
    email: [null, [Validators.required]],
    password: [null, [Validators.required]]
  });

  constructor(private loginDispatcherService: LoginDispatcherService,
    private formBuilder: FormBuilder,) {

  }

  ngOnInit(): void {
  }

  public validateLogin(): void {
    let login = new LoginModel();
    login.email = 'amanda@bla.com';
    login.password = 'amanda123'

    this.loginDispatcherService.Login(login).subscribe(a => {
    })
  }
}
