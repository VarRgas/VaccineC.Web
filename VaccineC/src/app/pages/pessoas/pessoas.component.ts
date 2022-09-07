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
import { PersonsPhysicalsDispatcherService } from "src/app/services/person-physical-dispatcher.service";
import { PersonsJuridicalsDispatcherService } from "src/app/services/person-juridical-dispatcher.service";
import { PersonPhysicalModel } from "src/app/models/person-physical-model";
import { PersonJuridicalModel } from "src/app/models/person-juridical-model";
import { cpf, cnpj } from 'cpf-cnpj-validator';

@Component({
  selector: 'app-pessoas',
  templateUrl: './pessoas.component.html',
  styleUrls: ['./pessoas.component.scss']
})

export class PessoasComponent implements OnInit {

  public imagePathUrl = 'http://localhost:5000/';
  public imagePathUrlDefault = "../../../assets/img/default-profile-pic.png";

  //Controle para o spinner do button
  public searchButtonLoading: boolean = false;
  public createButtonLoading: boolean = false;
  public createPfButtonLoading: boolean = false;
  public createPjButtonLoading: boolean = false;
  public showSavePhysicalComplementsButton: boolean = false;
  public showSaveJuridicalComplementsButton: boolean = false;

  //Variáveis dos inputs
  public searchPersonName!: string;
  public personId!: string;
  public name!: string;
  public fantasyName!: string;
  public email!: string;
  public profilePic!: string;
  public profilePicExhibition!: string;
  public document!: string;
  public personType!: string;
  public details!: string;
  public informationField!: string;

  //Complementos
  public personPhysicalId!: string;
  public personJuridicalId!: string;
  public cpfNumber!: string;
  public cnpjNumber!: string;
  public cnsNumber!: string;
  public maritalStatus!: string;
  public gender!: string;
  public deathDate!: Date;
  public CommemorativeDate!: Date;

  //Controle de exibição dos IDs na Table
  public show: boolean = true;

  //Controle de tabs
  public tabIsDisabled: boolean = true;
  public inputIsDisabled: boolean = false;
  public showPhysicalRegister: boolean = false;
  public showJuridicalRegister: boolean = false;

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
  public response?: { dbPath: '' };

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  //Form de pessoas
  public personForm: FormGroup = this.formBuilder.group({
    PersonId: [null],
    Name: [null, [Validators.required, Validators.maxLength(255)]],
    Email: [null, [Validators.email]],
    PersonType: [[Validators.required]],
    CommemorativeDate: [null],
    Details: [null],
  });

  public physicalComplementForm: FormGroup = this.formBuilder.group({
    PersonPhysicalId: [null],
    PersonId: [null, [Validators.required]],
    CpfNumber: [null, Validators.minLength(11)],
    CnsNumber: [null, Validators.minLength(15)],
    MaritalStatus: [null, [Validators.required]],
    Gender: [null, [Validators.required]],
    DeathDate: [null],
  });

  public juridicalComplementForm: FormGroup = this.formBuilder.group({
    PersonId: [null],
    FantasyName: [null],
    CnpjNumber: [null],
  });

  constructor(
    private dialog: MatDialog,
    private formBuilder: FormBuilder,
    private personsDispatcherService: PersonDispatcherService,
    private errorHandler: ErrorHandlerService,
    private messageHandler: MessageHandlerService,
    private personsPhonesDispatcherService: PersonsPhonesDispatcherService,
    private personsAddressesDispatcherService: PersonsAddressesDispatcherService,
    private personsJuridicalsDispatcherService: PersonsJuridicalsDispatcherService,
    private personsPhysicalsDispatcherService: PersonsPhysicalsDispatcherService,
  ) { }

  ngOnInit(): void {
    //this.getAllPersons();
  }

  public uploadFinished = (event: any) => {
    this.profilePicExhibition = `${this.imagePathUrl}${event.dbPath}`
    this.profilePic = event.dbPath;
  }

  public createImgPath = (serverPath: any) => {
    return `${this.imagePathUrl}${serverPath}`
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

  public createUpdatePhysicalComplements(): void {
    this.createPfButtonLoading = true;

    if (this.personPhysicalId == "" || this.personPhysicalId == null || this.personPhysicalId == undefined) {
      this.createPhysicalComplement();
    } else {
      this.updatePhysicalComplement();
    }
  }

  public createUpdateJuridicalComplements(): void {
    this.createPjButtonLoading = true;

    if (this.personJuridicalId == "" || this.personJuridicalId == null || this.personJuridicalId == undefined) {
      this.createJuridicalComplement();
    } else {
      this.updateJuridicalComplement();
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
    this.resetForms();

    this.personsDispatcherService.getPersonById(id)
      .subscribe(
        person => {
          this.personId = person.ID;
          this.name = person.Name;
          this.personType = person.PersonType;
          this.email = person.Email;
          this.CommemorativeDate = person.CommemorativeDate;
          this.details = person.Details;
          this.informationField = person.Name;
          this.profilePic = person.ProfilePic;
          this.treatProfilePicExhibition(person.ProfilePic);

          this.tabIsDisabled = false;

          this.treatButtons(this.personType, this.personId);
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

    this.resetForms();
    this.informationField = "";

    this.inputIsDisabled = false;
    this.tabIsDisabled = true;

    this.profilePicExhibition = `${this.imagePathUrlDefault}`;
    this.profilePic = '';

    this.dataSourcePhone = new MatTableDataSource();
    this.dataSourcePhone.paginator = this.paginator;
    this.dataSourcePhone.sort = this.sort;

    this.dataSourceAddress = new MatTableDataSource();
    this.dataSourceAddress.paginator = this.paginator;
    this.dataSourceAddress.sort = this.sort;
  }

  public createPerson(): void {

    if (!this.personForm.valid) {
      console.log(this.personForm);
      this.createButtonLoading = false;
      this.personForm.markAllAsTouched();
      this.messageHandler.showMessage("Campos obrigatórios não preenchidos, verifique!", "warning-snackbar")
      return;
    }

    let person = new PersonModel();
    person.name = this.name;
    person.personType = this.personType;
    person.email = this.email;
    person.profilePic = this.profilePic;
    person.commemorativeDate = this.CommemorativeDate;
    person.details = this.details;


    this.personsDispatcherService.createPerson(person)
      .subscribe(
        response => {
          this.personId = response.ID;
          this.name = response.Name;
          this.email = response.Email;
          this.profilePic = response.ProfilePic;
          this.personType = response.PersonType;
          this.CommemorativeDate = response.CommemorativeDate;
          this.details = response.Details;
          this.informationField = response.Name;

          this.treatProfilePicExhibition(response.ProfilePic);

          this.tabIsDisabled = false;
          this.createButtonLoading = false;

          this.getAllPersons();
          this.treatButtons(this.personType, this.personId);
          this.inputIsDisabled = false;
          this.messageHandler.showMessage("Pessoa criada com sucesso!", "success-snackbar")
        },
        error => {
          console.log(error);
          this.errorHandler.handleError(error);
          this.createButtonLoading = false;
        });
  }

  public updatePerson(): void {

    if (!this.personForm.valid) {
      console.log(this.personForm);
      this.createButtonLoading = false;
      this.personForm.markAllAsTouched();
      this.messageHandler.showMessage("Campos obrigatórios não preenchidos, verifique!", "warning-snackbar")
      return;
    }

    let person = new PersonModel();
    person.id = this.personId;
    person.name = this.name;
    person.personType = this.personType;
    person.email = this.email;
    person.profilePic = this.profilePic;
    person.commemorativeDate = this.CommemorativeDate;
    person.details = this.details;

    this.personsDispatcherService.updatePerson(this.personId, person)
      .subscribe(
        response => {
          this.personId = response.ID;
          this.name = response.Name;
          this.email = response.Email;
          this.personType = response.PersonType;
          this.CommemorativeDate = response.CommemorativeDate;
          this.details = response.Details;
          this.informationField = response.Name;
          this.profilePic = response.ProfilePic;
          this.treatProfilePicExhibition(response.ProfilePic);

          this.createButtonLoading = false;

          this.getAllPersons();
          this.treatButtons(this.personType, this.personId);

          this.messageHandler.showMessage("Pessoa alterada com sucesso!", "success-snackbar")
        },
        error => {
          this.errorHandler.handleError(error);
          console.log(error);
          this.createButtonLoading = false;
        });
  }


  public treatProfilePicExhibition(profilePic: string): void {

    if (profilePic != null && profilePic != "") {
      this.profilePicExhibition = `${this.imagePathUrl}${profilePic}`;
    } else {
      this.profilePicExhibition = `${this.imagePathUrlDefault}`;
    }

  }

  public createPhysicalComplement(): void {

    if (!this.physicalComplementForm.valid) {
      console.log(this.physicalComplementForm);
      this.createPfButtonLoading = false;
      this.physicalComplementForm.markAllAsTouched();
      this.messageHandler.showMessage("Campos obrigatórios não preenchidos, verifique!", "warning-snackbar")
      return;
    }

    if (this.cpfNumber != "" && !cpf.isValid(this.cpfNumber)) {
      this.createPfButtonLoading = false;
      this.messageHandler.showMessage("CPF inválido, verifique!", "warning-snackbar")
      return;
    }

    let physicalComplement = new PersonPhysicalModel();
    physicalComplement.personId = this.personId;
    physicalComplement.maritalStatus = this.maritalStatus;
    physicalComplement.gender = this.gender;
    physicalComplement.deathDate = this.deathDate;
    physicalComplement.cpfNumber = this.cpfNumber;
    physicalComplement.cnsNumber = this.cnsNumber;

    this.personsPhysicalsDispatcherService.CreatePhysicalComplements(physicalComplement)
      .subscribe(
        response => {
          this.personPhysicalId = response.ID;
          this.personId = response.PersonID;
          this.cpfNumber = response.CpfNumber;
          this.cnsNumber = response.CnsNumber;
          this.maritalStatus = response.MaritalStatus;
          this.gender = response.Gender;

          this.tabIsDisabled = false;
          this.inputIsDisabled = true;
          this.createPfButtonLoading = false;

          this.getAllPersons();
          this.messageHandler.showMessage("Complemento criado com sucesso!", "success-snackbar")
        },
        error => {
          console.log(error);
          this.errorHandler.handleError(error);
          this.createPfButtonLoading = false;
        });
  }

  public updatePhysicalComplement(): void {

    if (!this.physicalComplementForm.valid) {
      console.log(this.physicalComplementForm);
      this.createPfButtonLoading = false;
      this.physicalComplementForm.markAllAsTouched();
      this.messageHandler.showMessage("Campos obrigatórios não preenchidos, verifique!", "warning-snackbar")
      return;
    }

    if (this.cpfNumber != "" && !cpf.isValid(this.cpfNumber)) {
      this.createPfButtonLoading = false;
      this.messageHandler.showMessage("CPF inválido, verifique!", "warning-snackbar");
      return;
    }

    let physicalComplement = new PersonPhysicalModel();
    physicalComplement.id = this.personPhysicalId;
    physicalComplement.personId = this.personId;
    physicalComplement.maritalStatus = this.maritalStatus;
    physicalComplement.gender = this.gender;
    physicalComplement.deathDate = this.deathDate;
    physicalComplement.cpfNumber = this.cpfNumber;
    physicalComplement.cnsNumber = this.cnsNumber;

    this.personsPhysicalsDispatcherService.updatePhysicalComplements(this.personPhysicalId, physicalComplement)
      .subscribe(
        response => {
          console.log(response);
          this.personPhysicalId = response.ID;
          this.personId = response.PersonID;
          this.cpfNumber = response.CpfNumber;
          this.cnsNumber = response.CnsNumber;
          this.maritalStatus = response.MaritalStatus;
          this.gender = response.Gender;
          this.createPfButtonLoading = false;
          this.messageHandler.showMessage("Complemento alterado com sucesso!", "success-snackbar")
        },
        error => {
          this.errorHandler.handleError(error);
          this.createPfButtonLoading = false;
        });
  }

  public createJuridicalComplement(): void {

    if (!this.juridicalComplementForm.valid) {
      console.log(this.juridicalComplementForm.valid);
      this.createPjButtonLoading = false;
      this.juridicalComplementForm.markAllAsTouched();
      this.messageHandler.showMessage("Campos obrigatórios não preenchidos, verifique!", "warning-snackbar")
      return;
    }

    if (this.fantasyName == "" && this.cnpjNumber == "") {
      this.createPjButtonLoading = false;
      this.juridicalComplementForm.markAllAsTouched();
      this.messageHandler.showMessage("Insira no mínimo uma informação para prosseguir com o cadastro!", "warning-snackbar")
      return;
    }

    if (this.cnpjNumber != "" && !cnpj.isValid(this.cnpjNumber)) {
      this.createPjButtonLoading = false;
      this.messageHandler.showMessage("CNPJ inválido, verifique!", "warning-snackbar")
      return;
    }

    let juridicalComplement = new PersonJuridicalModel();
    juridicalComplement.personId = this.personId;
    juridicalComplement.fantasyName = this.fantasyName;
    juridicalComplement.cnpjNumber = this.cnpjNumber;

    this.personsJuridicalsDispatcherService.CreateJuridicalComplements(juridicalComplement)
      .subscribe(
        response => {
          console.log(response)
          this.personJuridicalId = response.ID;
          this.personId = response.PersonID;
          this.cnpjNumber = response.CnpjNumber;
          this.fantasyName = response.FantasyName;

          this.tabIsDisabled = false;
          this.inputIsDisabled = true;
          this.createPjButtonLoading = false;

          this.getAllPersons();
          this.messageHandler.showMessage("Complemento criado com sucesso!", "success-snackbar")
        },
        error => {
          console.log(error);
          this.errorHandler.handleError(error);
          this.createPjButtonLoading = false;
        });
  }

  public updateJuridicalComplement(): void {

    if (!this.juridicalComplementForm.valid) {
      console.log(this.juridicalComplementForm);
      this.createPjButtonLoading = false;
      this.juridicalComplementForm.markAllAsTouched();
      this.messageHandler.showMessage("Campos obrigatórios não preenchidos, verifique!", "warning-snackbar")
      return;
    }

    if (this.cnpjNumber != "" && !cnpj.isValid(this.cnpjNumber)) {
      this.createPjButtonLoading = false;
      this.messageHandler.showMessage("CNPJ inválido, verifique!", "warning-snackbar")
      return;
    }

    let juridicalComplement = new PersonJuridicalModel();
    juridicalComplement.id = this.personJuridicalId;
    juridicalComplement.personId = this.personId;
    juridicalComplement.fantasyName = this.fantasyName;
    juridicalComplement.cnpjNumber = this.cnpjNumber;

    this.personsJuridicalsDispatcherService.UpdateJuridicalComplements(this.personJuridicalId, juridicalComplement)
      .subscribe(
        response => {
          this.personJuridicalId = response.ID;
          this.personId = response.PersonID;
          this.cnpjNumber = response.CnpjNumber;
          this.fantasyName = response.FantasyName;
          this.createPjButtonLoading = false;
          this.messageHandler.showMessage("Complemento alterado com sucesso!", "success-snackbar")
        },
        error => {
          this.errorHandler.handleError(error);
          this.createPjButtonLoading = false;
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
                this.resetForms();
                this.profilePicExhibition = `${this.imagePathUrlDefault}`;
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

  public resetForms(): void {
    this.personForm.reset();
    this.personForm.clearValidators();
    this.personForm.updateValueAndValidity();

    this.physicalComplementForm.reset();
    this.physicalComplementForm.clearValidators();
    this.physicalComplementForm.updateValueAndValidity();

    this.juridicalComplementForm.reset();
    this.juridicalComplementForm.clearValidators();
    this.juridicalComplementForm.updateValueAndValidity();
  }

  public treatButtons(personTypeSelected: string, personId: string) {

    if (personTypeSelected == "F" || personTypeSelected == "f") {
      this.showJuridicalRegister = false;
      this.showPhysicalRegister = true;
      this.showSavePhysicalComplementsButton = true;
      this.showSaveJuridicalComplementsButton = false;
      this.inputIsDisabled = true;

      this.personsPhysicalsDispatcherService.GetPersonPhysicalByPersonId(personId)
        .subscribe(result => {
          if (!result) {
            this.personPhysicalId = "";
            this.cpfNumber = "";
            this.cnsNumber = "";
            this.gender = "";
            this.inputIsDisabled = false;
            //this.deathDate = ;
            this.physicalComplementForm.clearValidators();
            this.physicalComplementForm.updateValueAndValidity();
          } else {
            this.personPhysicalId = result.ID;
            this.cpfNumber = result.CpfNumber;
            this.cnsNumber = result.CnsNumber;
            this.maritalStatus = result.MaritalStatus;
            this.gender = result.Gender;
            this.deathDate = result.DeathDate;
          }
        });
    }
    else if (personTypeSelected == "J" || personTypeSelected == "j") {
      this.showPhysicalRegister = false;
      this.showJuridicalRegister = true;
      this.showSaveJuridicalComplementsButton = true;
      this.showSavePhysicalComplementsButton = false;
      this.inputIsDisabled = true;

      this.personsJuridicalsDispatcherService.GetPersonJuridicalByPersonId(personId)
        .subscribe(result => {
          if (!result) {
            this.personJuridicalId = "";
            this.cnpjNumber = "";
            this.fantasyName = "";
            this.inputIsDisabled = false;
          } else {
            this.personJuridicalId = result.ID;
            this.cnpjNumber = result.CnpjNumber;
            this.fantasyName = result.FantasyName;
          }
        });
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
    AddressCode: [null, [Validators.required, Validators.minLength(8), Validators.maxLength(8)]], PublicPlace: [null, [Validators.required, Validators.maxLength(255)]],
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
  Complement: string = '';
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
    Complement: [null],
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
