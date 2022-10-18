import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { IApplication } from 'src/app/interfaces/i-application';
import { ApplicationsDispatcherService } from 'src/app/services/application-dispatcher.service';
import { ErrorHandlerService } from 'src/app/services/error-handler.service';
//imageUrl: '../../assets/img/undraw_profile.svg'

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
  public searchPersonName!: string;
  public informationField!: string;
  public value = '';
  public tdColor = '#efefef';
  public profilePicExhibition!: string;

  public displayedSearchColumns: string[] = ['color', 'borrower', 'date', 'product'];
  public dataSourceSearch = new MatTableDataSource<IApplication>();

  @ViewChild('paginatorApplication') paginatorApplication!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private applicationsDispatcherService: ApplicationsDispatcherService,
    private errorHandler: ErrorHandlerService) { }

  ngOnInit(): void {
    this.getAvailableApplications();
  }

  public loadData(): void {
    
    this.searchButtonLoading = true;

    if (this.searchApplicationName == "" || this.searchApplicationName == null || this.searchApplicationName == undefined) {

    }
    else {

    }
    
  }

  public getAvailableApplications(): void {
    this.applicationsDispatcherService.getAllApplications()
      .subscribe(
        applications => {
          this.dataSourceSearch = new MatTableDataSource(applications);
          this.dataSourceSearch.paginator = this.paginatorApplication;
          this.dataSourceSearch.sort = this.sort;
          this.searchButtonLoading = false;
        },
        error => {
          console.log(error);
          this.errorHandler.handleError(error);
          this.searchButtonLoading = false;
        });
  }

  public getApplicationsByPersoName(): void {
    this.applicationsDispatcherService.getApplicationsByName(this.searchApplicationName).subscribe(
      applications => {
        this.dataSourceSearch = new MatTableDataSource(applications);
        this.dataSourceSearch.paginator = this.paginatorApplication;
        this.dataSourceSearch.sort = this.sort;
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

}
