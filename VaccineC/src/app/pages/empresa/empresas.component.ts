import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
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


@Component({
  selector: 'app-empresas',
  templateUrl: './empresas.component.html',
  styleUrls: ['./empresas.component.scss']
})
export class EmpresasComponent implements OnInit {

  //Aba de cadastro
  public myControl = new FormControl();
  public options: string[] = [];
  public filteredOptions: Observable<any[]> | undefined;

  //Controle para o spinner do button
  public searchButtonLoading = false;
  public createButtonLoading = false;

  //Controle de exibição dos IDs na Table
  public show: boolean = true;

  //Variáveis dos inputs
  public searchCompanyName!: string;
  public companyID!: string;
  public personId!: string;
  public details!: string;
  public register!: string;

  //Table
  public value = '';
  public displayedColumns: string[] = ['CompanyName', 'CompanyID'];
  public dataSource = new MatTableDataSource<ICompany>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  //Form
  companyForm: FormGroup = this.formBuilder.group({
    CompanyID: [null],
    PersonId: [null, [Validators.required]],
  });

  constructor(private companiesDispatcherService: CompaniesDispatcherService,
    private errorHandler: ErrorHandlerService,
    private messageHandler: MessageHandlerService,
    private formBuilder: FormBuilder,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private personAutocompleteService: PersonAutocompleteService) { }

  ngOnInit(): void {
    this.getAllCompanies();
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
      .subscribe(companies => {
        this.dataSource = new MatTableDataSource(companies);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        console.log(companies);
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
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        console.log(companies);
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

  public createCompany(): void {
    if (!this.companyForm.valid) {
      console.log(this.companyForm);
      this.createButtonLoading = false;
      this.companyForm.markAllAsTouched();
      this.messageHandler.showMessage("Campos obrigatórios não preenchidos, verifique!", "warning-snackbar")
      return;
    }

    const data = this.companyForm.value;
    data.HasPending = false;
    console.log(data);

    this.companiesDispatcherService.createCompany(data)
      .subscribe(
        response => {
          this.companyID = response;
          this.createButtonLoading = false;
          this.getAllCompanies();
          this.messageHandler.showMessage("Recurso criado com sucesso!", "success-snackbar")
        },
        error => {
          console.log(error);
          this.errorHandler.handleError(error);
          this.createButtonLoading = false;
        });
  }

  public updateCompany(): void {

    let resource = new CompanyModel();
    resource.id = this.companyID;
    resource.personId = this.personId;
    resource.details = this.details;

    if (!this.companyForm.valid) {
      console.log(this.companyForm);
      this.createButtonLoading = false;
      this.companyForm.markAllAsTouched();
      this.messageHandler.showMessage("Campos obrigatórios não preenchidos, verifique!", "warning-snackbar")
      return;
    }

    this.companiesDispatcherService.updateCompany(this.companyID, resource)
      .subscribe(
        response => {
          console.log(response);
          this.companyID = response;
          this.createButtonLoading = false;
          this.getAllCompanies();
          this.messageHandler.showMessage("Recurso alterado com sucesso!", "success-snackbar")
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
                this.getAllCompanies();
                this.messageHandler.showMessage("Recurso removido com sucesso!", "success-snackbar")
              },
              error => {
                console.log(error);
                this.errorHandler.handleError(error);
              });
        }
      });
  }

  public editCompany(id: string): void {
    this.companiesDispatcherService.getCompanyById(id)
      .subscribe(
        company => {
          this.companyID = company.ID;
          console.log(company);
        },
        error => {
          console.log(error);
        });
  }

  public addNewCompany(): void {
    this.companyForm.reset();
    this.companyForm.clearValidators();
    this.companyForm.updateValueAndValidity();
  }

  public openScheduleDialog(): void {
    const dialogRef = this.dialog.open(DialogContentScheduleDialog);

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

  public searchPersonByAutoComplete(): void {
    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      debounceTime(400),
      distinctUntilChanged(),
      switchMap(val => {
        return this.filter(val || '')
      })
    )
  }

  public filter(val: string): Observable<any[]> {
    return this.personAutocompleteService.getPersonJuridicallData()
      .pipe(
        map(response => response.filter((option: { Name: string; ID: string }) => {
          return option.Name.toLowerCase()
        }))
      )
  }
}

@Component({
  selector: 'dialog-content-schedule-dialog',
  templateUrl: 'dialog-content-schedule-dialog.html',
})
export class DialogContentScheduleDialog { }

@Component({
  selector: 'confirm-company-remove-dialog',
  templateUrl: './confirm-company-remove-dialog.html',
})
export class ConfirmCompanyRemoveDialog { }
