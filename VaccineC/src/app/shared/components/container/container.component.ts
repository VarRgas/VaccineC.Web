import { Component, OnInit, Input, OnChanges, SimpleChanges, Inject, Output, EventEmitter } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-container',
  templateUrl: './container.component.html',
  styleUrls: ['./container.component.scss']
})
export class ContainerComponent implements OnInit, OnChanges {

  public dialogRef?: MatDialogRef<any>;

  isInformationHidden = true;

  @Input()
  containerTitle!: string;

  @Input()
  containerPath!: string;

  @Input()
  information!: string;

  @Input()
  isClickable = false;

  @Input()
  month = 0;

  @Input()
  year = 0;

  @Output() responseMonthYear = new EventEmitter();

  constructor(
    private dialog: MatDialog
  ) { }

  ngOnChanges(changes: SimpleChanges): void {

    if (changes.information == undefined) {

    } else {
      if (changes.information.currentValue == undefined || changes.information.currentValue == null || changes.information.currentValue == "") {
        this.isInformationHidden = true;
      } else {
        this.isInformationHidden = false;
      }
    }

  }

  ngOnInit(): void {
    this.isInformationHidden = true;
  }

  public openPeriodDialog(month: number, year: number) {

    this.dialogRef = this.dialog.open(PeriodDialog, {
      disableClose: true,
      width: '40vw',
      data: {
        Month: month,
        Year: year
      },
    });

    this.dialogRef.afterClosed().subscribe(
      (res) => {
        if (res != "") {
          this.information = res.InfoChip;
          this.month = res.Month;
          this.year = res.Year;
          const monthYear = {
            Month: res.Month,
            Year: res.Year
          }
          this.responseMonthYear.emit(monthYear);
        }
      }
    );

  }

}

@Component({
  selector: 'period-dialog',
  templateUrl: './period-dialog.html',
})
export class PeriodDialog implements OnInit {

  public month!: number;
  public year!: number;
  public monthSelect!: string;
  public yearSelect!: string;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<PeriodDialog>,
  ) { }

  ngOnInit(): void {
    this.month = this.data.Month;
    this.year = this.data.Year;
    this.monthSelect = this.month.toString();
    this.yearSelect = this.year.toString();
  }

  public updateSearchPeriod() {
    let updatedInformationField = `${this.getFullNameMonthDate(this.monthSelect)}/${this.yearSelect}`;
    let infos = {
      InfoChip: updatedInformationField,
      Month: parseInt(this.monthSelect),
      Year: parseInt(this.yearSelect)
    }
    this.dialogRef.close(infos);
  }

  public getFullNameMonthDate(month: string) {

    let monthFormated = "";

    switch (month) {
      case '1': {
        monthFormated = 'JAN'
        break;
      }
      case '2': {
        monthFormated = 'FEV'
        break;
      }
      case '3': {
        monthFormated = 'MAR'
        break;
      }
      case '4': {
        monthFormated = 'ABR'
        break;
      }
      case '5': {
        monthFormated = 'MAI'
        break;
      }
      case '6': {
        monthFormated = 'JUN'
        break;
      }
      case '7': {
        monthFormated = 'JUL'
        break;
      }
      case '8': {
        monthFormated = 'AGO'
        break;
      }
      case '9': {
        monthFormated = 'SET'
        break;
      }
      case '10': {
        monthFormated = 'OUT'
        break;
      }
      case '11': {
        monthFormated = 'NOV'
        break;
      }
      case '12': {
        monthFormated = 'DEZ'
        break;
      }
      default: {
        monthFormated = ''
        break;
      }
    }
    return monthFormated;
  }
}
