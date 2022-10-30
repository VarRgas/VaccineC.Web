import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
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

  //Applications
  informationField!: string;
  applicationsCompleted!: number;
  applicationsPending!: number;
  genderList = new Array<string>();
  productList = new Array<string>();
  ageList = new Array<string>();
  integrationList = new Array<string>();
  genderApplicationsNumber = new Array<number>();
  productApplicationsNumber = new Array<number>();
  ageApplicationsNumber = new Array<number>();
  integrationApplicationsNumber = new Array<number>();
  randomColorProduct = new Array<string>();

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
        'rgb(54, 162, 235)',
        'rgb(133, 135, 150)'
      ],
      hoverBackgroundColor: [
        'rgb(255, 99, 132)',
        'rgb(54, 162, 235)',
        'rgb(133, 135, 150)'
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
      backgroundColor: [
        'rgba(255, 99, 132)',
        'rgba(255, 159, 64)',
        'rgba(255, 205, 86)',
        'rgba(75, 192, 192)',
        'rgba(54, 162, 235)',
        'rgba(153, 102, 255)',
        'rgba(201, 203, 207)',
        'rgba(54, 162, 235)'
      ],
      hoverBackgroundColor: [
        'rgba(255, 99, 132)',
        'rgba(255, 159, 64)',
        'rgba(255, 205, 86)',
        'rgba(75, 192, 192)',
        'rgba(54, 162, 235)',
        'rgba(153, 102, 255)',
        'rgba(201, 203, 207)',
        'rgba(54, 162, 235)'
      ],
      borderColor: [
        'rgba(255, 99, 132)',
        'rgba(255, 159, 64)',
        'rgba(255, 205, 86)',
        'rgba(75, 192, 192)',
        'rgba(54, 162, 235)',
        'rgba(153, 102, 255)',
        'rgba(201, 203, 207)',
        'rgba(54, 162, 235)'
      ],
      hoverBorderColor: [
        'rgba(255, 99, 132)',
        'rgba(255, 159, 64)',
        'rgba(255, 205, 86)',
        'rgba(75, 192, 192)',
        'rgba(54, 162, 235)',
        'rgba(153, 102, 255)',
        'rgba(201, 203, 207)',
        'rgba(54, 162, 235)'
      ],
      borderWidth: 1
    }],
  };


  public barChartApplicationProductType: ChartType = 'doughnut';
  public barChartApplicationProductPlugins = [];
  public barChartApplicationProductData: ChartData<'doughnut'> = {
    labels: this.productList,
    datasets: [{
      data: this.productApplicationsNumber,
      backgroundColor: this.randomColorProduct,
      hoverBackgroundColor: this.randomColorProduct,
      hoverBorderColor: this.randomColorProduct,
      circumference: 180,
      rotation: -90

    }]
  };


  public barChartApplicationIntegrationType: ChartType = 'doughnut';
  public barChartApplicationIntegrationPlugins = [];
  public barChartApplicationIntegrationData: ChartData<'doughnut'> = {
    labels: this.integrationList,
    datasets: [{
      data: this.integrationApplicationsNumber,
      backgroundColor: [
        'rgb(25, 135, 84)',
        'rgb(220, 53, 69)'
      ],
      hoverBackgroundColor: [
        'rgb(25, 135, 84)',
        'rgb(220, 53, 69)'
      ],
      hoverBorderColor: [
        'rgb(25, 135, 84)',
        'rgb(220, 53, 69)'
      ],
      circumference: 180,
      rotation: -90
    }]
  };

  public getApplicationsByPersonGender() {
    this.applicationsDispatcherService.getApplicationsByPersonGender(10, 2022).subscribe(
      response => {
        response.forEach((element: any) => {
          this.genderList.push(element.Gender);
          this.genderApplicationsNumber.push(element.NumberOfApplications);
        });
      },
      error => {
        console.log(error);
        this.errorHandler.handleError(error);
      });
  }

  public getApplicationsByProduct() {
    this.applicationsDispatcherService.getApplicationsByProduct(10, 2022).subscribe(
      response => {
        response.forEach((element: any) => {
          this.productList.push(element.ProductName);
          this.productApplicationsNumber.push(element.NumberOfApplications);
          this.randomColorProduct.push(this.randomRGB());
        });
      },
      error => {
        console.log(error);
        this.errorHandler.handleError(error);
      });
  }

  public getApplicationsByPersonAge() {
    this.applicationsDispatcherService.getApplicationsByPersonAge(10, 2022).subscribe(
      response => {
        response.forEach((element: any) => {
          if(element.NumberOfApplications > 0){
            this.ageList.push(element.AgeInterval);
            this.ageApplicationsNumber.push(element.NumberOfApplications);
          }
        });
      },
      error => {
        console.log(error);
        this.errorHandler.handleError(error);
      });
  }

  public getSipniIntegrationSituation() {
    this.applicationsDispatcherService.getSipniIntegrationSituation(10, 2022).subscribe(
      response => {
        response.forEach((element: any) => {
          this.integrationList.push(element.Situation);
          this.integrationApplicationsNumber.push(element.NumberOfIntegrations);
        });
      },
      error => {
        console.log(error);
        this.errorHandler.handleError(error);
      });
  }

  public getApplicationNumbers() {
    this.applicationsDispatcherService.getApplicationNumbers(10, 2022).subscribe(
      response => {
        this.applicationsCompleted = response.ApplicationsCompleted;
        this.applicationsPending = response.ApplicationsPending;
      },
      error => {
        console.log(error);
        this.errorHandler.handleError(error);
      });
  }

  public randomNum = () => Math.floor(Math.random() * (235 - 52 + 1) + 52);
  public randomRGB = () => `rgb(${this.randomNum()}, ${this.randomNum()}, ${this.randomNum()})`;
}
