import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { IUser } from 'src/app/interfaces/i-user';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { UsersService } from 'src/app/services/user-dispatcher.service';
import { ErrorHandlerService } from 'src/app/services/error-handler.service';
import { MessageHandlerService } from 'src/app/services/message-handler.service';
import { IResource } from 'src/app/interfaces/i-resource';
import { startWith, debounceTime, distinctUntilChanged, switchMap, map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { PersonAutocompleteService } from 'src/app/services/person-autocomplete.service';
import { ResourceAutocompleteService } from 'src/app/services/resource-autocomplete.service';
import { UserModel } from 'src/app/models/user-model';
import { ResourcesService } from 'src/app/services/resources.service';
import { UserResourceService } from 'src/app/services/user-resource.service';
import { UserResourceModel } from 'src/app/models/user-resource-model';

@Component({
  selector: 'app-gerenciar-usuarios',
  templateUrl: './gerenciar-usuarios.component.html',
  styleUrls: ['./gerenciar-usuarios.component.scss']
})
export class GerenciarUsuariosComponent implements OnInit {

  //Controle de exibição dos botões
  isActivateButtonHidden = true;
  isDeactivateButtonHidden = true;
  isResetPasswordButtonHidden = true;
  isButtonDeleteResourceDisabled = false;
  isButtonAddResourceHidden = false;

  //Controle de habilitação de campos
  isInputDisabled = false;
  isInputReadOnly = false;

  //Controle de tabs
  isResourceDisabled = true;

  //Controle para o spinner do button
  searchButtonLoading = false;
  createButtonLoading = false;
  activateUserButtonLoading = false;
  deactivateUserButtonLoading = false;

  //Controle de exibição dos IDs na Table
  show: boolean = true;

  //Variáveis dos inputs
  public searchEmailUser!: string;
  public UserId!: string;
  public Email!: string;
  public Situation!: string;
  public Password!: string;
  public ConfirmPassword!: string;
  public FunctionUser!: string;
  public PersonId!: string;

  //Autocomplete
  myControl = new FormControl();
  options: string[] = [];
  filteredOptions: Observable<any[]> | undefined;

  //Table Usuários
  public value = '';
  public displayedColumns: string[] = ['Email', 'Name', 'Situation', 'ID', 'Options'];
  public dataSource = new MatTableDataSource<IUser>();

  //Table Recursos
  public displayedColumns2: string[] = ['Name', 'ID', 'Options'];
  public dataSource2 = new MatTableDataSource<IResource>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  public dialogRef?: MatDialogRef<any>;

  //Form
  userForm: FormGroup = this.formBuilder.group({
    UserId: [null],
    PersonId: [null, [Validators.required]],
    Email: [null, [Validators.required, Validators.email]],
    Password: [null, [Validators.required, Validators.maxLength(255)]],
    ConfirmPassword: [null, [Validators.required, Validators.maxLength(255)]],
    FunctionUser: [null, [Validators.required]],
    Situation: [null, [Validators.required]]
  });

  constructor(
    private errorHandler: ErrorHandlerService,
    private messageHandler: MessageHandlerService,
    private formBuilder: FormBuilder,
    private dialog: MatDialog,
    private personAutocompleteService: PersonAutocompleteService,
    private usersService: UsersService,
    private resourcesService: ResourcesService,
    private userResourceService: UserResourceService
  ) { }

  ngOnInit(): void {
  }

  loadUserData() {

    this.searchButtonLoading = true;

    if (this.searchEmailUser == "" || this.searchEmailUser == null || this.searchEmailUser == undefined) {
      this.getAllUsers();
    } else {
      this.getUsersByEmail();
    }

  }

  getAllUsers(): void {

    this.usersService.getAll().subscribe(
      users => {
        this.dataSource = new MatTableDataSource(users);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.searchButtonLoading = false;
      },
      error => {
        console.log(error);
        this.errorHandler.handleError(error);
        this.searchButtonLoading = false;
      });

  }

  getUsersByEmail(): void {
    this.usersService.getByName(this.searchEmailUser).subscribe(
      users => {
        this.dataSource = new MatTableDataSource(users);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.searchButtonLoading = false;
      },
      error => {
        console.log(error);
        this.errorHandler.handleError(error);
        this.searchButtonLoading = false;
      });
  }

  createUpdateUser(): void {

    this.createButtonLoading = true;

    if (this.UserId == "" || this.UserId == null || this.UserId == undefined) {
      this.createUser();
    } else {
      this.updateUser();
    }
  }

  createUser(): void {

    if (!this.userForm.valid) {
      console.log(this.userForm);
      this.createButtonLoading = false;
      this.userForm.markAllAsTouched();
      this.messageHandler.showMessage("Campos obrigatórios não preenchidos, verifique!", "warning-snackbar")
      return;
    }

    if (this.Password != this.ConfirmPassword) {
      this.createButtonLoading = false;
      this.messageHandler.showMessage("As senhas não coincidem, verifique!", "warning-snackbar")
      return;
    }

    const data = this.userForm.value;
    data.HasPending = false;

    this.usersService.create(data)
      .subscribe(
        response => {
          this.UserId = response.ID;
          this.Email = response.Email;
          this.FunctionUser = response.FunctionUser;
          this.Password = response.Password;
          this.ConfirmPassword = response.Password;
          this.Situation = response.Situation;

          this.createButtonLoading = false;
          this.isResourceDisabled = false;

          this.isInputDisabled = true;
          this.isInputReadOnly = true;

          this.isButtonDeleteResourceDisabled = false;
          this.isButtonAddResourceHidden = false;

          this.getAllUsers();
          this.treatButtons(this.Situation);

          this.messageHandler.showMessage("Usuário criado com sucesso!", "success-snackbar")
        },
        error => {
          console.log(error);
          this.errorHandler.handleError(error);
          this.createButtonLoading = false;
        });
  }

  updateUser(): void {

    let user = new UserModel();
    user.id = this.UserId;
    user.personId = this.PersonId;
    user.email = this.Email;
    user.password = this.Password;
    user.situation = this.Situation;
    user.functionUser = this.FunctionUser;

    if (!this.userForm.valid) {
      console.log(this.userForm);
      this.createButtonLoading = false;
      this.userForm.markAllAsTouched();
      this.messageHandler.showMessage("Campos obrigatórios não preenchidos, verifique!", "warning-snackbar")
      return;
    }

    this.usersService.update(this.UserId, user)
      .subscribe(
        response => {

          this.UserId = response.ID;
          this.Email = response.Email;
          this.FunctionUser = response.FunctionUser;
          this.Password = response.Password;
          this.ConfirmPassword = response.Password;
          this.Situation = response.Situation;

          this.createButtonLoading = false;

          this.getAllUsers();
          this.treatButtons(this.Situation);

          this.messageHandler.showMessage("Usuário alterado com sucesso!", "success-snackbar")
        },
        error => {
          this.errorHandler.handleError(error);
          console.log(error);
          this.createButtonLoading = false;
        });
  }

  activateUserSituation(): void {

    this.activateUserButtonLoading = true;

    this.usersService.activateSituation(this.UserId)
      .subscribe(
        response => {
          this.UserId = response.ID;
          this.Email = response.Email;
          this.FunctionUser = response.FunctionUser;
          this.Password = response.Password;
          this.ConfirmPassword = response.Password;
          this.Situation = response.Situation;

          this.activateUserButtonLoading = false;

          this.getAllUsers();
          this.treatButtons(this.Situation);

          this.messageHandler.showMessage("Usuário ativado com sucesso!", "success-snackbar")
        },
        error => {
          this.errorHandler.handleError(error);
          console.log(error);
          this.activateUserButtonLoading = false;
        });
  }

  deactivateUserSituation(): void {

    this.deactivateUserButtonLoading = true;

    this.usersService.deactivateSituation(this.UserId)
      .subscribe(
        response => {
          this.UserId = response.ID;
          this.Email = response.Email;
          this.FunctionUser = response.FunctionUser;
          this.Password = response.Password;
          this.ConfirmPassword = response.Password;
          this.Situation = response.Situation;

          this.deactivateUserButtonLoading = false;

          this.getAllUsers();
          this.treatButtons(this.Situation);

          this.messageHandler.showMessage("Usuário desativado com sucesso!", "success-snackbar")
        },
        error => {
          this.errorHandler.handleError(error);
          console.log(error);
          this.deactivateUserButtonLoading = false;
        });
  }

  addNewUser(): void {

    this.userForm.reset();
    this.userForm.clearValidators();
    this.userForm.updateValueAndValidity();

    this.isResourceDisabled = true;
    this.isActivateButtonHidden = true;
    this.isDeactivateButtonHidden = true;
    this.isResetPasswordButtonHidden = true;

    this.isInputDisabled = false;
    this.isInputReadOnly = false;

  }

  editUser(id: string): void {
    this.usersService.getById(id).subscribe(
      user => {

        this.UserId = user.ID;
        this.PersonId = user.PersonId;
        this.Email = user.Email;
        this.FunctionUser = user.FunctionUser;
        this.Situation = user.Situation;
        this.Password = user.Password;
        this.ConfirmPassword = user.Password;

        this.isResourceDisabled = false;

        this.isInputDisabled = true;
        this.isInputReadOnly = true;

        this.treatButtons(this.Situation);
      },
      error => {
        console.log(error);
      });

    this.resourcesService.getByUser(id).subscribe(
      resources => {
        this.dataSource2 = new MatTableDataSource(resources);
        this.dataSource2.paginator = this.paginator;
        this.dataSource2.sort = this.sort;
      },
      error => {
        console.log(error);
      });

  }

  searchPersonByAutoComplete() {
    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      debounceTime(400),
      distinctUntilChanged(),
      switchMap(val => {
        return this.filter(val || '')
      })
    )
  }

  filter(val: string): Observable<any[]> {
    return this.personAutocompleteService.getPersonPhysicalData()
      .pipe(
        map(response => response.filter((option: { Name: string; ID: string }) => {
          return option.Name.toLowerCase().indexOf(val.toLowerCase()) === 0
        }))
      )
  }

  treatButtons(situation: string) {

    if (situation == "A") {
      this.isActivateButtonHidden = true;
      this.isDeactivateButtonHidden = false;
      this.isResetPasswordButtonHidden = false;

      this.isButtonDeleteResourceDisabled = false;
      this.isButtonAddResourceHidden = false;

    } else if (situation == "I") {
      this.isActivateButtonHidden = false;
      this.isDeactivateButtonHidden = true;
      this.isResetPasswordButtonHidden = true;

      this.isButtonDeleteResourceDisabled = true;
      this.isButtonAddResourceHidden = true;
    }

  }

  findUserResourceToDelete(resourceId: string): void {

    let userResource = new UserResourceModel();
    userResource.resourcesId = resourceId;
    userResource.usersId = this.UserId;

    this.userResourceService.getByUserResource(userResource).subscribe(
      response => {
        this.deleteUserResource(response.ID);
      },
      error => {
        console.log(error);
      });

  }

  deleteUserResource(userResourceId: string) {

    const dialogRef = this.dialog.open(ConfirmUserResourceRemoveDialog);

    dialogRef.afterClosed().subscribe(result => {
      if (!!result) {
        this.userResourceService.delete(userResourceId).subscribe(
          success => {
            this.dataSource2 = new MatTableDataSource(success);
            this.dataSource2.paginator = this.paginator;
            this.dataSource2.sort = this.sort;
            this.messageHandler.showMessage("Recurso removido com sucesso!", "success-snackbar")
          },
          error => {
            console.log(error);
            this.errorHandler.handleError(error);
          });
      }
    });

  }

  public openAddScreensDialog(): void {
    this.dialogRef = this.dialog.open(UserResourceAddDialog, {
      width: '50vw',
      data: {
        ID: this.UserId,
      },
    });

    this.dialogRef.afterClosed().subscribe(
      (res) => {
        if (res != "") {
          this.dataSource2 = new MatTableDataSource(res);
          this.dataSource2.paginator = this.paginator;
          this.dataSource2.sort = this.sort;
        }
      }
    );
  }

  public openResetPasswordDialog(): void {
    this.dialogRef = this.dialog.open(ResetPasswordDialog, {
      width: '50vw',
      data: {
        ID: this.UserId,
      },
    });

    this.dialogRef.afterClosed().subscribe(
      (res) => {
        if (res != "") {
          this.Password = res;
          this.ConfirmPassword = res;
        }
      }
    );
  }

}

//MODAL NOVO RECURSO
@Component({
  selector: 'user-resource-add-dialog',
  templateUrl: 'user-resource-add-dialog.html',
})

export class UserResourceAddDialog implements OnInit {

  myControl = new FormControl();
  options: string[] = [];
  filteredOptions: Observable<any[]> | undefined;

  ResourcesId!: string;
  UsersId!: string;

  //Form
  userResourceForm: FormGroup = this.formBuilder.group({
    UsersId: [null],
    ResourcesId: [null, [Validators.required]],
  });

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private resourceAutocompleteService: ResourceAutocompleteService,
    private formBuilder: FormBuilder,
    private messageHandler: MessageHandlerService,
    private userResourceService: UserResourceService,
    private errorHandler: ErrorHandlerService,
    public dialogRef: MatDialogRef<UserResourceAddDialog>
  ) { }

  ngOnInit(): void {
    this.UsersId = this.data.ID;
  }

  saveUserResource(): void {

    if (!this.userResourceForm.valid) {
      console.log(this.userResourceForm);
      this.userResourceForm.markAllAsTouched();
      this.messageHandler.showMessage("Campos obrigatórios não preenchidos, verifique!", "warning-snackbar")
      return;
    }

    const data = this.userResourceForm.value;
    data.HasPending = false;

    this.userResourceService.create(data)
      .subscribe(
        response => {
          this.dialogRef.close(response);
          this.messageHandler.showMessage("Recurso inserido com sucesso!", "success-snackbar");
        },
        error => {
          console.log(error);
          this.errorHandler.handleError(error);
        });
  }

  searchResourceByAutoComplete() {
    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      debounceTime(400),
      distinctUntilChanged(),
      switchMap(val => {
        return this.filter(val || '')
      })
    )
  }

  filter(val: string): Observable<any[]> {
    // call the service which makes the http-request
    return this.resourceAutocompleteService.getResourceData()
      .pipe(
        map(response => response.filter((option: { Name: string; ID: string }) => {
          return option.Name.toLowerCase().indexOf(val.toLowerCase()) === 0
        }))
      )
  }
}

//MODAL ALTERAR SENHA
@Component({
  selector: 'reset-password-dialog',
  templateUrl: 'reset-password-dialog.html',
})

export class ResetPasswordDialog implements OnInit {

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

//MODAL CONFIRMAR REMOÇÃO DO USERRESOURCE
@Component({
  selector: 'confirm-user-resource-remove-dialog',
  templateUrl: 'confirm-user-resource-remove-dialog.html',
})
export class ConfirmUserResourceRemoveDialog { }
