import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoginModel } from 'src/app/models/login-model';
import { LoginDispatcherService } from 'src/app/services/login-dispatcher.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  public userEmail!: string;
  public userPassword!: string;

  loginForm: FormGroup = this.formBuilder.group({
    email: [null, [Validators.required]],
    password: [null, [Validators.required]]
  });

  constructor(
    private loginDispatcherService: LoginDispatcherService,
    private formBuilder: FormBuilder,
    private snackBar: MatSnackBar,
    private router: Router,
  ) { }

  ngOnInit(): void {
  }

  public validateLogin(): void {

    let login = new LoginModel();
    login.email = this.userEmail;
    login.password = this.userPassword;

    this.loginDispatcherService.Login(login).subscribe(
      response => {
        console.log(response);
        login.email = response.Email;
        login.id = response.ID;
        login.personId = response.PersonID;
        login.personName = response.PersonName;

        this.snackBar.open("Logado com sucesso!", 'Ok', {
          horizontalPosition: 'right',
          verticalPosition: 'bottom',
          duration: 5000,
          panelClass: ['success-snackbar']
        });

        this.router.navigateByUrl('/home', {
          state: { login: login }
        });
      },
      error => {
        console.log(error);
        this.snackBar.open('Usuário ou senha inválidos, verifique e tente novamente!', 'Ok', {
          horizontalPosition: 'center',
          verticalPosition: 'top',
          duration: 5000,
          panelClass: ['danger-snackbar']
        });
        this.userEmail = '';
        this.userPassword = '';
      });
  }
}
