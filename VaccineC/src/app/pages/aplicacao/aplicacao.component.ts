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

  //Controle de habilitação de campos
  public searchButtonLoading = false;

  //Variáveis dos inputs
  public searchApplicationName!: string;

  //Outros
  public searchPersonName!: string;
  public informationField!: string;
  public value = '';

  public displayedSearchColumns: string[] = ['imageUrl','pacient', 'date'];
  public dataSourceSearch = new MatTableDataSource<IApplication>();

  public displayedColumns: string[] = ['product', 'scheduling', 'date'];
  public dataSource = ELEMENT_DATA;


  @ViewChild('paginatorApplication') paginatorApplication!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private applicationsDispatcherService: ApplicationsDispatcherService,
    private errorHandler: ErrorHandlerService) { }

  ngOnInit(): void {
    this.getAllApplications();
  }

  public loadData(): void {
    this.searchButtonLoading = true;

    if (this.searchApplicationName == "" || this.searchApplicationName == null || this.searchApplicationName == undefined)
        this.getAllApplications();
    else
      this.getApplicationsByPersoName();
  }

  public getAllApplications(): void {
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
}

export interface PersonElement {
  product: string;
  scheduling: string;
  date: string;
}

const ELEMENT_DATA: PersonElement[] = [
  { product: 'VACINA INFLUENZA', scheduling: '12345', date: '15/08/2022 10:30' },
  { product: 'VACINA BCG', scheduling: '67891', date: '16/08/2022 15:00' }
];
