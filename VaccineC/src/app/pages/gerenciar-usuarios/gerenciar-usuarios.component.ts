import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

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
    this.dialogRef = this.dialog.open(ScreensDialog, { width: '40vw' });

    this.dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }
}

@Component({
  selector: 'screens-dialog',
  templateUrl: 'screens-dialog.html',
})

export class ScreensDialog implements OnInit {

  myControl = new FormControl('');
  options: string[] = ['EMPRESA', 'GERENCIAR USUÁRIOS', 'FORMAS PAGAMENTO'];
  filteredOptions: Observable<string[]> | undefined;

  ngOnInit(): void {
    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value || '')),
    );
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.options.filter(option => option.toLowerCase().includes(filterValue));
  }
}