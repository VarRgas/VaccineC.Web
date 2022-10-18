import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { IApplication } from 'src/app/interfaces/i-application';
import { ApplicationsDispatcherService } from 'src/app/services/application-dispatcher.service';
import { AuthorizationsDispatcherService } from 'src/app/services/authorization-dispatcher.service';
import { ErrorHandlerService } from 'src/app/services/error-handler.service';
import { MessageHandlerService } from 'src/app/services/message-handler.service';
import { PersonDispatcherService } from 'src/app/services/person-dispatcher.service';

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
  selector: 'app-aplicacao',
  templateUrl: './aplicacao.component.html',
  styleUrls: ['./aplicacao.component.scss']
})

export class AplicacaoComponent implements OnInit {

  public imagePathUrl = 'http://localhost:5000/';
  public imagePathUrlDefault = "../../../assets/img/default-profile-pic.png";

  //Controle de habilitação de campos
  public searchButtonLoading = false;

  //Variáveis dos inputs
  public searchApplicationName!: string;

  //Outros
  public informationField!: string;
  public value = '';
  public tdColor = '#efefef';
  public profilePicExhibition!: string;
  public isTableApplicationVisible = true;

  public displayedSearchApplicationColumns: string[] = ['color', 'borrower', 'date', 'product', 'ID'];
  public dataSourceSearchApplication = new MatTableDataSource<IApplication>();

  public displayedSearchPersonColumns: string[] = ['color', 'borrower', 'ID'];
  public dataSourceSearchPerson = new MatTableDataSource<IApplication>();

  displayedColumns: string[] = ['product', 'scheduling', 'date', 'action'];
  dataSource = ELEMENT_DATA;

  @ViewChild('paginatorPerson') paginatorPerson!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private applicationsDispatcherService: ApplicationsDispatcherService,
    private authorizationsDispatcherService: AuthorizationsDispatcherService,
    private personsDispatcherService: PersonDispatcherService,
    private errorHandler: ErrorHandlerService,
    private messageHandler: MessageHandlerService,
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.getAvailableApplications();
  }

  public loadData(): void {

    this.searchButtonLoading = true;

    if (this.searchApplicationName == undefined || this.searchApplicationName == null || this.searchApplicationName == "") {
      this.messageHandler.showMessage("É necessário informar no mínimo 3 caracteres para realizar a busca!", "danger-snackbar");
      this.searchButtonLoading = false;
    }
    else {
      this.getAllPersonsByInfo();
    }

  }

  public getAvailableApplications(): void {

    this.searchApplicationName = "";

    this.authorizationsDispatcherService.getAllAuthorizationsForApplication()
      .subscribe(
        applications => {
          console.log(applications)

          this.dataSourceSearchApplication = new MatTableDataSource(applications);

          this.isTableApplicationVisible = true;
          this.searchButtonLoading = false;
        },
        error => {
          console.log(error);
          this.errorHandler.handleError(error);
          this.searchButtonLoading = false;
        });
  }

  public getAllPersonsByInfo(): void {

    const searchPersonNameFormated = this.searchApplicationName.replace(/[^a-zA-Z0-9 ]/g, '');

    this.personsDispatcherService.getPersonsByName(searchPersonNameFormated).subscribe(
      persons => {

        console.log(persons)
        this.dataSourceSearchPerson = new MatTableDataSource(persons);
        this.dataSourceSearchPerson.paginator = this.paginatorPerson;

        this.dataSourceSearchPerson.sort = this.sort;

        this.isTableApplicationVisible = false;
        this.searchButtonLoading = false;
      },
      error => {
        console.log(error);
        this.errorHandler.handleError(error);
        this.searchButtonLoading = false;
      });
  }

  public formateProfilePicExhibition(profilePic: string) {
    if (profilePic == undefined || profilePic == null || profilePic == "") {
      return `${this.imagePathUrlDefault}`;
    } else {
      return `${this.imagePathUrl}${profilePic}`;
    }
  }

  public getPersonAge(commemorativeDate: Date) {
    const bdate = new Date(commemorativeDate);
    const timeDiff = Math.abs(Date.now() - bdate.getTime());
    return Math.floor((timeDiff / (1000 * 3600 * 24)) / 365);
  }

  public formatTdColor(gender: string) {
    if (gender == "F") {
      return "#f8e3fa";
    } else if (gender == "M") {
      return "#cfe2f7";
    } else {
      return "#efefef";
    }
  }

  public formatDate(date: Date) {
    return [
      this.padTo2Digits(date.getDate()),
      this.padTo2Digits(date.getMonth() + 1),
      date.getFullYear(),
    ].join('/');
  }

  public padTo2Digits(num: number) {
    return num.toString().padStart(2, '0');
  }

  public formatHour(time: string) {
    const timeArray = time.split(":");
    return `${timeArray[0]}:${timeArray[1]}`
  }

  public formatDateExhibition(startDate: Date, startTime: string) {
    return `${this.formatDate(new Date(startDate))} às ${this.formatHour(startTime)}`;
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


