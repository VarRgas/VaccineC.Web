import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-gerenciar-usuarios',
  templateUrl: './gerenciar-usuarios.component.html',
  styleUrls: ['./gerenciar-usuarios.component.scss']
})
export class GerenciarUsuariosComponent implements OnInit {

  constructor(public dialog: MatDialog) { }

  ngOnInit(): void {
  }

  public openAddScreensDialog(): void {
    const dialogRef = this.dialog.open(AddScreensDialog);

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }
}
@Component({
  selector: 'add-screens-dialog',
  templateUrl: 'add-screens-dialog.html',
})
export class AddScreensDialog { }
