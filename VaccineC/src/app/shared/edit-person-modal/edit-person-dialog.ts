import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { cnpj, cpf } from 'cpf-cnpj-validator';
import { IPersonAddress } from 'src/app/interfaces/i-person-address';
import { IPersonPhone } from 'src/app/interfaces/i-person-phone';
import { PersonJuridicalModel } from 'src/app/models/person-juridical-model';
import { PersonModel } from 'src/app/models/person-model';
import { PersonPhysicalModel } from 'src/app/models/person-physical-model';
import { ConfirmAddressPhoneRemoveDialog, ConfirmPersonPhoneRemoveDialog, DialogContentAddressDialog, DialogContentPhoneDialog, UpdatePersonAddressDialog, UpdatePersonPhoneDialog } from 'src/app/pages/pessoas/pessoas.component';
import { ErrorHandlerService } from 'src/app/services/error-handler.service';
import { MessageHandlerService } from 'src/app/services/message-handler.service';
import { PersonsAddressesDispatcherService } from 'src/app/services/person-address-dispatcher.service';
import { PersonDispatcherService } from 'src/app/services/person-dispatcher.service';
import { PersonsJuridicalsDispatcherService } from 'src/app/services/person-juridical-dispatcher.service';
import { PersonsPhonesDispatcherService } from 'src/app/services/person-phone-dispatcher.service';
import { PersonsPhysicalsDispatcherService } from 'src/app/services/person-physical-dispatcher.service';

@Component({
  selector: 'edit-person-dialog',
  templateUrl: './edit-person-dialog.html',
  styleUrls: ['./edit-person-dialog.scss']
})
export class EditPersonDialog implements OnInit {

  public imagePathUrl = 'http://localhost:5000/';
  public imagePathUrlDefault = "../../../assets/img/default-profile-pic.png";
  public today = new Date();

  //Controle
  public showPhysicalRegister: boolean = false;
  public showJuridicalRegister: boolean = false;

  //Complementos
  public personPhysicalId!: string;
  public personJuridicalId!: string;
  public cpfNumber!: string;
  public cnpjNumber!: string;
  public cnsNumber!: string;
  public maritalStatus!: string;
  public gender!: string;
  public commemorativeDate!: Date;
  public fantasyName!: string;
  public profilePic!: string;
  public personProfilePic!: string;
  public personId!: string;
  public name!: string;
  public personType!: string;
  public email!: string;
  public details!: string;

  //Table Phones
  public displayedColumnsPhone: string[] = ['PhoneType', 'NumberPhone', 'ID', 'Options'];
  public dataSourcePhone = new MatTableDataSource<IPersonPhone>();

  //Table Addresses
  public displayedColumnsAddress: string[] = ['AddressType', 'Address', 'ID', 'Options'];
  public dataSourceAddress = new MatTableDataSource<IPersonAddress>();

  @ViewChild('paginatorPhone') paginatorPhone!: MatPaginator;
  @ViewChild('paginatorAddress') paginatorAddress!: MatPaginator;

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
    CommemorativeDate: [null],
    Gender: [null, [Validators.required]]
  });

  public juridicalComplementForm: FormGroup = this.formBuilder.group({
    PersonId: [null],
    FantasyName: [null],
    CnpjNumber: [null],
  });

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<any>,
    private messageHandler: MessageHandlerService,
    private errorHandler: ErrorHandlerService,
    private personsDispatcherService: PersonDispatcherService,
    private personsPhysicalsDispatcherService: PersonsPhysicalsDispatcherService,
    private personsJuridicalsDispatcherService: PersonsJuridicalsDispatcherService,
    private personsPhonesDispatcherService: PersonsPhonesDispatcherService,
    private personsAddressesDispatcherService: PersonsAddressesDispatcherService,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.personId = this.data.PersonId;
    this.getPersonInformationsById(this.personId);
  }

  public getPersonInformationsById(personId: string): void {
    this.personsDispatcherService.getPersonById(personId)
      .subscribe(
        person => {
          this.personId = person.ID;
          this.name = person.Name;
          this.personType = person.PersonType;
          this.email = person.Email;
          this.commemorativeDate = person.CommemorativeDate;
          this.details = person.Details;
          this.profilePic = person.ProfilePic;
          this.personProfilePic = this.formateProfilePicExhibition(person.ProfilePic);

          this.treatButtons(this.personType, this.personId);
        },
        error => {
          console.log(error);
        });

        this.personsPhonesDispatcherService.getAllPersonsPhonesByPersonId(personId)
        .subscribe(
          result => {
            this.dataSourcePhone = new MatTableDataSource(result);
            this.dataSourcePhone.paginator = this.paginatorPhone;
          },
          error => {
            console.log(error);
          });
  
      this.personsAddressesDispatcherService.getAllPersonsAddressesByPersonId(personId)
        .subscribe(
          result => {
            this.dataSourceAddress = new MatTableDataSource(result);
            this.dataSourceAddress.paginator = this.paginatorAddress;
          },
          error => {
            console.log(error);
          });
  }

  public updatePersonInformations(): void {

    if (!this.personForm.valid) {
      console.log(this.personForm);
      this.personForm.markAllAsTouched();
      this.messageHandler.showMessage("Campos obrigatórios não preenchidos, verifique!", "warning-snackbar");
      return;
    }

    let person = new PersonModel();
    person.ID = this.personId;
    person.name = this.name;
    person.personType = this.personType;
    person.email = this.email;
    person.commemorativeDate = this.commemorativeDate;
    person.profilePic = this.profilePic;
    person.details = this.details;

    this.personsDispatcherService.updatePerson(this.personId, person)
      .subscribe(
        response => {
          console.log(response)
          this.personId = response.ID;
          this.name = response.Name;
          this.email = response.Email;
          this.personType = response.PersonType;
          this.commemorativeDate = response.CommemorativeDate;
          this.details = response.Details;
          this.profilePic = response.ProfilePic;
          this.treatButtons(this.personType, this.personId);
        },
        error => {
          this.errorHandler.handleError(error);
          console.log(error);
        });

    if (this.personType == "F") {
      this.updatePhysicalComplement();
    } else if (this.personType == "J") {
      this.updateJuridicalComplement();
    }

  }

  public updatePhysicalComplement(): void {

    if (!this.physicalComplementForm.valid) {
      console.log(this.physicalComplementForm);
      this.physicalComplementForm.markAllAsTouched();
      this.messageHandler.showMessage("Campos obrigatórios não preenchidos, verifique!", "warning-snackbar");
      return;
    }

    if (this.cpfNumber != "" && !cpf.isValid(this.cpfNumber)) {
      this.messageHandler.showMessage("CPF inválido, verifique!", "warning-snackbar");
      return;
    }

    let physicalComplement = new PersonPhysicalModel();
    physicalComplement.id = this.personPhysicalId;
    physicalComplement.personId = this.personId;
    physicalComplement.maritalStatus = this.maritalStatus;
    physicalComplement.gender = this.gender;
    physicalComplement.cpfNumber = this.cpfNumber;
    physicalComplement.cnsNumber = this.cnsNumber;

    this.personsPhysicalsDispatcherService.updatePhysicalComplements(this.personPhysicalId, physicalComplement)
      .subscribe(
        response => {
          this.personPhysicalId = response.ID;
          this.personId = response.PersonID;
          this.cpfNumber = response.CpfNumber;
          this.cnsNumber = response.CnsNumber;
          this.maritalStatus = response.MaritalStatus;
          this.gender = response.Gender;
        
          this.messageHandler.showMessage("Pessoa alterada com sucesso!", "success-snackbar");
          this.dialogRef.close();
        },
        error => {
          this.errorHandler.handleError(error);
        });
  }

  public updateJuridicalComplement(): void {

    if (!this.juridicalComplementForm.valid) {
      console.log(this.juridicalComplementForm);
      this.juridicalComplementForm.markAllAsTouched();
      this.messageHandler.showMessage("Campos obrigatórios não preenchidos, verifique!", "warning-snackbar");
      return;
    }

    if (this.cnpjNumber != "" && !cnpj.isValid(this.cnpjNumber)) {
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
         
          this.messageHandler.showMessage("Pessoa alterada com sucesso!", "success-snackbar");
          this.dialogRef.close();
        },
        error => {
          this.errorHandler.handleError(error);
        });
  }

  public treatButtons(personTypeSelected: string, personId: string) {
    if (personTypeSelected == "F" || personTypeSelected == "f") {
      this.showJuridicalRegister = false;
      this.showPhysicalRegister = true;

      this.personsPhysicalsDispatcherService.GetPersonPhysicalByPersonId(personId)
        .subscribe(result => {
          if (!result) {
            this.personPhysicalId = "";
            this.cpfNumber = "";
            this.cnsNumber = "";
            this.gender = "";
            this.physicalComplementForm.clearValidators();
            this.physicalComplementForm.updateValueAndValidity();
          } else {
            this.personPhysicalId = result.ID;
            this.cpfNumber = result.CpfNumber;
            this.cnsNumber = result.CnsNumber;
            this.maritalStatus = result.MaritalStatus;
            this.gender = result.Gender;
          }
          console.log(result);
        });
    } else if (personTypeSelected == "J" || personTypeSelected == "j") {
      this.showPhysicalRegister = false;
      this.showJuridicalRegister = true;

      this.personsJuridicalsDispatcherService.GetPersonJuridicalByPersonId(personId)
        .subscribe(result => {
          if (!result) {
            this.personJuridicalId = "";
            this.cnpjNumber = "";
            this.fantasyName = "";
          } else {
            this.personJuridicalId = result.ID;
            this.cnpjNumber = result.CnpjNumber;
            this.fantasyName = result.FantasyName;
          }
        });
    }
  }

  public formateProfilePicExhibition(profilePic: string) {
    if (profilePic == undefined || profilePic == null || profilePic == "")
      return `${this.imagePathUrlDefault}`;
    else
      return `${this.imagePathUrl}${profilePic}`;
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

  public openUpdatePersonPhoneDialog(id: string): void {
    const dialogRef = this.dialog.open(UpdatePersonPhoneDialog, {
      disableClose: true,
      width: '50vw',
      data: {
        ID: id
      },
    });

    dialogRef.afterClosed().subscribe(
      (res) => {
        if (res != "") {
          this.dataSourcePhone = new MatTableDataSource(res);
          this.dataSourcePhone.paginator = this.paginatorPhone;
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
            this.dataSourcePhone.paginator = this.paginatorPhone;
            this.messageHandler.showMessage("Telefone removido com sucesso!", "success-snackbar")
          },
          error => {
            console.log(error);
            this.errorHandler.handleError(error);
          });
      }
    });

  }

  public openUpdatePersonAddressDialog(id: string): void {

    const dialogRef = this.dialog.open(UpdatePersonAddressDialog, {
      disableClose: true,
      height: '100%',
      data: {
        ID: id
      },
    });

    dialogRef.afterClosed().subscribe(
      (res) => {
        if (res != "") {
          this.dataSourceAddress = new MatTableDataSource(res);
          this.dataSourceAddress.paginator = this.paginatorAddress;
        }
      }
    );
  }

  deleteAddressPhone(id: string) {

    const dialogRef = this.dialog.open(ConfirmAddressPhoneRemoveDialog);

    dialogRef.afterClosed().subscribe(result => {
      if (!!result) {
        this.personsAddressesDispatcherService.delete(id).subscribe(
          success => {
            this.dataSourceAddress = new MatTableDataSource(success);
            this.dataSourceAddress.paginator = this.paginatorAddress;
            this.messageHandler.showMessage("Endereço removido com sucesso!", "success-snackbar")
          },
          error => {
            console.log(error);
            this.errorHandler.handleError(error);
          });
      }
    });

  }

  public openAddressDialog(): void {
    const dialogRef = this.dialog.open(DialogContentAddressDialog, {
      height: '100%',
      disableClose: true,
      data: {
        ID: this.personId
      },
    });

    dialogRef.afterClosed().subscribe(
      (res) => {
        if (res != "") {
          this.dataSourceAddress = new MatTableDataSource(res);
          this.dataSourceAddress.paginator = this.paginatorAddress;
        }
      }
    );
  }

  public openAddPhoneDialog(): void {
    const dialogRef = this.dialog.open(DialogContentPhoneDialog, {
      disableClose: true,
      data: {
        ID: this.personId
      },
    });

    dialogRef.afterClosed().subscribe(
      (res) => {
        if (res != "") {
          this.dataSourcePhone = new MatTableDataSource(res);
          this.dataSourcePhone.paginator = this.paginatorPhone;
        }
      }
    );
  }

}
