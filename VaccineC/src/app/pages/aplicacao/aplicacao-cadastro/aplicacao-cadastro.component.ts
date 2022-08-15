import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

export interface AplicationElement {
  product: string;
  scheduling: string;
  date: string;
}

const ELEMENT_DATA: AplicationElement[] = [
  { product: 'VACINA INFLUENZA', scheduling: '12345', date: '15/08/2022 10:30' },
  { product: 'VACINA BCG', scheduling: '67891', date: '16/08/2022 15:00' }
];


@Component({
  selector: 'app-aplicacao-cadastro',
  templateUrl: './aplicacao-cadastro.component.html',
  styleUrls: ['./aplicacao-cadastro.component.scss']
})

export class AplicacaoCadastroComponent implements OnInit {

  value = '';

  displayedColumns: string[] = ['product', 'scheduling', 'date', 'action'];
  dataSource = ELEMENT_DATA;

  constructor(public dialog: MatDialog) { }

  ngOnInit(): void {
  }

  openAplicationDialog() {
    const dialogRef = this.dialog.open(AplicationDialog, { width: '60vw' });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

  openBatchDialog() {
    const dialogRef = this.dialog.open(BatchDialog, { width: '40vw' });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

}

@Component({
  selector: 'aplication-dialog',
  templateUrl: 'aplication-dialog.html',
})
export class AplicationDialog { }


@Component({
  selector: 'batch-dialog',
  templateUrl: 'batch-dialog.html',
})
export class BatchDialog { }

