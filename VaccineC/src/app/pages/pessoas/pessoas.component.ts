import { CEPError, Endereco, NgxViacepService } from "@brunoc/ngx-viacep";
import { catchError, EMPTY } from 'rxjs';
import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { IPerson } from 'src/app/interfaces/i-person';
import { PersonModel } from 'src/app/models/person-model';
import { ErrorHandlerService } from 'src/app/services/error-handler.service';
import { MessageHandlerService } from 'src/app/services/message-handler.service';
import { PersonDispatcherService } from 'src/app/services/person-dispatcher.service';
import { IPersonPhone } from "src/app/interfaces/i-person-phone";
import { PersonsPhonesDispatcherService } from "src/app/services/person-phone-dispatcher.service";
import { IPersonAddress } from "src/app/interfaces/i-person-address";
import { PersonsAddressesDispatcherService } from "src/app/services/person-address-dispatcher.service";
import { PersonPhoneModel } from "src/app/models/person-phone-model";
import { PersonAddressModel } from "src/app/models/person-address-model";

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
  public informationField!: string;

  //Controle de exibição dos IDs na Table
  public show: boolean = true;

  //Controle de tabs
  public tabIsDisabled: boolean = true;

  //Table Search
  public value = '';
  public displayedColumns: string[] = ['Name', 'CommemorativeDate', 'PersonType', 'ID', 'Options'];
  public dataSource = new MatTableDataSource<IPerson>();

  //Table Phones
  public displayedColumnsPhone: string[] = ['PhoneType', 'NumberPhone', 'ID', 'Options'];
  public dataSourcePhone = new MatTableDataSource<IPersonPhone>();

  //Table Addresses
  public displayedColumnsAddress: string[] = ['AddressType', 'Address', 'ID', 'Options'];
  public dataSourceAddress = new MatTableDataSource<IPersonAddress>();

  public dialogRef?: MatDialogRef<any>;

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
    private messageHandler: MessageHandlerService,
    private personsPhonesDispatcherService: PersonsPhonesDispatcherService,
    private personsAddressesDispatcherService: PersonsAddressesDispatcherService
  ) { }

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
          this.informationField = person.Name;

          this.tabIsDisabled = false;
          //this.isInputReadOnly = true;
        },
        error => {
          console.log(error);
        });


    this.personsPhonesDispatcherService.getAllPersonsPhonesByPersonId(id)
      .subscribe(
        result => {
          this.dataSourcePhone = new MatTableDataSource(result);
          this.dataSourcePhone.paginator = this.paginator;
          this.dataSourcePhone.sort = this.sort;
        },
        error => {
          console.log(error);
        });

    this.personsAddressesDispatcherService.getAllPersonsAddressesByPersonId(id)
      .subscribe(
        result => {
          this.dataSourceAddress = new MatTableDataSource(result);
          this.dataSourceAddress.paginator = this.paginator;
          this.dataSourceAddress.sort = this.sort;
        },
        error => {
          console.log(error);
        });

  }

  public addNewPerson(): void {
    this.personForm.reset();
    this.personForm.clearValidators();
    this.personForm.updateValueAndValidity();
    this.informationField = "";

    //this.isInputReadOnly = false;
    this.tabIsDisabled = true;

    this.dataSourcePhone = new MatTableDataSource();
    this.dataSourcePhone.paginator = this.paginator;
    this.dataSourcePhone.sort = this.sort;

    this.dataSourceAddress = new MatTableDataSource();
    this.dataSourceAddress.paginator = this.paginator;
    this.dataSourceAddress.sort = this.sort;
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
          this.informationField = response.Name;

          this.createButtonLoading = false;
          // this.isResourceDisabled = false;
          // this.isInputDisabled = true;
          // this.isInputReadOnly = true;
          // this.isButtonDeleteResourceDisabled = false;
          // this.isButtonAddResourceHidden = false;

          this.getAllPersons();
          this.treatButtons(this.personType);

          this.messageHandler.showMessage("Pessoa criada com sucesso!", "success-snackbar")
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
          this.informationField = response.Name;

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
                this.informationField = "";
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

  public openUpdatePersonPhoneDialog(id: string): void {
    this.dialogRef = this.dialog.open(UpdatePersonPhoneDialog, {
      width: '50vw',
      data: {
        ID: id
      },
    });

    this.dialogRef.afterClosed().subscribe(
      (res) => {
        if (res != "") {
          this.dataSourcePhone = new MatTableDataSource(res);
          this.dataSourcePhone.paginator = this.paginator;
          this.dataSourcePhone.sort = this.sort;
        }
      }
    );
  }

  public openUpdatePersonAddressDialog(id: string): void {
    this.dialogRef = this.dialog.open(UpdatePersonAddressDialog, {
      width: '50vw',
      data: {
        ID: id
      },
    });

    this.dialogRef.afterClosed().subscribe(
      (res) => {
        if (res != "") {
          this.dataSourceAddress = new MatTableDataSource(res);
          this.dataSourceAddress.paginator = this.paginator;
          this.dataSourceAddress.sort = this.sort;
        }
      }
    );
  }

  deletePersonPhone(id: string) {

    const dialogRef = this.dialog.open(ConfirmPersonPhoneRemoveDialog);

    dialogRef.afterClosed().subscribe(result => {
      if (!!result) {
        this.personsPhonesDispatcherService.delete(id).subscribe(
          success => {
            this.dataSourcePhone = new MatTableDataSource(success);
            this.dataSourcePhone.paginator = this.paginator;
            this.dataSourcePhone.sort = this.sort;
            this.messageHandler.showMessage("Telefone removido com sucesso!", "success-snackbar")
          },
          error => {
            console.log(error);
            this.errorHandler.handleError(error);
          });
      }
    });

  }

  deleteAddressPhone(id: string) {

    const dialogRef = this.dialog.open(ConfirmAddressPhoneRemoveDialog);

    dialogRef.afterClosed().subscribe(result => {
      if (!!result) {
        this.personsAddressesDispatcherService.delete(id).subscribe(
          success => {
            this.dataSourceAddress = new MatTableDataSource(success);
            this.dataSourceAddress.paginator = this.paginator;
            this.dataSourceAddress.sort = this.sort;
            this.messageHandler.showMessage("Endereço removido com sucesso!", "success-snackbar")
          },
          error => {
            console.log(error);
            this.errorHandler.handleError(error);
          });
      }
    });

  }

  public resolveExibitionPhoneType(phoneType: string) {
    if (phoneType == "P") {
      return "Principal"
    } else if (phoneType == "C") {
      return "Celular"
    } else if (phoneType == "E") {
      return "Comercial"
    } else if (phoneType == "R") {
      return "Residencial"
    } else if (phoneType == "O") {
      return "Outro"
    } else {
      return ""
    }
  }

  public resolveExibitionAddressType(addressType: string) {
    if (addressType == "P") {
      return "Principal"
    } else if (addressType == "C") {
      return "Comercial"
    } else if (addressType == "R") {
      return "Residencial"
    } else if (addressType == "O") {
      return "Outro"
    } else {
      return ""
    }
  }

  public openAddPhoneDialog(): void {
    const dialogRef = this.dialog.open(DialogContentPhoneDialog, {
      data: {
        ID: this.personId
      },
    });

    dialogRef.afterClosed().subscribe(
      (res) => {
        if (res != "") {
          this.dataSourcePhone = new MatTableDataSource(res);
          this.dataSourcePhone.paginator = this.paginator;
          this.dataSourcePhone.sort = this.sort;
        }
      }
    );
  }

  public openAddressDialog(): void {
    const dialogRef = this.dialog.open(DialogContentAddressDialog, {
      data: {
        ID: this.personId
      },
    });

    dialogRef.afterClosed().subscribe(
      (res) => {
        if (res != "") {
          this.dataSourceAddress = new MatTableDataSource(res);
          this.dataSourceAddress.paginator = this.paginator;
          this.dataSourceAddress.sort = this.sort;
        }
      }
    );
  }
}


@Component({
  selector: 'dialog-content-phone-dialog',
  templateUrl: 'dialog-content-phone-dialog.html',
})
export class DialogContentPhoneDialog implements OnInit {

  id!: string;
  personId!: string;
  phoneType!: string;
  codeArea!: string;
  numberPhone!: string;

  //Form
  personPhoneForm: FormGroup = this.formBuilder.group({
    personId: [null],
    phoneType: [null, [Validators.required]],
    codeArea: [null, [Validators.required, Validators.minLength(2)]],
    numberPhone: [null, [Validators.required, Validators.minLength(8), Validators.maxLength(9)]],
  });

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<DialogContentPhoneDialog>,
    private messageHandler: MessageHandlerService,
    private personsPhonesDispatcherService: PersonsPhonesDispatcherService,
  ) { }

  ngOnInit(): void {
    this.personId = this.data.ID;
  }

  savePersonPhone(): void {
    if (!this.personPhoneForm.valid) {
      console.log(this.personPhoneForm);
      this.personPhoneForm.markAllAsTouched();
      this.messageHandler.showMessage("Campos obrigatórios não preenchidos, verifique!", "warning-snackbar")
      return;
    }

    let personPhone = new PersonPhoneModel();
    personPhone.personId = this.personId;
    personPhone.phoneType = this.phoneType;
    personPhone.codeArea = this.codeArea;
    personPhone.numberPhone = this.numberPhone;

    this.personsPhonesDispatcherService.create(personPhone).subscribe(
      response => {
        this.dialogRef.close(response);
        this.messageHandler.showMessage("Telefone inserido com sucesso!", "success-snackbar")
      },
      error => {
        console.log(error);
      });
  }

}

@Component({
  selector: 'update-person-phone-dialog',
  templateUrl: 'update-person-phone-dialog.html',
})
export class UpdatePersonPhoneDialog implements OnInit {

  id!: string;
  personId!: string;
  phoneType!: string;
  codeArea!: string;
  numberPhone!: string;

  //Form
  personPhoneForm: FormGroup = this.formBuilder.group({
    personId: [null],
    phoneType: [null, [Validators.required]],
    codeArea: [null, [Validators.required, Validators.minLength(2)]],
    numberPhone: [null, [Validators.required, Validators.minLength(8), Validators.maxLength(9)]],
  });

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<DialogContentPhoneDialog>,
    private messageHandler: MessageHandlerService,
    private personsPhonesDispatcherService: PersonsPhonesDispatcherService,
  ) { }

  ngOnInit(): void {
    this.id = this.data.ID;
    this.getPersonPhoneById(this.id);
  }

  getPersonPhoneById(id: string): void {
    this.personsPhonesDispatcherService.getPersonPhoneById(id).subscribe(
      result => {
        console.log(result)
        this.id = result.ID;
        this.personId = result.PersonId;
        this.phoneType = result.PhoneType;
        this.codeArea = result.CodeArea;
        this.numberPhone = result.NumberPhone;
      },
      error => {
        console.log(error);
      });
  }

  updatePersonPhone(): void {

    if (!this.personPhoneForm.valid) {
      console.log(this.personPhoneForm);
      this.personPhoneForm.markAllAsTouched();
      this.messageHandler.showMessage("Campos obrigatórios não preenchidos, verifique!", "warning-snackbar")
      return;
    }

    let personPhone = new PersonPhoneModel();
    personPhone.id = this.id;
    personPhone.personId = this.personId;
    personPhone.phoneType = this.phoneType;
    personPhone.codeArea = this.codeArea;
    personPhone.numberPhone = this.numberPhone;

    this.personsPhonesDispatcherService.update(this.id, personPhone).subscribe(
      response => {
        this.dialogRef.close(response);
        this.messageHandler.showMessage("Telefone alterado com sucesso!", "success-snackbar")
      },
      error => {
        console.log(error);
      });
  }

}

@Component({
  selector: 'update-person-address-dialog',
  templateUrl: 'update-person-address-dialog.html',
})
export class UpdatePersonAddressDialog implements OnInit {

  id!: string;
  PersonId!: string;
  AddressType!: string;
  AddressCode!: string;
  PublicPlace!: string;
  City!: string;
  State!: string;
  District!: string;
  AddressNumber!: string;
  Complement!: string;
  Country!: string;

  isPlaceDistrictReadonly = true;
  isCityStateReadonly = true;

  //Form
  personAddressForm: FormGroup = this.formBuilder.group({
    PersonId: [null],
    AddressType: [null, [Validators.required]],
    AddressCode: [null, [Validators.required, Validators.minLength(8), Validators.maxLength(8)]],    PublicPlace: [null, [Validators.required, Validators.maxLength(255)]],
    City: [null, [Validators.required, Validators.maxLength(255)]],
    State: [null, [Validators.required, Validators.maxLength(2)]],
    District: [null, [Validators.required, Validators.maxLength(255)]],
    AddressNumber: [null, [Validators.required, Validators.maxLength(10)]],
    Complement: [null, Validators.maxLength(255)],
    Country: [null, [Validators.required, Validators.maxLength(255)]],
  });

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<DialogContentPhoneDialog>,
    private messageHandler: MessageHandlerService,
    private personsAddressesDispatcherService: PersonsAddressesDispatcherService,
    private viacep: NgxViacepService
  ) { }

  ngOnInit(): void {
    this.id = this.data.ID;
    this.getPersonAddressById(this.id);
  }

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
        this.Country = "Brasil";

        if (address.logradouro == "") {
          this.isPlaceDistrictReadonly = false;
        } else {
          this.isPlaceDistrictReadonly = true;
        }

        this.isCityStateReadonly = true;
      });
  }

  getPersonAddressById(id: string): void {
    this.personsAddressesDispatcherService.getPersonAddressById(id).subscribe(
      result => {
        console.log(result)
        this.id = result.ID;
        this.PersonId = result.PersonId;
        this.AddressCode = result.AddressCode;
        this.AddressType = result.AddressType;
        this.PublicPlace = result.PublicPlace;
        this.District = result.District;
        this.AddressNumber = result.AddressNumber;
        this.Complement = result.Complement;
        this.City = result.City;
        this.State = result.State;
        this.Country = result.Country;
      },
      error => {
        console.log(error);
      });
  }

  updatePersonAddress(): void {

    if (!this.personAddressForm.valid) {
      console.log(this.personAddressForm);
      this.personAddressForm.markAllAsTouched();
      this.messageHandler.showMessage("Campos obrigatórios não preenchidos, verifique!", "warning-snackbar")
      return;
    }

    let personAddress = new PersonAddressModel();
    personAddress.id = this.id;
    personAddress.personId = this.PersonId;
    personAddress.addressCode = this.AddressCode;
    personAddress.addressType = this.AddressType;
    personAddress.publicPlace = this.PublicPlace;
    personAddress.district = this.District;
    personAddress.addressNumber = this.AddressNumber;
    personAddress.complement = this.Complement;
    personAddress.addressCode = this.AddressCode;
    personAddress.city = this.City;
    personAddress.state = this.State;
    personAddress.country = this.Country;

    this.personsAddressesDispatcherService.update(this.id, personAddress).subscribe(
      response => {
        this.dialogRef.close(response);
        this.messageHandler.showMessage("Endereço alterado com sucesso!", "success-snackbar")
      },
      error => {
        console.log(error);
      });
  }


}

@Component({
  selector: 'dialog-content-address-dialog',
  templateUrl: 'dialog-content-address-dialog.html',
})
export class DialogContentAddressDialog implements OnInit {
 
  PersonId!: string;
  AddressType!: string;
  AddressCode!: string;
  PublicPlace!: string;
  City!: string;
  State!: string;
  District!: string;
  AddressNumber!: string;
  Complement!: string;
  Country!: string;

  isPlaceDistrictReadonly = true;
  isCityStateReadonly = true;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private viacep: NgxViacepService,
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<DialogContentPhoneDialog>,
    private messageHandler: MessageHandlerService,
    private personsAddressesDispatcherService: PersonsAddressesDispatcherService,
  ) { }

  ngOnInit(): void {
    this.PersonId = this.data.ID;
  }

  //Form
  personAddressForm: FormGroup = this.formBuilder.group({
    AddressType: [null, [Validators.required]],
    AddressCode: [null, [Validators.required, Validators.minLength(8), Validators.maxLength(8)]],
    PublicPlace: [null, [Validators.required, Validators.maxLength(255)]],
    City: [null, [Validators.required, Validators.maxLength(255)]],
    State: [null, [Validators.required, Validators.maxLength(2)]],
    District: [null, [Validators.required, Validators.maxLength(255)]],
    AddressNumber: [null, [Validators.required, Validators.maxLength(10)]],
    Complement: [null, Validators.maxLength(255)],
    Country: [null, [Validators.required, Validators.maxLength(255)]],
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
        this.Country = "Brasil";

        if (address.logradouro == "") {
          this.isPlaceDistrictReadonly = false;
        } else {
          this.isPlaceDistrictReadonly = true;
        }

        this.isCityStateReadonly = true;
      });
  }

  savePersonPhone(): void {
    if (!this.personAddressForm.valid) {
      console.log(this.personAddressForm);
      this.personAddressForm.markAllAsTouched();
      this.messageHandler.showMessage("Campos obrigatórios não preenchidos, verifique!", "warning-snackbar")
      return;
    }

    let personAddress = new PersonAddressModel();
    personAddress.personId = this.PersonId;
    personAddress.addressCode = this.AddressCode;
    personAddress.addressType = this.AddressType;
    personAddress.publicPlace = this.PublicPlace;
    personAddress.district = this.District;
    personAddress.addressNumber = this.AddressNumber;
    personAddress.complement = this.Complement;
    personAddress.addressCode = this.AddressCode;
    personAddress.city = this.City;
    personAddress.state = this.State;
    personAddress.country = this.Country;

    this.personsAddressesDispatcherService.create(personAddress).subscribe(
      response => {
        this.dialogRef.close(response);
        this.messageHandler.showMessage("Endereço inserido com sucesso!", "success-snackbar")
      },
      error => {
        console.log(error);
      });
  }
}

@Component({
  selector: 'confirm-person-remove-dialog',
  templateUrl: './confirm-person-remove-dialog.html',
})
export class ConfirmPersonRemoveDialog { }

//MODAL CONFIRMAR REMOÇÃO DO USERPHONE
@Component({
  selector: 'confirm-person-phone-remove-dialog',
  templateUrl: 'confirm-person-phone-remove-dialog.html',
})
export class ConfirmPersonPhoneRemoveDialog { }

//MODAL CONFIRMAR REMOÇÃO DO USERADDRESS
@Component({
  selector: 'confirm-person-address-remove-dialog',
  templateUrl: 'confirm-person-address-remove-dialog.html',
})
export class ConfirmAddressPhoneRemoveDialog { }