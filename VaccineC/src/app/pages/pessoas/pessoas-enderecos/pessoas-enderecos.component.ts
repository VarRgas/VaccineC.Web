import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

export interface AddressElement {
  type: string;
  address: string;
}

@Component({
  selector: 'app-pessoas-enderecos',
  templateUrl: './pessoas-enderecos.component.html',
  styleUrls: ['./pessoas-enderecos.component.scss']
})

export class PessoasEnderecosComponent implements OnInit {

  displayedColumns: string[] = ['type', 'address'];
  dataSource = ELEMENT_DATA;

  constructor(public dialog: MatDialog) { }

  ngOnInit(): void {
  }

  openAddressDialog() {
    const dialogRef = this.dialog.open(DialogContentAddressDialog);

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

}

@Component({
  selector: 'dialog-content-address-dialog',
  templateUrl: 'dialog-content-address-dialog.html',
})
export class DialogContentAddressDialog { }


const ELEMENT_DATA: AddressElement[] = [
  { type: 'PRINCIPAL', address: 'R SINIMBU 1010 - CENTRO - CAXIAS DO SUL/RS' },

];