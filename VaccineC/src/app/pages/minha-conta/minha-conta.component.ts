import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UserModel } from 'src/app/models/user-model';
import { ErrorHandlerService } from 'src/app/services/error-handler.service';
import { MessageHandlerService } from 'src/app/services/message-handler.service';
import { PersonsAddressesDispatcherService } from 'src/app/services/person-address-dispatcher.service';
import { PersonsPhonesDispatcherService } from 'src/app/services/person-phone-dispatcher.service';
import { UsersService } from 'src/app/services/user-dispatcher.service';
import { ResetPasswordDialog } from '../gerenciar-usuarios/gerenciar-usuarios.component';

@Component({
  selector: 'app-minha-conta',
  templateUrl: './minha-conta.component.html',
  styleUrls: ['./minha-conta.component.scss']
})
export class MinhaContaComponent implements OnInit {

  public userId = "";
  public userPersonName = "";
  public userPersonNameComplete = "";
  public userFunction = "";
  public userEmail = "";
  public userPersonProfilePic = "";
  public userPersonAddress = "";
  public userPersonPhone = "";

  public imagePathUrl = 'http://localhost:5000/';
  public imagePathUrlDefault = "../../../assets/img/default-profile-pic.png";

  public dialogRef?: MatDialogRef<any>;

  constructor(
    public dialog: MatDialog,
    private usersService: UsersService,
    private personsAddressesService: PersonsAddressesDispatcherService,
    private personsPhonesService: PersonsPhonesDispatcherService
  ) { }

  ngOnInit(): void {
    this.treatContainer();
    this.userId = localStorage.getItem('userId')!;
    this.getUserById(this.userId);
  }

  getUserById(id: string): void {
    this.usersService.getById(id).subscribe(
      user => {
        this.getPrincipalPersonAddress(user.Person.ID);
        this.getPrincipalPersonPhone(user.Person.ID);

        let userPersonName = user.Person.Name;
        let userPersonNameArray = userPersonName.split(" ");

        if (userPersonNameArray.length == 1) {
          this.userPersonName = userPersonName;
        } else {
          this.userPersonName = userPersonNameArray[0] + " " + userPersonNameArray[userPersonNameArray.length - 1];
        }

        this.userPersonNameComplete = userPersonName;
        this.userEmail = user.Email;
        this.userFunction = user.Function;

        if (user.Function == "G") {
          this.userFunction = "Gerente"
        } else if (user.Function == "E") {
          this.userFunction = "Aplicador"
        } else {
          this.userFunction = "Administrador"
        }

        if (user.Person.ProfilePic == null) {
          this.userPersonProfilePic = `${this.imagePathUrlDefault}`;
        } else {
          this.userPersonProfilePic = `${this.imagePathUrl}${user.Person.ProfilePic}`;
        }
      },
      error => {
        console.log(error);
      });
  }

  getPrincipalPersonAddress(personId: string) {
    this.personsAddressesService.getPrincipalPersonAddressByPersonId(personId).subscribe(
      personAddress => {
        if (personAddress == null) {
          this.userPersonAddress = "Não informado";
        } else {
          this.userPersonAddress = `${personAddress.PublicPlace}, ${personAddress.AddressNumber} - ${personAddress.District} - ${personAddress.City}/${personAddress.State} - ${personAddress.Country}`
        }
      },
      error => {
        console.log(error);
      });
  }

  getPrincipalPersonPhone(personId: string) {
    this.personsPhonesService.getPrincipalPersonPhoneByPersonId(personId).subscribe(
      personPhone => {
        if (personPhone == null) {
          this.userPersonPhone = "Não informado";
        } else {
          this.userPersonPhone = `(${personPhone.CodeArea}) ${personPhone.NumberPhone}`
        }
      },
      error => {
        console.log(error);
      });
  }

  treatContainer(): void {
    if (document.getElementById('sidebarToggle')?.classList.contains('withdrawn')) {
      document.getElementById('center')?.classList.add('container-expand');
      document.getElementById('center')?.classList.remove('container-retract');
    } else {
      document.getElementById('center')?.classList.add('container-retract');
      document.getElementById('center')?.classList.remove('container-expanded');
    }
  }

  public openPasswordDialog(): void {
    this.dialogRef = this.dialog.open(PasswordDialog, {
      width: '50vw',
      data: {
        ID: this.userId,
      },
    });

    this.dialogRef.afterClosed().subscribe(
      (res) => {
        if (res != "") {

        }
      }
    );
  }
}


@Component({
  selector: 'password-dialog',
  templateUrl: 'password-dialog.html',
})
export class PasswordDialog implements OnInit {

  public UserId!: string;
  public Password!: string;
  public ConfirmPassword!: string;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private usersService: UsersService,
    private errorHandler: ErrorHandlerService,
    private messageHandler: MessageHandlerService,
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<ResetPasswordDialog>,

  ) { }

  //Form
  userPasswordForm: FormGroup = this.formBuilder.group({
    UserId: [null],
    Password: [null, [Validators.required, Validators.maxLength(255)]],
    ConfirmPassword: [null, [Validators.required, Validators.maxLength(255)]]
  });

  ngOnInit(): void {
    this.UserId = this.data.ID;
  }

  resetPassword(): void {

    if (!this.userPasswordForm.valid) {
      this.userPasswordForm.markAllAsTouched();
      this.messageHandler.showMessage("Campos obrigatórios não preenchidos, verifique!", "warning-snackbar");
      return;
    }

    let user = new UserModel();
    user.id = this.UserId;
    user.password = this.Password;

    if (this.Password != this.ConfirmPassword) {
      this.messageHandler.showMessage("As senhas não coincidem, verifique!", "warning-snackbar")
      return;
    }

    this.usersService.resetPassword(this.UserId, user)
      .subscribe(
        response => {
          this.dialogRef.close(response.Password)
          this.messageHandler.showMessage("Senha redefinida com sucesso!", "success-snackbar")
        },
        error => {
          this.errorHandler.handleError(error);
          console.log(error);
        });

  }
}