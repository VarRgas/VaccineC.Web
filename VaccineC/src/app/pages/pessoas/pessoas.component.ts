import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-pessoas',
  templateUrl: './pessoas.component.html',
  styleUrls: ['./pessoas.component.scss']
})

export class PessoasComponent implements OnInit {


  constructor(public dialog: MatDialog) { }

  ngOnInit(): void {
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
export class DialogContentAddressDialog { }

