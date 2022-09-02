import { CEPError, Endereco, NgxViacepService } from "@brunoc/ngx-viacep";
import { catchError, EMPTY } from 'rxjs';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { IPerson } from 'src/app/interfaces/i-person';
import { PersonModel } from 'src/app/models/person-model';
import { ErrorHandlerService } from 'src/app/services/error-handler.service';
import { MessageHandlerService } from 'src/app/services/message-handler.service';
import { PersonDispatcherService } from 'src/app/services/person-dispatcher.service';

@Component({
  selector: 'app-pessoas',
  templateUrl: './pessoas.component.html',
  styleUrls: ['./pessoas.component.scss']
})

export class PessoasComponent implements OnInit {

  //Controle para o spinner do button
  public searchButtonLoading: boolean = false;
  public createButtonLoading: boolean = false;

  //Variáveis dos inputs
  public searchPersonName!: string;
  public personId!: string;
  public name!: string;
  public email!: string;
  public document!: string;
  public commemorativeDate!: Date;
  public personType!: string;
  public details!: string;

  //Controle de exibição dos IDs na Table
  public show: boolean = true;

  //Controle de tabs
  public tabIsDisabled: boolean = true;

  //Table
  public value = '';
  public displayedColumns: string[] = ['Name', 'Email', 'PersonType', 'CommemorativeDate', 'ID', 'Options'];
  public dataSource = new MatTableDataSource<IPerson>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  //Form de pessoas
  public personForm: FormGroup = this.formBuilder.group({
    PersonId: [null],
    Name: [null, [Validators.required, Validators.maxLength(255)]],
    Email: [null],
    PersonType: [[Validators.required]],
    CommemorativeDate: [null],
    Details: [null],
  });

  constructor(
    private dialog: MatDialog,
    private formBuilder: FormBuilder,
    private personsDispatcherService: PersonDispatcherService,
    private errorHandler: ErrorHandlerService,
    private messageHandler: MessageHandlerService,) { }

  ngOnInit(): void {
    this.getAllPersons();
  }

  public loadPersonData(): void {
    this.searchButtonLoading = true;

    if (this.searchPersonName == "" || this.searchPersonName == null || this.searchPersonName == undefined) {
      this.getAllPersons();
    } else {
      this.getPersonsByName();
    }
  }

  public createUpdatePerson(): void {
    this.createButtonLoading = true;

    if (this.personId == "" || this.personId == null || this.personId == undefined) {
      this.createPerson();
    } else {
      this.updatePerson();
    }
  }

  getAddressViaCep(): void {

  }

  public getAllPersons(): void {
    this.personsDispatcherService.getAllPersons()
      .subscribe(persons => {
        this.dataSource = new MatTableDataSource(persons);
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

  public getPersonsByName(): void {
    this.personsDispatcherService.getPersonsByName(this.searchPersonName)
      .subscribe(
        persons => {
          this.dataSource = new MatTableDataSource(persons);
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

  public editPerson(id: string): void {
    this.personForm.reset();
    this.personForm.clearValidators();
    this.personForm.updateValueAndValidity();

    this.personsDispatcherService.getPersonById(id)
      .subscribe(
        person => {
          this.personId = person.ID;
          this.name = person.Name;
          this.personType = person.PersonType;
          this.email = person.Email;
          this.commemorativeDate = person.CommemorativeDate;
          this.details = person.Details;

          this.tabIsDisabled = false;
          //this.isInputReadOnly = true;
        },
        error => {
          console.log(error);
        });
  }

  public addNewPerson(): void {
    this.personForm.reset();
    this.personForm.clearValidators();
    this.personForm.updateValueAndValidity();

    //this.isInputReadOnly = false;
    this.tabIsDisabled = true;
  }

  public createPerson(): void {
    // if (!this.personForm.valid) {
    //   console.log(this.personForm);
    //   this.createButtonLoading = false;
    //   this.personForm.markAllAsTouched();
    //   this.messageHandler.showMessage("Campos obrigatórios não preenchidos, verifique!", "warning-snackbar")
    //   return;
    // }

    const data = this.personForm.value;
    data.HasPending = false;

    this.personsDispatcherService.createPerson(data)
      .subscribe(
        response => {
          this.personId = response.ID;
          this.name = response.Name;
          this.email = response.Email;
          this.personType = response.PersonType;
          this.commemorativeDate = response.CommemorativeDate;
          this.details = response.Details;

          this.createButtonLoading = false;
          // this.isResourceDisabled = false;
          // this.isInputDisabled = true;
          // this.isInputReadOnly = true;
          // this.isButtonDeleteResourceDisabled = false;
          // this.isButtonAddResourceHidden = false;

          this.getAllPersons();
          this.treatButtons(this.personType);

          this.messageHandler.showMessage("Usuário criado com sucesso!", "success-snackbar")
        },
        error => {
          console.log(error);
          this.errorHandler.handleError(error);
          this.createButtonLoading = false;
        });
  }

  public updatePerson(): void {

    let person = new PersonModel();
    person.id = this.personId;
    person.name = this.name;
    person.personType = this.personType;
    person.email = this.email;
    person.commemorativeDate = this.commemorativeDate;
    // person.situation = this.document;
    person.details = this.details;

    // if (!this.personForm.valid) {
    //   console.log(this.personForm);
    //   this.createButtonLoading = false;
    //   this.personForm.markAllAsTouched();
    //   this.messageHandler.showMessage("Campos obrigatórios não preenchidos, verifique!", "warning-snackbar")
    //   return;
    // }

    this.personsDispatcherService.updatePerson(this.personId, person)
      .subscribe(
        response => {
          this.personId = response.ID;
          this.name = response.Name;
          this.email = response.Email;
          this.personType = response.PersonType;
          this.commemorativeDate = response.CommemorativeDate;
          this.details = response.Details;

          this.createButtonLoading = false;

          this.getAllPersons();
          this.treatButtons(this.personType);

          this.messageHandler.showMessage("Pessoa alterada com sucesso!", "success-snackbar")
        },
        error => {
          this.errorHandler.handleError(error);
          console.log(error);
          this.createButtonLoading = false;
        });
  }

  public deletePerson(): void {
    const dialogRef = this.dialog.open(ConfirmPersonRemoveDialog);

    dialogRef.afterClosed()
      .subscribe(result => {
        if (!!result) {
          this.personsDispatcherService.deletePerson(this.personId)
            .subscribe(
              success => {
                this.personForm.reset();
                this.personForm.clearValidators();
                this.personForm.updateValueAndValidity();
                this.tabIsDisabled = true;
                this.getAllPersons();
                this.messageHandler.showMessage("Pessoa excluída com sucesso!", "success-snackbar")
              },
              error => {
                console.log(error);
                this.errorHandler.handleError(error);
              });
        }
      });
  }

  public treatButtons(personTypeSelected: string) {

    if (personTypeSelected == "F") {
      // this.isActivateButtonHidden = true;
      // this.isDeactivateButtonHidden = false;

      // this.isButtonDeleteResourceDisabled = false;
      // this.isButtonAddResourceHidden = false;

    } else if (personTypeSelected == "j") {
      // this.isActivateButtonHidden = false;
      // this.isDeactivateButtonHidden = true;

      // this.isButtonDeleteResourceDisabled = true;
      // this.isButtonAddResourceHidden = true;
    }

  }

  public openPhoneDialog(): void {
    const dialogRef = this.dialog.open(DialogContentPhoneDialog);

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

  public openAddressDialog(): void {
    const dialogRef = this.dialog.open(DialogContentAddressDialog);

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }
}


@Component({
  selector: 'dialog-content-phone-dialog',
  templateUrl: 'dialog-content-phone-dialog.html',
})
export class DialogContentPhoneDialog { }


@Component({
  selector: 'dialog-content-address-dialog',
  templateUrl: 'dialog-content-address-dialog.html',
})
export class DialogContentAddressDialog implements OnInit {

  constructor(
    private viacep: NgxViacepService,
    private formBuilder: FormBuilder
  ) { }

  AddressCode!: string;
  PublicPlace!: string;
  City!: string;
  State!: string;
  District!: string;

  isPlaceDistrictReadonly = false;
  isCityStateReadonly = false;

  ngOnInit(): void {
  }

  //Form
  personAddressForm: FormGroup = this.formBuilder.group({
    AddressCode: [null],
    PublicPlace: [null],
    City: [null],
    State: [null],
    District: [null]
  });

  onBlurMethod(): void {
    this.viacep
      .buscarPorCep(this.AddressCode)
      .pipe(
        catchError((error: CEPError) => {
          console.log(error.message);
          return EMPTY;
        })
      )
      .subscribe((address: Endereco) => {
        console.log(address);

        this.PublicPlace = address.logradouro;
        this.District = address.bairro;
        this.City = address.localidade;
        this.State = address.uf;

        if (address.logradouro == "") {
          this.isPlaceDistrictReadonly = false;
        } else {
          this.isPlaceDistrictReadonly = true;
        }

        this.isCityStateReadonly = true;
      });
  }
}

@Component({
  selector: 'confirm-person-remove-dialog',
  templateUrl: './confirm-person-remove-dialog.html',
})
export class ConfirmPersonRemoveDialog { }
