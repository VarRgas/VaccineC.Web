import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

export interface PhoneElement {
  type: string;
  area: string;
  number: string;
}

const ELEMENT_DATA: PhoneElement[] = [
  { type: 'CELULAR', area: '54', number: '991112233' },
  { type: 'PRINCIPAL', area: '54', number: '992223344' },
  { type: 'RESIDENCIAL', area: '54', number: '35352222' },

];

@Component({
  selector: 'app-pessoas-telefones',
  templateUrl: './pessoas-telefones.component.html',
  styleUrls: ['./pessoas-telefones.component.scss']
})
export class PessoasTelefonesComponent implements OnInit {

  displayedColumns: string[] = ['type', 'area', 'number'];
  dataSource = ELEMENT_DATA;

  constructor(public dialog: MatDialog) { }

  ngOnInit(): void {
  }

  openPhoneDialog() {
    const dialogRef = this.dialog.open(DialogContentPhoneDialog);

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