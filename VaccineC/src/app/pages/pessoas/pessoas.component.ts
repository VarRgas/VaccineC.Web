import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { CEPError, Endereco, NgxViacepService } from "@brunoc/ngx-viacep";
import { catchError, EMPTY } from 'rxjs';

@Component({
  selector: 'app-pessoas',
  templateUrl: './pessoas.component.html',
  styleUrls: ['./pessoas.component.scss']
})

export class PessoasComponent implements OnInit {

  constructor(
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {
  }

  getAddressViaCep(): void {

  }

  openPhoneDialog() {
    const dialogRef = this.dialog.open(DialogContentPhoneDialog);

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

  openAddressDialog() {
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

