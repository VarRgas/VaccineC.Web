import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import { MatDialog } from '@angular/material/dialog';

export interface PeriodicElement {
  day: string;
  initialHour: string;
  finalHour: string;
}

@Component({
  selector: 'app-empresa-agenda',
  templateUrl: './empresa-agenda.component.html',
  styleUrls: ['./empresa-agenda.component.scss']
})

export class EmpresaAgendaComponent implements OnInit {

  displayedColumns: string[] = ['select', 'day', 'initialHour', 'finalHour'];
  dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);
  selection = new SelectionModel<PeriodicElement>(true, []);

  constructor(public dialog: MatDialog) { }

  ngOnInit(): void {
  }

  openScheduleDialog() {
    const dialogRef = this.dialog.open(DialogContentScheduleDialog);

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  toggleAllRows() {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }

    this.selection.select(...this.dataSource.data);
  }


}

const ELEMENT_DATA: PeriodicElement[] = [
  { day: 'SEGUNDA', initialHour: '08:00', finalHour: '12:00' },
  { day: 'TERÇA', initialHour: '08:30', finalHour: '12:30' }
];

@Component({
  selector: 'dialog-content-schedule-dialog',
  templateUrl: 'dialog-content-schedule-dialog.html',
})
export class DialogContentScheduleDialog { }