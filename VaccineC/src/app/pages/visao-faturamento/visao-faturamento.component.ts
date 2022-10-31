import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ListView } from '@fullcalendar/list';
import * as Chart from 'chart.js';
import { ChartConfiguration, ChartData, ChartEvent, ChartType, ControllerDatasetOptions } from 'chart.js';
import plugin from 'chartjs-plugin-datalabels';
import DataLabelsPlugin from 'chartjs-plugin-datalabels';
import { options } from 'preact';
import { ApplicationsDispatcherService } from 'src/app/services/application-dispatcher.service';
import { ErrorHandlerService } from 'src/app/services/error-handler.service';
import { MessageHandlerService } from 'src/app/services/message-handler.service';


@Component({
  selector: 'app-visao-faturamento',
  templateUrl: './visao-faturamento.component.html',
  styleUrls: ['./visao-faturamento.component.scss']
})
export class VisaoFaturamentoComponent implements OnInit {

  //Search Period
  month = new Date().getMonth() + 1;
  year = new Date().getFullYear();

  //Applications
  informationField!: string;
  applicationsCompleted!: number;
  applicationsPending!: number;
  genderList = new Array<string>();
  productList = new Array<string>();
  ageList = new Array<string>();
  typeList = new Array<string>();
  integrationList = new Array<string>();
  genderApplicationsNumber = new Array<number>();
  productApplicationsNumber = new Array<number>();
  ageApplicationsNumber = new Array<number>();
  typeApplicationsNumber = new Array<number>();
  integrationApplicationsNumber = new Array<number>();
  randomColorProduct = new Array<string>();
  randomColorAge = new Array<string>();


  constructor(
    private applicationsDispatcherService: ApplicationsDispatcherService,
    private errorHandler: ErrorHandlerService,
    private messageHandler: MessageHandlerService
  ) { }

  ngOnInit(): void {
    setTimeout(() => {
      this.getApplicationsByPersonGender();
      this.getApplicationsByProduct();
      this.getApplicationsByPersonAge();
      this.getSipniIntegrationSituation();
      this.getApplicationNumbers();
      this.getApplicationByType();
      this.informationField = `${this.formatMonthDate(new Date())}/${this.formatYearDate(new Date())}`;
    }, 200);
  }

  public barChartApplicationGenderType: ChartType = 'doughnut';
  public barChartApplicationGenderPlugins = [
  ];
  public barChartApplicationGenderData: ChartData<'doughnut'> = {
    labels: this.genderList,
    datasets: [{
      data: this.genderApplicationsNumber,
      backgroundColor: [
        'rgb(255, 99, 132)',
        '#36b9cc',
        '#858796'
      ],
      hoverBackgroundColor: [
        'rgb(255, 99, 132)',
        '#36b9cc',
        '#858796'
      ],
      circumference: 180,
      rotation: -90
    }]
  };


  public barChartApplicationTypeType: ChartType = 'doughnut';
  public barChartApplicationTypePlugins = [
  ];
  public barChartApplicationTypeData: ChartData<'doughnut'> = {
    labels: this.typeList,
    datasets: [{
      data: this.typeApplicationsNumber,
      backgroundColor: [
        '#36b9cc',
        '#858796'
      ],
      hoverBackgroundColor: [
        '#36b9cc',
        '#858796'
      ],
      circumference: 180,
      rotation: -90
    }]
  };


  public barChartApplicationAgeType: ChartType = 'bar';
  public barChartApplicationAgePlugins = [];
  public barChartApplicationAgeData: ChartData<'bar'> = {
    labels: this.ageList,
    datasets: [{
      label: "Aplicações",
      data: this.ageApplicationsNumber,
      backgroundColor: this.randomColorAge,
      hoverBackgroundColor: this.randomColorAge,
      borderColor: this.randomColorAge,
      hoverBorderColor: this.randomColorAge,
      borderWidth: 1
    }],
  };


  public barChartApplicationProductType: ChartType = 'bar';
  public barChartApplicationProductPlugins = [];
  public barChartApplicationProductData: ChartData<'bar'> = {
    labels: this.productList,
    datasets: [{
      label: "Aplicações",
      data: this.productApplicationsNumber,
      backgroundColor: this.randomColorProduct,
      hoverBackgroundColor: this.randomColorProduct,
      borderColor: this.randomColorProduct,
      hoverBorderColor: this.randomColorProduct,
      borderWidth: 1
    }]
  };


  public barChartApplicationIntegrationType: ChartType = 'doughnut';
  public barChartApplicationIntegrationPlugins = [];
  public barChartApplicationIntegrationData: ChartData<'doughnut'> = {
    labels: this.integrationList,
    datasets: [{
      data: this.integrationApplicationsNumber,
      backgroundColor: [
        '#1cc88a',
        '#e74a3b'
      ],
      hoverBackgroundColor: [
        '#1cc88a',
        '#e74a3b'
      ],
      hoverBorderColor: [
        '#1cc88a',
        '#e74a3b'
      ],
      circumference: 180,
      rotation: -90
    }]
  };

  public getApplicationsByPersonGender() {
    this.applicationsDispatcherService.getApplicationsByPersonGender(this.month, this.year).subscribe(
      response => {

        console.log(this.genderApplicationsNumber);

        response.forEach((element: any) => {
          this.genderList.push(element.Gender);
          this.genderApplicationsNumber.push(element.NumberOfApplications);

        });

        this.barChartApplicationGenderData = {
          labels: this.genderList,
          datasets: [{
            data: this.genderApplicationsNumber,
            backgroundColor: [
              'rgb(255, 99, 132)',
              '#36b9cc',
              '#858796'
            ],
            hoverBackgroundColor: [
              'rgb(255, 99, 132)',
              '#36b9cc',
              '#858796'
            ],
            circumference: 180,
            rotation: -90
          }]
        };

        console.log(this.genderApplicationsNumber);
      },
      error => {
        console.log(error);
        this.errorHandler.handleError(error);
      });
  }

  public getApplicationsByProduct() {
    this.applicationsDispatcherService.getApplicationsByProduct(this.month, this.year).subscribe(
      response => {
        response.forEach((element: any) => {
          this.productList.push(element.ProductName);
          this.productApplicationsNumber.push(element.NumberOfApplications);
          this.randomColorProduct.push(this.randomRGB());
        });

        this.barChartApplicationProductData = {
          labels: this.productList,
          datasets: [{
            label: "Aplicações",
            data: this.productApplicationsNumber,
            backgroundColor: this.randomColorProduct,
            hoverBackgroundColor: this.randomColorProduct,
            hoverBorderColor: this.randomColorProduct,
            borderColor: this.randomColorProduct,
            borderWidth: 1
          }]
        };
      },
      error => {
        console.log(error);
        this.errorHandler.handleError(error);
      });
  }

  public getApplicationsByPersonAge() {
    this.applicationsDispatcherService.getApplicationsByPersonAge(this.month, this.year).subscribe(
      response => {
        response.forEach((element: any) => {
          if (element.NumberOfApplications > 0) {
            this.ageList.push(element.AgeInterval);
            this.ageApplicationsNumber.push(element.NumberOfApplications);
            this.randomColorAge.push(this.randomRGB());
          }

          this.barChartApplicationAgeData = {
            labels: this.ageList,
            datasets: [{
              label: "Aplicações",
              data: this.ageApplicationsNumber,
              backgroundColor: this.randomColorAge,
              hoverBackgroundColor: this.randomColorAge,
              borderColor: this.randomColorAge,
              hoverBorderColor: this.randomColorAge,
              borderWidth: 1
            }],
          };
        });
      },
      error => {
        console.log(error);
        this.errorHandler.handleError(error);
      });
  }

  public getSipniIntegrationSituation() {
    this.applicationsDispatcherService.getSipniIntegrationSituation(this.month, this.year).subscribe(
      response => {
        response.forEach((element: any) => {
          this.integrationList.push(element.Situation);
          this.integrationApplicationsNumber.push(element.NumberOfIntegrations);
        });

        this.barChartApplicationIntegrationData = {
          labels: this.integrationList,
          datasets: [{
            data: this.integrationApplicationsNumber,
            backgroundColor: [
              '#1cc88a',
              '#e74a3b'
            ],
            hoverBackgroundColor: [
              '#1cc88a',
              '#e74a3b'
            ],
            hoverBorderColor: [
              '#1cc88a',
              '#e74a3b'
            ],
            circumference: 180,
            rotation: -90
          }]
        };
      },
      error => {
        console.log(error);
        this.errorHandler.handleError(error);
      });
  }

  public getApplicationNumbers() {
    this.applicationsDispatcherService.getApplicationNumbers(this.month, this.year).subscribe(
      response => {
        this.applicationsCompleted = response.ApplicationsCompleted;
        this.applicationsPending = response.ApplicationsPending;
      },
      error => {
        console.log(error);
        this.errorHandler.handleError(error);
      });
  }

  public getApplicationByType() {
    this.applicationsDispatcherService.getApplicationsByType(this.month, this.year).subscribe(
      response => {
        response.forEach((element: any) => {
          this.typeList.push(element.Type);
          this.typeApplicationsNumber.push(element.NumberOfApplications);
        });

        this.barChartApplicationTypeData = {
          labels: this.typeList,
          datasets: [{
            data: this.typeApplicationsNumber,
            backgroundColor: [
              '#36b9cc',
              '#858796'
            ],
            hoverBackgroundColor: [
              '#36b9cc',
              '#858796'
            ],
            circumference: 180,
            rotation: -90
          }]
        }
      },
      error => {
        console.log(error);
        this.errorHandler.handleError(error);
      });
  }

  public randomNum = () => Math.floor(Math.random() * (235 - 52 + 1) + 52);
  public randomRGB = () => `rgb(${this.randomNum()}, ${this.randomNum()}, ${this.randomNum()})`;

  public formatMonthDate(date: any) {
    const mapaMes = {
      "01": "JAN",
      "02": "FEV",
      "03": "MAR",
      "04": "ABR",
      "05": "MAI",
      "06": "JUN",
      "07": "JUL",
      "08": "AGO",
      "09": "SET",
      "10": "OUT",
      "11": "NOV",
      "12": "DEZ"
    }
    let dateFormated = this.formatDate(new Date(date));
    let arrayDate = dateFormated.split("/");
    return this.getFullNameMonthDate(arrayDate[1]);
  }

  public formatYearDate(date: Date) {
    return date.getFullYear();
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

  public getFullNameMonthDate(month: string) {

    let monthFormated = "";

    switch (month) {
      case '01': {
        monthFormated = 'JAN'
        break;
      }
      case '02': {
        monthFormated = 'FEV'
        break;
      }
      case '03': {
        monthFormated = 'MAR'
        break;
      }
      case '04': {
        monthFormated = 'ABR'
        break;
      }
      case '05': {
        monthFormated = 'MAI'
        break;
      }
      case '06': {
        monthFormated = 'JUN'
        break;
      }
      case '07': {
        monthFormated = 'JUL'
        break;
      }
      case '08': {
        monthFormated = 'AGO'
        break;
      }
      case '09': {
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

  reciveMonth(response: any) {
    this.clearLists();

    this.month = response.Month;
    this.year = response.Year;

    setTimeout(() => {
      this.getApplicationsByPersonGender();
      this.getApplicationsByProduct();
      this.getApplicationsByPersonAge();
      this.getSipniIntegrationSituation();
      this.getApplicationNumbers();
      this.getApplicationByType();
    }, 200);
  }

  public clearLists() {
    this.genderList = [];
    this.productList = [];
    this.ageList = [];
    this.integrationList = [];
    this.typeList = [];
    this.genderApplicationsNumber = [];
    this.productApplicationsNumber = [];
    this.ageApplicationsNumber = [];
    this.integrationApplicationsNumber = [];
    this.typeApplicationsNumber = [];
  }
}
