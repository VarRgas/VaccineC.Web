import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { ListView } from '@fullcalendar/list';
import * as Chart from 'chart.js';
import { ChartOptions } from 'chart.js';
import { ChartConfiguration, ChartData, ChartEvent, ChartType, ControllerDatasetOptions } from 'chart.js';
import plugin from 'chartjs-plugin-datalabels';
import DataLabelsPlugin from 'chartjs-plugin-datalabels';
import { options } from 'preact';
import { ResourceModel } from 'src/app/models/resource-model';
import { ApplicationsDispatcherService } from 'src/app/services/application-dispatcher.service';
import { AuthorizationsDispatcherService } from 'src/app/services/authorization-dispatcher.service';
import { BudgetsDispatcherService } from 'src/app/services/budgets-dispatcher.service';
import { ErrorHandlerService } from 'src/app/services/error-handler.service';
import { MessageHandlerService } from 'src/app/services/message-handler.service';
import { UsersService } from 'src/app/services/user-dispatcher.service';
import { UserResourceService } from 'src/app/services/user-resource.service';


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
  smsSituationList = new Array<string>();
  budgetProductList = new Array<string>();
  invoicingList = new Array<string>();
  genderApplicationsNumber = new Array<number>();
  productApplicationsNumber = new Array<number>();
  ageApplicationsNumber = new Array<number>();
  typeApplicationsNumber = new Array<number>();
  integrationApplicationsNumber = new Array<number>();
  smsSituationNumber = new Array<number>();
  budgetProductNumber = new Array<number>();
  invoicingNumber = new Array<number>();
  randomColorProduct = new Array<string>();
  randomColorAge = new Array<string>();
  randomColorSms = new Array<string>();
  randomColorBudgetSituation = new Array<string>();
  randomColorBudgetProduct = new Array<string>();
  randomColorInvoicing = new Array<string>();

  //Authorizations
  authorizationScheduleNumber!: number;
  authorizationCanceledNumber!: number;
  authorizationConcludedNumber!: number;
  authorizationWithoutNotification!: number;
  authorizationWithNotification!: number;

  //Budgets
  budgetAprovedNumber!: number;
  budgetPendingNumber!: number;
  budgetCanceledNumber!: number;
  budgetOverduedNumber!: number;
  budgetFinalizedNumber!: number;
  budgetNegotiationNumber!: number;
  budgetPfNumber!: number;
  budgetPjNumber!: number;
  totalBudgetNumber!: number;
  totalBudgetNumberPrevious!: number;
  totalBudgetAmount!: number;
  totalBudgetAmountPrevious!: number;
  totalBudgetAmountLost!: number;
  totalBudgetAmountLostPrevious!: number;
  totalBudgetDiscount!: number;
  totalBudgetDiscountPrevious!: number;
  currentYear!: number;
  currentMonth!: string;
  totalBudgetAmountDecrease = 0;
  totalBudgetAmountDecreasePercent = 0;
  totalBudgetAmountIncrease = 0;
  totalBudgetAmountIncreasePercent = 0;
  phraseIncrease!: string;
  phraseDecrease!: string;
  showPhrase!: boolean;

  constructor(
    private applicationsDispatcherService: ApplicationsDispatcherService,
    private authorizationsDispatcherService: AuthorizationsDispatcherService,
    private budgetsDispatcherService: BudgetsDispatcherService,
    private errorHandler: ErrorHandlerService,
    private messageHandler: MessageHandlerService,
    private usersService: UsersService,
    private usersResourcesService: UserResourceService,
    private router: Router
  ) { }

  ngOnInit(): void {

    this.getUserPermision();
    this.updateUserResourceAccessNumber();

    setTimeout(() => {
      this.getApplicationsByPersonGender();
      this.getApplicationsByProduct();
      this.getApplicationsByPersonAge();
      this.getSipniIntegrationSituation();
      this.getApplicationNumbers();
      this.getApplicationByType();
      this.getAuthorizationsDashInfo();
      this.getBudgetsDashInfo();
      this.informationField = `${this.formatMonthDate(new Date())}/${this.formatYearDate(new Date())}`;
    }, 200);
  }

  public getUserPermision() {

    let resource = new ResourceModel();
    resource.urlName = this.router.url;
    resource.name = this.router.url;

    this.usersService.userPermission(localStorage.getItem('userId')!, resource).subscribe(
      response => {
        if (!response) {
          this.router.navigateByUrl('/unauthorized-error-401');
        }
      },
      error => {
        console.log(error);
        this.errorHandler.handleError(error);
      });
  }

  public updateUserResourceAccessNumber() {
    let resource = new ResourceModel();
    resource.urlName = this.router.url;
    resource.name = this.router.url;

    this.usersResourcesService.updateUserResourceAccessNumber(localStorage.getItem('userId')!, resource).subscribe(
      response => {

      },
      error => {
        console.log(error);
        this.errorHandler.handleError(error);
      });

  }

  public barChartApplicationGenderType: ChartType = 'doughnut';
  public barChartApplicationGenderPlugins = [
  ];
  public barChartApplicationGenderData: ChartData<'doughnut'> = {
    labels: [],
    datasets: [{
      data: [],
      backgroundColor: [],
      hoverBackgroundColor: [],
      circumference: 180,
      rotation: -90
    }]
  };


  public barChartApplicationTypeType: ChartType = 'doughnut';
  public barChartApplicationTypePlugins = [
  ];
  public barChartApplicationTypeData: ChartData<'doughnut'> = {
    labels: [],
    datasets: [{
      data: [],
      backgroundColor: [],
      hoverBackgroundColor: [],
      hoverBorderColor: [],
      circumference: 180,
      rotation: -90
    }]
  };


  public barChartApplicationAgeType: ChartType = 'bar';
  public barChartApplicationAgePlugins = [];
  public barChartApplicationAgeData: ChartData<'bar'> = {
    labels: [],
    datasets: [{
      data: [],
      backgroundColor: [],
      hoverBackgroundColor: [],
      borderColor: [],
      hoverBorderColor: [],
      borderWidth: 1,
      maxBarThickness: 70,
      minBarLength: 10
    }],
  };

  public barChartInvoicingType: ChartType = 'bar';
  public barChartInvoicingPlugins = [];
  public barChartInvoicingData: ChartData<'bar'> = {
    labels: [],
    datasets: [{
      data: [],
      backgroundColor: [],
      hoverBackgroundColor: [],
      borderColor: [],
      hoverBorderColor: [],
      borderWidth: 1,
      maxBarThickness: 70
    }],
  };


  public barChartApplicationProductType: ChartType = 'bar';
  public barChartApplicationProductPlugins = [];
  public barChartApplicationProductData: ChartData<'bar'> = {
    labels: this.productList,
    datasets: [{
      data: [],
      backgroundColor: [],
      hoverBackgroundColor: [],
      borderColor: [],
      hoverBorderColor: [],
      borderWidth: 1,
      maxBarThickness: 70,
      minBarLength: 10
    }]
  };


  public barChartApplicationIntegrationType: ChartType = 'doughnut';
  public barChartApplicationIntegrationPlugins = [];
  public barChartApplicationIntegrationData: ChartData<'doughnut'> = {
    labels: [],
    datasets: [{
      data: [],
      backgroundColor: [],
      hoverBackgroundColor: [],
      hoverBorderColor: [],
      circumference: 180,
      rotation: -90
    }]
  };


  public barChartAuthorizationNotificationType: ChartType = 'doughnut';
  public barChartAuthorizationNotificationPlugins = [
  ];
  public barChartAuthorizationNotificationData: ChartData<'doughnut'> = {
    labels: ['Notificação Ativada', 'Notificação Desativada'],
    datasets: [{
      data: [this.authorizationWithNotification, this.authorizationWithoutNotification],
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


  public barChartAuthotizationSmsType: ChartType = 'bar';
  public barChartAuthotizationSmsPlugins = [];
  public barChartAuthotizationSmsData: ChartData<'bar'> = {
    labels: this.smsSituationList,
    datasets: [{
      data: this.smsSituationNumber,
      backgroundColor: this.randomColorSms,
      hoverBackgroundColor: this.randomColorSms,
      borderColor: this.randomColorSms,
      hoverBorderColor: this.randomColorSms,
      borderWidth: 1,
      barPercentage: 0.4,
      maxBarThickness: 70,
      minBarLength: 10
    }]
  };



  public barChartBudgetSituationType: ChartType = 'doughnut';
  public barChartBudgetSituationPlugins = [];
  public barChartBudgetSituationData: ChartData<'doughnut'> = {
    labels: ['Aprovado', 'Pendente', 'Cancelado', 'Vencido', 'Finalizado', 'Em Negociação'],
    datasets: [{
      data: [this.budgetAprovedNumber, this.budgetPendingNumber, this.budgetCanceledNumber, this.budgetOverduedNumber, this.budgetFinalizedNumber, this.budgetNegotiationNumber],
      backgroundColor: [
        '#8AA29E',
        '#686963',
        '#DB5461',
        '#3D5467',
        '#9AD2CB',
        '#141B41'
      ],
      hoverBackgroundColor: [
        '#8AA29E',
        '#686963',
        '#DB5461',
        '#3D5467',
        '#9AD2CB',
        '#141B41'
      ],
      hoverBorderColor: [
        '#8AA29E',
        '#686963',
        '#DB5461',
        '#3D5467',
        '#9AD2CB',
        '#141B41'
      ],
      circumference: 180,
      rotation: -90,
    }]
  };


  public barChartBudgetPersonType: ChartType = 'doughnut';
  public barChartBudgetPersonPlugins = [
  ];
  public barChartBudgetPersonData: ChartData<'doughnut'> = {
    labels: ['Pessoa Física', 'Pessoa Jurídica'],
    datasets: [{
      data: [this.budgetPfNumber, this.budgetPjNumber],
      backgroundColor: [
        '#F0B67F',
        '#FE5F55'
      ],
      hoverBackgroundColor: [
        '#F0B67F',
        '#FE5F55'
      ],
      hoverBorderColor: [
        '#F0B67F',
        '#FE5F55'
      ],
      circumference: 180,
      rotation: -90
    }]
  };

  public barChartBudgetProductType: ChartType = 'doughnut';
  public barChartBudgetProductPlugins = [
  ];
  public barChartBudgetProductData: ChartData<'doughnut'> = {
    labels: this.budgetProductList,
    datasets: [{
      data: this.budgetProductNumber,
      backgroundColor: this.randomColorBudgetProduct,
      hoverBackgroundColor: this.randomColorBudgetProduct,
      hoverBorderColor: this.randomColorBudgetProduct,
      circumference: 180,
      rotation: -90
    }]
  };

  public getApplicationsByPersonGender() {
    this.applicationsDispatcherService.getApplicationsByPersonGender(this.month, this.year).subscribe(
      response => {

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
            borderWidth: 1,
            maxBarThickness: 70,
            minBarLength: 10
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
              borderWidth: 1,
              maxBarThickness: 70,
              minBarLength: 10
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
            hoverBorderColor: [
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

  public getAuthorizationsDashInfo() {
    this.authorizationsDispatcherService.getAuthorizationsDashInfo(this.month, this.year).subscribe(
      response => {

        this.authorizationCanceledNumber = response.AuthorizationCanceledNumber;
        this.authorizationScheduleNumber = response.AuthorizationScheduleNumber;
        this.authorizationConcludedNumber = response.AuthorizationConcludedNumber;
        this.authorizationWithNotification = response.AuthorizationsWithNotification;
        this.authorizationWithoutNotification = response.AuthorizationsWithoutNotification;

        this.barChartAuthorizationNotificationData = {
          labels: ['Notificação Ativada', 'Notificação Desativada'],
          datasets: [{
            data: [this.authorizationWithNotification, this.authorizationWithoutNotification],
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

        response.authorizationNotificationDashInfos.forEach((element: any) => {
          if (element.Quantity > 0) {
            this.smsSituationList.push(element.Description);
            this.smsSituationNumber.push(element.Quantity);
            this.randomColorSms.push(this.randomRGB());
          }
        });

        this.barChartAuthotizationSmsData = {
          labels: this.smsSituationList,
          datasets: [{
            data: this.smsSituationNumber,
            backgroundColor: this.randomColorSms,
            hoverBackgroundColor: this.randomColorSms,
            borderColor: this.randomColorSms,
            hoverBorderColor: this.randomColorSms,
            borderWidth: 1,
            maxBarThickness: 70,
            minBarLength: 10
          }]
        };
      },
      error => {
        console.log(error);
        this.errorHandler.handleError(error);
      });
  }

  public getBudgetsDashInfo() {
    this.budgetsDispatcherService.getBudgetsDashInfo(this.month, this.year).subscribe(
      response => {
        console.log(response)
        this.budgetAprovedNumber = response.budgetAprovedNumber;
        this.budgetPendingNumber = response.budgetPendingNumber;
        this.budgetCanceledNumber = response.budgetCanceledNumber;
        this.budgetOverduedNumber = response.budgetOverduedNumber;
        this.budgetFinalizedNumber = response.budgetFinalizedNumber;
        this.budgetNegotiationNumber = response.budgetNegotiationNumber;
        this.budgetPfNumber = response.personPhysicalNumber;
        this.budgetPjNumber = response.personJuridicalNumber;
        this.totalBudgetNumber = response.totalBudgetNumber;
        this.totalBudgetNumberPrevious = response.totalBudgetNumberPrevious;
        this.totalBudgetAmount = response.totalBudgetAmount;
        this.totalBudgetAmountPrevious = response.totalBudgetAmountPrevious;
        this.totalBudgetAmountLost = response.totalBudgetAmountLost;
        this.totalBudgetAmountLostPrevious = response.totalBudgetAmountLostPrevious;
        this.totalBudgetDiscount = response.totalBudgetDiscount;
        this.totalBudgetDiscountPrevious = response.totalBudgetDiscountPrevious;
        this.currentYear = response.year;
        this.currentMonth = this.getFullNameMonthDateInt(response.month);

        if (response.totalBudgetAmountDecrease < 0 && response.totalBudgetAmountDecreasePercent < 0) {
          this.phraseDecrease = `Decréscimo de: ${Math.abs(response.totalBudgetAmountDecrease).toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })} (${Math.abs(Math.trunc(response.totalBudgetAmountDecreasePercent))}%)`;
          this.showPhrase = false;
        } else if (response.totalBudgetAmountIncrease > 0 && response.totalBudgetAmountIncreasePercent > 0) {
          this.phraseIncrease = `Acréscimo de: ${response.totalBudgetAmountIncrease.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })} (${Math.trunc(response.totalBudgetAmountIncreasePercent)}%)`;
          this.showPhrase = true;
        } else {
          this.phraseDecrease = "";
          this.phraseIncrease = "";
        }

        response.listProductBudgetDashInfoViewModel.forEach((element: any) => {
          this.budgetProductList.push(element.Name);
          this.budgetProductNumber.push(element.Quantity);
          this.randomColorBudgetProduct.push(this.randomRGB());
        });

        response.listBudgetProfitMonthViewModel.forEach((element: any) => {
          this.invoicingList.push(this.getFullNameMonthDateInt(element.Month));
          this.invoicingNumber.push(element.Amount);
          this.randomColorInvoicing.push(this.randomRGB());
        });

        this.barChartBudgetSituationData = {
          labels: ['Aprovado', 'Pendente', 'Cancelado', 'Vencido', 'Finalizado', 'Em Negociação'],
          datasets: [{
            data: [this.budgetAprovedNumber, this.budgetPendingNumber, this.budgetCanceledNumber, this.budgetOverduedNumber, this.budgetFinalizedNumber, this.budgetNegotiationNumber],
            backgroundColor: [
              '#8AA29E',
              '#686963',
              '#DB5461',
              '#3D5467',
              '#9AD2CB',
              '#141B41'
            ],
            hoverBackgroundColor: [
              '#8AA29E',
              '#686963',
              '#DB5461',
              '#3D5467',
              '#9AD2CB',
              '#141B41'
            ],
            hoverBorderColor: [
              '#8AA29E',
              '#686963',
              '#DB5461',
              '#3D5467',
              '#9AD2CB',
              '#141B41'
            ],
            circumference: 180,
            rotation: -90
          }]
        }

        this.barChartBudgetPersonData = {
          labels: ['Pessoa Física', 'Pessoa Jurídica'],
          datasets: [{
            data: [this.budgetPfNumber, this.budgetPjNumber],
            backgroundColor: [
              '#F0B67F',
              '#FE5F55'
            ],
            hoverBackgroundColor: [
              '#F0B67F',
              '#FE5F55'
            ],
            hoverBorderColor: [
              '#F0B67F',
              '#FE5F55'
            ],
            circumference: 180,
            rotation: -90
          }]
        };

        this.barChartBudgetProductData = {
          labels: this.budgetProductList,
          datasets: [{
            data: this.budgetProductNumber,
            backgroundColor: this.randomColorBudgetProduct,
            hoverBackgroundColor: this.randomColorBudgetProduct,
            hoverBorderColor: this.randomColorBudgetProduct,
            circumference: 180,
            rotation: -90
          },]
        };

        this.barChartInvoicingData = {
          labels: this.invoicingList,
          datasets: [{
            data: this.invoicingNumber,
            backgroundColor: this.randomColorInvoicing,
            hoverBackgroundColor: this.randomColorInvoicing,
            borderColor: this.randomColorInvoicing,
            hoverBorderColor: this.randomColorInvoicing,
            borderWidth: 1,
            maxBarThickness: 70
          }],
        };
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

  public getFullNameMonthDateInt(month: number) {

    let monthFormated = "";

    switch (month) {
      case 1: {
        monthFormated = 'JAN'
        break;
      }
      case 2: {
        monthFormated = 'FEV'
        break;
      }
      case 3: {
        monthFormated = 'MAR'
        break;
      }
      case 4: {
        monthFormated = 'ABR'
        break;
      }
      case 5: {
        monthFormated = 'MAI'
        break;
      }
      case 6: {
        monthFormated = 'JUN'
        break;
      }
      case 7: {
        monthFormated = 'JUL'
        break;
      }
      case 8: {
        monthFormated = 'AGO'
        break;
      }
      case 9: {
        monthFormated = 'SET'
        break;
      }
      case 10: {
        monthFormated = 'OUT'
        break;
      }
      case 11: {
        monthFormated = 'NOV'
        break;
      }
      case 12: {
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
      this.getAuthorizationsDashInfo();
      this.getBudgetsDashInfo();
    }, 200);
  }

  public clearLists() {
    this.genderList = [];
    this.productList = [];
    this.ageList = [];
    this.integrationList = [];
    this.typeList = [];
    this.smsSituationList = [];
    this.budgetProductList = [];
    this.invoicingList = [];
    this.genderApplicationsNumber = [];
    this.productApplicationsNumber = [];
    this.ageApplicationsNumber = [];
    this.integrationApplicationsNumber = [];
    this.typeApplicationsNumber = [];
    this.smsSituationNumber = [];
    this.budgetProductNumber = [];
    this.invoicingNumber = [];
  }
}
