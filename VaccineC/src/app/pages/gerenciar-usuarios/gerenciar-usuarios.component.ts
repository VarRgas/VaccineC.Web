import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-gerenciar-usuarios',
  templateUrl: './gerenciar-usuarios.component.html',
  styleUrls: ['./gerenciar-usuarios.component.scss']
})
export class GerenciarUsuariosComponent implements OnInit {
  public dialogRef?: MatDialogRef<any>;

  constructor(public dialog: MatDialog) { }

  ngOnInit(): void {
  }

  public openAddScreensDialog(): void {
    this.dialogRef = this.dialog.open(ScreensDialog, {
      height: '45%',
      width: '55%'
    });

    this.dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }
}

@Component({
  selector: 'screens-dialog',
  templateUrl: 'screens-dialog.html',
})

export class ScreensDialog {
  value = '';
  value2 = '';

  displayedColumns: string[] = ['screens'];
  dataSource = ELEMENT_DATA;

}

export interface screensElement {

  screens: string;
}

const ELEMENT_DATA: screensElement[] = [
  { screens: 'PESSOAS' },
  { screens: 'OUTRA TELA DE EXEMPLO' }
];
