import { Component, Injectable, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { IUser } from 'src/app/interfaces/i-user';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { UsersService } from 'src/app/services/user-dispatcher.service';
import { ErrorHandlerService } from 'src/app/services/error-handler.service';
import { MessageHandlerService } from 'src/app/services/message-handler.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { IResource } from 'src/app/interfaces/i-resource';
import { HttpClient } from '@angular/common/http';
import { tap, startWith, debounceTime, distinctUntilChanged, switchMap, map } from 'rxjs/operators';
import { Observable, of, Subscription } from 'rxjs';

@Component({
  selector: 'app-gerenciar-usuarios',
  templateUrl: './gerenciar-usuarios.component.html',
  styleUrls: ['./gerenciar-usuarios.component.scss']
})
export class GerenciarUsuariosComponent implements OnInit {

  //Controle para o spinner do button
  searchButtonLoading = false;
  createButtonLoading = false;

  //Controle de exibição dos IDs na Table
  show: boolean = true;

  //Variáveis dos inputs
  public searchEmailUser!: string;
  public IdUser!: string;
  public Email!: string;
  public Password!: string;
  public ConfirmPassword!: string;

  //Table Usuários
  public value = '';
  public displayedColumns: string[] = ['Email', 'Situation', 'ID', 'Options'];
  public dataSource = new MatTableDataSource<IUser>();

  //Table Recursos
  public displayedColumns2: string[] = ['Name', 'ID', 'Options'];
  public dataSource2 = new MatTableDataSource<IResource>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  //Autocomplete
  myControl = new FormControl('');
  options: string[] = ['AMANDA MASCHIO', 'GUILHERME SCARIOT VARGAS', 'JOÃO SILVA'];
  filteredOptions: Observable<string[]> | undefined;

  public dialogRef?: MatDialogRef<any>;

  //Form
  userForm: FormGroup = this.formBuilder.group({
    IdUser: [null],
    IdPerson: [null, [Validators.required]],
    Email: [null, [Validators.required, Validators.email]],
    Password: [null, [Validators.required, Validators.maxLength(255)]],
    ConfirmPassword: [null, [Validators.required, Validators.maxLength(255)]],
    Function: [null, [Validators.required]],
    Situation: [null, [Validators.required]]
  });

  constructor(
    private usersService: UsersService,
    private errorHandler: ErrorHandlerService,
    private messageHandler: MessageHandlerService,
    private formBuilder: FormBuilder,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
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
        console.log(users);
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
        console.log(users);
        this.searchButtonLoading = false;
      },
      error => {
        console.log(error);
        this.errorHandler.handleError(error);
        this.searchButtonLoading = false;
      });
  }

  addNewUser(): void {
    this.userForm.reset();
    this.userForm.clearValidators();
    this.userForm.updateValueAndValidity();
  }

  editUser(id: string): void {

  }

  public openAddScreensDialog(): void {
    this.dialogRef = this.dialog.open(ScreensDialog, { width: '40vw' });

    this.dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }
}

@Injectable({
  providedIn: 'root'
})
export class Service {
  
  constructor(private http: HttpClient) { }
  opts = [];

  getData() {
    return this.opts.length ?
      of(this.opts) :
      this.http.get<any>('http://localhost:5000/api/Resources').pipe(tap(data => this.opts = data))
  }
}

@Component({
  selector: 'screens-dialog',
  templateUrl: 'screens-dialog.html',
})

export class ScreensDialog implements OnInit {

  myControl = new FormControl();
  options: string[] = [];
  filteredOptions: Observable<any[]> | undefined;

  constructor(
    private service: Service
  ) { }

  ngOnInit(): void {
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
    return this.service.getData()
      .pipe(
        map(response => response.filter((option: { Name: string; }) => {
          return option.Name.toLowerCase().indexOf(val.toLowerCase()) === 0
        }))
      )
  }
}