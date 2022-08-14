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

  public exampleInputEmail!: string; 
  public exampleInputPassword!: string; 

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
    login.email = this.exampleInputEmail;
    login.password = this.exampleInputPassword;

    this.loginDispatcherService.Login(login).subscribe(a => {
    })
  }
}
