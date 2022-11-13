import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MessageHandlerService } from 'src/app/services/message-handler.service';
import { ErrorHandlerService } from 'src/app/services/error-handler.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ICompany } from 'src/app/interfaces/i-company';
import { MatTableDataSource } from '@angular/material/table';
import { CompaniesDispatcherService } from 'src/app/services/company-dispatcher.service';
import { CompanyModel } from 'src/app/models/company-model';
import { debounceTime, distinctUntilChanged, map, Observable, startWith, switchMap } from 'rxjs';
import { PersonAutocompleteService } from 'src/app/services/person-autocomplete.service';
import { CompaniesParametersDispatcherService } from 'src/app/services/company-parameter-dispatcher.service';
import { CompanyParameterModel } from 'src/app/models/company-parameter-model';
import { IResource } from 'src/app/interfaces/i-resource';
import { ICompanyParameter } from 'src/app/interfaces/i-company-parameter';
import { CompaniesSchedulesDispatcherService } from 'src/app/services/company-schedule-dispatcher.service';
import { CompanyScheduleModel } from 'src/app/models/company-schedule-model';
import { PaymentFormsDispatcherService } from 'src/app/services/payment-forms-dispatcher.service';
import { UsersService } from 'src/app/services/user-dispatcher.service';
import { Router } from '@angular/router';
import { ResourceModel } from 'src/app/models/resource-model';
import { UserResourceService } from 'src/app/services/user-resource.service';


@Component({
  selector: 'app-empresas',
  templateUrl: './empresas.component.html',
  styleUrls: ['./empresas.component.scss']
})
export class EmpresasComponent implements OnInit {

  //Aba de cadastro
  public options: string[] = [];
  public filteredOptions: Observable<any[]> | undefined;

  //Controle para o spinner do button
  public searchButtonLoading: boolean = false;
  public createButtonLoading: boolean = false;

  //Controle de exibição dos IDs na Table
  public show: boolean = true;

  //Controle de habilitação de campos
  public isInputDisabled = false;
  public isInputReadOnly = false;

  //Controle de tabs
  public tabIsDisabled: boolean = true;

  //Variáveis dos inputs
  public searchCompanyName!: string;
  public companyID!: string;
  public personId!: string;
  public details!: string;
  public register!: string;
  public informationField!: string;
  public paymentFormId!: string;

  //Table
  public value = '';
  public displayedColumns: string[] = ['Name', 'ID', 'Options'];
  public dataSource = new MatTableDataSource<ICompany>();

  //Table Schedulles
  public displayedColumns2: string[] = ['Day', 'StartTime', 'FinalTime', 'ID', 'Options'];
  public dataSource2 = new MatTableDataSource<ICompanyParameter>();

  //parametros das companhias
  public CompanyParameterID!: string;
  public ApplicationTimePerMinute!: string;
  public MaximumDaysBudgetValidity!: string;
  public scheduleColor: string = "#84d7b0";
  public CompanyIDParameter!: string;

  //Autocomplete Forma de Pagamento
  public acPaymentForm: string[] = [];
  public acPaymentForms: Observable<any[]> | undefined;

  @ViewChild('paginatorCompany') paginatorCompany!: MatPaginator;
  @ViewChild('paginatorSchedule') paginatorSchedule!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  public dialogRef?: MatDialogRef<any>;
  
  //Parameter form
  companyParametersForm: FormGroup = this.formBuilder.group({
    CompanyParameterID: [null],
    CompanyID: [null],
    ApplicationTimePerMinute: [null, [Validators.required]],
    MaximumDaysBudgetValidity: [null, [Validators.required]],
    PaymentFormId: new FormControl(null),
    ScheduleColor: [null]
  });

  //Company Form
  companyForm: FormGroup = this.formBuilder.group({
    CompanyID: [null],
    PersonId: new FormControl(null, Validators.required),
    Details: [null],
  });

  constructor(
    private companiesDispatcherService: CompaniesDispatcherService,
    private companiesParametersDispatcherService: CompaniesParametersDispatcherService,
    private companiesSchedulesDispatcherService: CompaniesSchedulesDispatcherService,
    private paymentFormsDispatcherService: PaymentFormsDispatcherService,
    private errorHandler: ErrorHandlerService,
    private messageHandler: MessageHandlerService,
    private formBuilder: FormBuilder,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private personAutocompleteService: PersonAutocompleteService,
    private usersService: UsersService,
    private usersResourcesService: UserResourceService,
	  private router: Router
    ) { }

  ngOnInit(): void {
    this.getUserPermision();
    this.updateUserResourceAccessNumber();
    this.getAllCompanies();
  }

  public getUserPermision() {

    let resource = new ResourceModel();
    resource.urlName = this.router.url;
    resource.name = this.router.url;

    this.usersService.userPermission(localStorage.getItem('userId')!, resource).subscribe(
      response => {
        if (!response) {
          this.router.navigateByUrl('/unauthorized-error-401');
        }
      },
      error => {
        console.log(error);
        this.errorHandler.handleError(error);
      });
  }

  public updateUserResourceAccessNumber() {
    let resource = new ResourceModel();
    resource.urlName = this.router.url;
    resource.name = this.router.url;

    this.usersResourcesService.updateUserResourceAccessNumber(localStorage.getItem('userId')!, resource).subscribe(
      response => {

      },
      error => {
        console.log(error);
        this.errorHandler.handleError(error);
      });

  }

  public loadCompanyData(): void {
    this.searchButtonLoading = true;

    if (this.searchCompanyName == "" || this.searchCompanyName == null || this.searchCompanyName == undefined) {
      this.getAllCompanies();
    } else {
      this.getCompaniesByName();
    }
  }

  public getAllCompanies(): void {
    this.companiesDispatcherService.getAllCompanies()
      .subscribe(
        companies => {
          this.dataSource = new MatTableDataSource(companies);
          this.dataSource.paginator = this.paginatorCompany;
          this.dataSource.sort = this.sort;
          this.searchButtonLoading = false;
        },
        error => {
          console.log(error);
          this.errorHandler.handleError(error);
          this.searchButtonLoading = false;
        });
  }

  public getCompaniesByName(): void {
    this.companiesDispatcherService.getCompanyByName(this.searchCompanyName).subscribe(
      companies => {
        this.dataSource = new MatTableDataSource(companies);
        this.dataSource.paginator = this.paginatorCompany;
        this.dataSource.sort = this.sort;
        this.searchButtonLoading = false;
      },
      error => {
        console.log(error);
        this.errorHandler.handleError(error);
        this.searchButtonLoading = false;
      });
  }

  public createUpdateCompany(): void {

    this.createButtonLoading = true;

    if (this.companyID == "" || this.companyID == null || this.companyID == undefined) {
      this.createCompany();
    } else {
      this.updateCompany();
    }
  }

  public createUpdateCompanyParameter(): void {

    if (this.CompanyParameterID == "" || this.CompanyParameterID == null || this.CompanyParameterID == undefined) {
      this.createCompanyParameter();
    } else {
      this.updateCompanyParameter();
    }
  }

  public createCompany(): void {

    if (!this.companyForm.valid) {
      console.log(this.companyForm);
      this.createButtonLoading = false;
      this.companyForm.markAllAsTouched();
      this.messageHandler.showMessage("Campos obrigatórios não preenchidos, verifique!", "warning-snackbar");
      return;
    }

    let company = new CompanyModel();
    company.personId = this.companyForm.value.PersonId.ID;
    company.details = this.details;

    this.companiesDispatcherService.createCompany(company)
      .subscribe(
        response => {
          this.companyID = response.ID;
          this.CompanyIDParameter = response.ID;
          this.details = response.Details;
          this.informationField = response.Person.Name;
          this.createButtonLoading = false;
          this.tabIsDisabled = false;
          this.isInputReadOnly = true;
          this.scheduleColor = "#84d7b0";
          this.getAllCompanies();

          this.messageHandler.showMessage("Empresa criada com sucesso!", "success-snackbar")
        },
        error => {
          console.log(error);
          this.errorHandler.handleError(error);
          this.createButtonLoading = false;
        });
  }

  public updateCompany(): void {

    let company = new CompanyModel();
    company.id = this.companyID;
    company.personId = this.companyForm.value.PersonId.ID;
    company.details = this.details;

    if (!this.companyForm.valid) {
      console.log(this.companyForm);
      this.createButtonLoading = false;
      this.companyForm.markAllAsTouched();
      this.messageHandler.showMessage("Campos obrigatórios não preenchidos, verifique!", "warning-snackbar");
      return;
    }

    this.companiesDispatcherService.updateCompany(this.companyID, company)
      .subscribe(
        response => {
          console.log(response)
          this.companyID = response.ID;
          this.CompanyIDParameter = response.ID;
          this.details = response.Details;
          this.informationField = response.Person.Name;

          this.createButtonLoading = false;
          this.getAllCompanies();
          this.messageHandler.showMessage("Empresa alterada com sucesso!", "success-snackbar")
        },
        error => {
          this.errorHandler.handleError(error);
          console.log(error);
          this.createButtonLoading = false;
        });
  }

  public deleteCompany(): void {
    const dialogRef = this.dialog.open(ConfirmCompanyRemoveDialog);

    dialogRef.afterClosed()
      .subscribe(result => {
        if (!!result) {
          this.companiesDispatcherService.deleteCompany(this.companyID)
            .subscribe(
              success => {
                this.companyForm.reset();
                this.companyForm.clearValidators();
                this.companyForm.updateValueAndValidity();
                this.personId = "";
                this.informationField = "";

                this.companyParametersForm.reset();
                this.companyParametersForm.clearValidators();
                this.companyParametersForm.updateValueAndValidity();
                this.isInputReadOnly = false;
                this.tabIsDisabled = true;
                this.getAllCompanies();
                this.messageHandler.showMessage("Empresa excluída com sucesso!", "success-snackbar")
              },
              error => {
                console.log(error);
                this.errorHandler.handleError(error);
              });
        }
      });
  }

  public createCompanyParameter(): void {

    if (!this.companyParametersForm.valid) {
      console.log(this.companyParametersForm);
      this.companyParametersForm.markAllAsTouched();
      this.messageHandler.showMessage("Campos obrigatórios não preenchidos, verifique!", "warning-snackbar");
      return;
    }

    let companyParameter = new CompanyParameterModel();
    companyParameter.companyId = this.companyID;
    companyParameter.applicationTimePerMinute = this.ApplicationTimePerMinute;
    companyParameter.scheduleColor = this.scheduleColor;
    companyParameter.maximumDaysBudgetValidity = this.MaximumDaysBudgetValidity;

    if(this.companyParametersForm.value.PaymentFormId == null || this.companyParametersForm.value.PaymentFormId == undefined || this.companyParametersForm.value.PaymentFormId == ""){
      companyParameter.defaultPaymentFormId = null;
    }else{
      companyParameter.defaultPaymentFormId = this.companyParametersForm.value.PaymentFormId.ID;
    }

    console.log(companyParameter)
  
    this.companiesParametersDispatcherService.createCompanyParameter(companyParameter)
      .subscribe(
        response => {
          this.CompanyParameterID = response.ID;
          this.CompanyIDParameter = response.CompanyId;
          this.ApplicationTimePerMinute = response.ApplicationTimePerMinute;
          this.MaximumDaysBudgetValidity = response.MaximumDaysBudgetValidity;
          this.scheduleColor = response.ScheduleColor;
          this.messageHandler.showMessage("Parâmetros criados com sucesso!", "success-snackbar")
        },
        error => {
          console.log(error);
          this.errorHandler.handleError(error);
        });

  }

  public updateCompanyParameter(): void {
    
    if (!this.companyParametersForm.valid) {
      console.log(this.companyParametersForm);
      this.companyParametersForm.markAllAsTouched();
      this.messageHandler.showMessage("Campos obrigatórios não preenchidos, verifique!", "warning-snackbar");
      return;
    }

    let companyParameter = new CompanyParameterModel();
    companyParameter.id = this.CompanyParameterID;
    companyParameter.companyId = this.companyID;
    companyParameter.applicationTimePerMinute = this.ApplicationTimePerMinute;
    companyParameter.maximumDaysBudgetValidity = this.MaximumDaysBudgetValidity;
    companyParameter.scheduleColor = this.scheduleColor;
    console.log(companyParameter)

    if(this.companyParametersForm.value.PaymentFormId == null || this.companyParametersForm.value.PaymentFormId == undefined || this.companyParametersForm.value.PaymentFormId == ""){
      companyParameter.defaultPaymentFormId = null;
    }else{
      companyParameter.defaultPaymentFormId = this.companyParametersForm.value.PaymentFormId.ID;
    }

    this.companiesParametersDispatcherService.updateCompanyParameter(this.CompanyParameterID, companyParameter)
      .subscribe(
        response => {
          console.log(response)
          this.messageHandler.showMessage("Parâmetros alterados com sucesso!", "success-snackbar")
        },
        error => {
          this.errorHandler.handleError(error);
          console.log(error);
          this.createButtonLoading = false;
        });
  }

  public editCompany(id: string): void {

    this.companyForm.reset();
    this.companyForm.clearValidators();
    this.companyForm.updateValueAndValidity();

    this.companyParametersForm.reset();
    this.companyParametersForm.clearValidators();
    this.companyParametersForm.updateValueAndValidity();

    this.companiesDispatcherService.getCompanyById(id)
      .subscribe(
        company => {
          this.companyID = company.ID;
          this.personId = company.Person;
          this.details = company.Details;
          this.informationField = company.Person.Name;
          this.tabIsDisabled = false;
          this.isInputReadOnly = true;
        },
        error => {
          console.log(error);
        });

    this.companiesDispatcherService.getCompaniesParametersByCompanyID(id)
      .subscribe(
        companyParameter => {
          
          if (companyParameter == null) {
            this.CompanyParameterID = "";
            this.ApplicationTimePerMinute = "";
            this.MaximumDaysBudgetValidity = "";
            this.scheduleColor = "#84d7b0";
            this.companyParametersForm.clearValidators();
            this.companyParametersForm.updateValueAndValidity();
          } else {
            console.log(companyParameter)
            this.CompanyParameterID = companyParameter.ID;
            this.scheduleColor = companyParameter.ScheduleColor;
            this.ApplicationTimePerMinute = companyParameter.ApplicationTimePerMinute;
            this.MaximumDaysBudgetValidity = companyParameter.MaximumDaysBudgetValidity;
            if(companyParameter.PaymentForm != null){
              this.paymentFormId = companyParameter.PaymentForm;
            }
          }

        },
        error => {
          console.log(error);
        });

    this.companiesSchedulesDispatcherService.getAllCompaniesSchedulesByCompanyId(id)
      .subscribe(
        result => {
          this.dataSource2 = new MatTableDataSource(result);
          this.dataSource2.paginator = this.paginatorSchedule;
          this.dataSource2.sort = this.sort;
        },
        error => {
          console.log(error);
        });

    this.CompanyIDParameter = id;

  }

  deleteCompanySchedule(id: string) {

    const dialogRef = this.dialog.open(ConfirmCompanyScheduleRemoveDialog);

    dialogRef.afterClosed().subscribe(result => {
      if (!!result) {
        this.companiesSchedulesDispatcherService.delete(id).subscribe(
          success => {
            this.dataSource2 = new MatTableDataSource(success);
            this.dataSource2.paginator = this.paginatorSchedule;
            this.dataSource2.sort = this.sort;
            this.messageHandler.showMessage("Horáro excluído com sucesso!", "success-snackbar")
          },
          error => {
            console.log(error);
            this.errorHandler.handleError(error);
          });
      }
    });

  }

  public addNewCompany(): void {
    this.companyForm.reset();
    this.companyForm.clearValidators();
    this.companyForm.updateValueAndValidity();
    this.personId = '';

    this.companyParametersForm.reset();
    this.companyParametersForm.clearValidators();
    this.companyParametersForm.updateValueAndValidity();

    this.scheduleColor = "#84d7b0";
    this.isInputReadOnly = false;
    this.tabIsDisabled = true;

    this.dataSource2 = new MatTableDataSource();
    this.dataSource2.paginator = this.paginatorSchedule;
    this.dataSource2.sort = this.sort;

    this.informationField = "";
  }

  public openScheduleDialog(): void {
    this.dialogRef = this.dialog.open(DialogContentScheduleDialog, {
      disableClose: true,
      width: '50vw',
      data: {
        ID: this.companyID
      },
    });

    this.dialogRef.afterClosed().subscribe(
      (res) => {
        if (res != "") {
          this.dataSource2 = new MatTableDataSource(res);
          this.dataSource2.paginator = this.paginatorSchedule;
          this.dataSource2.sort = this.sort;
        }
      }
    );
  }

  public openUpdateScheduleDialog(id: string): void {
    this.dialogRef = this.dialog.open(UpdateCompanyScheduleDialog, {
      disableClose: true,
      width: '50vw',
      data: {
        ID: id
      },
    });

    this.dialogRef.afterClosed().subscribe(
      (res) => {
        if (res != "") {
          this.dataSource2 = new MatTableDataSource(res);
          this.dataSource2.paginator = this.paginatorSchedule;
          this.dataSource2.sort = this.sort;
        }
      }
    );
  }

  public searchPersonByAutoComplete(): void {
    this.filteredOptions = this.companyForm.controls.PersonId.valueChanges.pipe(
      startWith(''),
      debounceTime(400),
      distinctUntilChanged(),
      switchMap(val => {
        return this.filter(val || '')
      })
    )
  }

  filter(val: string): Observable<any[]> {
    return this.personAutocompleteService.getPersonCompanyAutocomplete()
      .pipe(
        map(response => response.filter((option: { Name: string; ID: string }) => {
          return option.Name.toLowerCase().indexOf(val.toString().toLowerCase()) === 0
        }))
      )
  }

  displayState(state: any) {
    return state && state.Name ? state.Name : '';
  }

  public searchPaymentFormsByAutoComplete(): void {
    this.acPaymentForms = this.companyParametersForm.controls.PaymentFormId.valueChanges.pipe(
      startWith(''),
      debounceTime(400),
      distinctUntilChanged(),
      switchMap(val => {
        return this.filterPaymentForms(val || '')
      })
    )
  }

  public filterPaymentForms(val: string): Observable<any[]> {
    return this.paymentFormsDispatcherService.getAll()
      .pipe(
        map(response => response.filter((paymentForm: { Name: string; ID: string }) => {
          return paymentForm.Name.toLowerCase().indexOf(val.toString().toLowerCase()) === 0
        }))
      )
  }

  displayStatePaymentForm(state: any) {
    return state && state.Name ? state.Name : '';
  }

}

//DIALOG ADD SCHEDULE
@Component({
  selector: 'dialog-content-schedule-dialog',
  templateUrl: 'dialog-content-schedule-dialog.html',
})
export class DialogContentScheduleDialog implements OnInit {

  myControl = new FormControl();
  options: string[] = [];
  filteredOptions: Observable<any[]> | undefined;

  CompanyId!: string;
  Day!: string;
  StartTime!: string;
  FinalTime!: string;

  //Form
  CompanyScheduleForm: FormGroup = this.formBuilder.group({
    Day: [null, Validators.required],
    StartTime: [null, Validators.required],
    FinalTime: [null, Validators.required]
  });

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder: FormBuilder,
    private companiesSchedulesDispatcherService: CompaniesSchedulesDispatcherService,
    private messageHandler: MessageHandlerService,
    public dialogRef: MatDialogRef<DialogContentScheduleDialog>
  ) { }

  ngOnInit(): void {
    this.CompanyId = this.data.ID;
  }

  saveCompanySchedule(): void {

    if (!this.CompanyScheduleForm.valid) {
      console.log(this.CompanyScheduleForm);
      this.CompanyScheduleForm.markAllAsTouched();
      this.messageHandler.showMessage("Campos obrigatórios não preenchidos, verifique!", "warning-snackbar");
      return;
    }

    let diasDaSemana = this.Day;
    let horaInicial = this.StartTime;
    let horaFinal = this.FinalTime

    let lista = new Array<CompanyScheduleModel>();

    for (var i = 0; i < diasDaSemana.length; i++) {
      if (horaInicial != "" && horaFinal != "") {

        let companySchedule = new CompanyScheduleModel();
        companySchedule.day = diasDaSemana[i];
        companySchedule.startTime = horaInicial;
        companySchedule.finalTime = horaFinal;
        companySchedule.companyId = this.CompanyId;
        lista.push(companySchedule);
      }
    }

    this.companiesSchedulesDispatcherService.createOnDemand(lista).subscribe(
      response => {
        this.dialogRef.close(response);
        this.messageHandler.showMessage("Horário(s) incluído(s) com sucesso!", "success-snackbar")
      },
      error => {
        console.log(error);
      });
  }
}

//DIALOG UPDATE SCHEDULE
@Component({
  selector: 'update-company-schedule-dialog',
  templateUrl: 'update-company-schedule-dialog.html',
})
export class UpdateCompanyScheduleDialog implements OnInit {

  myControl = new FormControl();

  Id!: string;
  CompanyId!: string;
  Day!: string;
  StartTime!: string;
  FinalTime!: string;

  //Form
  CompanyScheduleForm: FormGroup = this.formBuilder.group({
    Id: [null],
    CompanyId: [null],
    Day: [null, Validators.required],
    StartTime: [null, Validators.required],
    FinalTime: [null, Validators.required]
  });

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder: FormBuilder,
    private companiesSchedulesDispatcherService: CompaniesSchedulesDispatcherService,
    private messageHandler: MessageHandlerService,
    public dialogRef: MatDialogRef<DialogContentScheduleDialog>
  ) { }

  ngOnInit(): void {
    this.Id = this.data.ID;
    this.getCompanyScheduleById(this.Id);
  }

  getCompanyScheduleById(id: string): void {
    this.companiesSchedulesDispatcherService.getCompanyScheduleById(id).subscribe(
      result => {
        this.Id = result.ID;
        this.CompanyId = result.CompanyId;
        this.Day = result.Day;
        this.StartTime = result.StartTime;
        this.FinalTime = result.FinalTime;
      },
      error => {
        console.log(error);
      });
  }

  updateCompanySchedule(): void {

    if (!this.CompanyScheduleForm.valid) {
      console.log(this.CompanyScheduleForm);
      this.CompanyScheduleForm.markAllAsTouched();
      this.messageHandler.showMessage("Campos obrigatórios não preenchidos, verifique!", "warning-snackbar");
      return;
    }

    let companySchedule = new CompanyScheduleModel();
    companySchedule.id = this.Id;
    companySchedule.companyId = this.CompanyId;
    companySchedule.day = this.Day;
    companySchedule.startTime = this.StartTime;
    companySchedule.finalTime = this.FinalTime
    console.log(this.Id)
    console.log(companySchedule)
    this.companiesSchedulesDispatcherService.update(this.Id, companySchedule)
      .subscribe(
        response => {
          this.dialogRef.close(response);
          this.messageHandler.showMessage("Horário alterado com sucesso!", "success-snackbar")
        },
        error => {
          console.log(error);
        });

  }
}

@Component({
  selector: 'confirm-company-remove-dialog',
  templateUrl: './confirm-company-remove-dialog.html',
})
export class ConfirmCompanyRemoveDialog { }

@Component({
  selector: 'confirm-company-schedule-remove-dialog',
  templateUrl: 'confirm-company-schedule-remove-dialog.html',
})
export class ConfirmCompanyScheduleRemoveDialog { }
