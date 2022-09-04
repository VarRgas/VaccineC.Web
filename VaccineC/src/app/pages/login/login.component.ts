import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoginModel } from 'src/app/models/login-model';
import { LoginDispatcherService } from 'src/app/services/login-dispatcher.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { ErrorHandlerService } from 'src/app/services/error-handler.service';

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
    private errorHandler: ErrorHandlerService
  ) { }

  ngOnInit(): void {
  }

  public validateLogin(): void {

    let login = new LoginModel();
    login.email = this.userEmail;
    login.password = this.userPassword;

    this.loginDispatcherService.Login(login).subscribe(
      response => {

        login.email = response.Email;
        login.id = response.ID;
        login.personId = response.PersonID;
        login.personName = response.PersonName;
        localStorage.clear();

        localStorage.setItem('name', response.PersonName);
        localStorage.setItem('profilePic', response.PersonProfilePic);
        localStorage.setItem('userId', response.ID);

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
        this.errorHandler.handleError(error);
        this.userEmail = '';
        this.userPassword = '';
      });
  }
}
