import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoginModel } from 'src/app/models/login-model';
import { LoginDispatcherService } from 'src/app/services/login-dispatcher.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { ErrorHandlerService } from 'src/app/services/error-handler.service';
import { NotificationsDispatcherService } from 'src/app/services/notification-dispatcher.service';
import { MessageHandlerService } from 'src/app/services/message-handler.service';
import { LoginService } from 'src/app/services/login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})

export class LoginComponent implements OnInit {

  public userEmail!: string;
  public userPassword!: string;
  public loading = false;

  hide: boolean = true;

  loginForm: FormGroup = this.formBuilder.group({
    email: [null, [Validators.required]],
    password: [null, [Validators.required]]
  });

  constructor(
    private loginDispatcherService: LoginDispatcherService,
    private formBuilder: FormBuilder,
    private snackBar: MatSnackBar,
    private router: Router,
    private errorHandler: ErrorHandlerService,
    private notificationsDispatcherService: NotificationsDispatcherService,
    private messageHandlerService: MessageHandlerService,
    private loginService: LoginService
  ) { }

  ngOnInit(): void {
    localStorage.clear();
    this.manageNotifications();
  }

  showHiddePassword() {
    this.hide = !this.hide;
  }

  manageNotifications(): void {
    this.notificationsDispatcherService.manageNotifications().subscribe(
      response => {

      },
      error => {
        console.log(error);
      });

  }

  public validateLogin(): void {
    this.loading = true;

    let login = new LoginModel();
    login.email = this.userEmail;
    login.password = this.userPassword;

    this.loginDispatcherService.Login(login).subscribe(
      response => {

        login.email = response.Email;
        login.id = response.ID;
        login.personId = response.PersonID;
        login.personName = response.PersonName;
        login.showNotification = response.ShowNotification;

        localStorage.setItem('name', response.PersonName);
        localStorage.setItem('profilePic', response.PersonProfilePic);
        localStorage.setItem('userId', response.ID);
        localStorage.setItem('showNotification', response.ShowNotification);
        this.loading = false;
        //Salva o token no localStorage
        this.loginService.setLogin(response.Token)
        this.messageHandlerService.showMessage("Logado com sucesso!", 'success-snackbar')

        this.router.navigateByUrl('/home');
      },
      error => {
        console.log(error);
        this.errorHandler.handleError(error);
        this.userEmail = '';
        this.userPassword = '';
        this.loading = false;
      });
  }
}
