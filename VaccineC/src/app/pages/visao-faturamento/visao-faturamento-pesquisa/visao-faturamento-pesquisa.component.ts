import { Component, OnInit, ViewChild } from '@angular/core';
import { ChartConfiguration, ChartData, ChartEvent, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import DataLabelsPlugin from 'chartjs-plugin-datalabels';

@Component({
  selector: 'app-visao-faturamento-pesquisa',
  templateUrl: './visao-faturamento-pesquisa.component.html',
  styleUrls: ['./visao-faturamento-pesquisa.component.scss']
})  
export class VisaoFaturamentoPesquisaComponent implements OnInit {

  @ViewChild(BaseChartDirective) chart: BaseChartDirective | undefined;

  longText = `Exemplo`;
  currentDate = '01/05/2022';
  endDate = '20/05/2022';
  invoicing = 'R$ 7.130,00';
  profitEstimate = 'R$ 7.870,00'

  constructor() { }

  ngOnInit(): void {

  }

  public barChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    scales: {
      x: {},
      y: {
        min: 10
      }
    },
    plugins: {
      legend: {
        display: false,
      },
      datalabels: {
        anchor: 'end',
        align: 'end'
      }
    }
  };
  public barChartType: ChartType = 'bar';
  public barChartPlugins = [
    DataLabelsPlugin
  ];

  public barChartData: ChartData<'bar'> = {
    labels: [ 'Janeiro', 'Fevereiro', 'Março', 'Abril'],
    datasets: [
      { data: [ 8500, 10000, 12020, 15000 ]},
    ]
  };

  // events
  public chartClicked({ event, active }: { event?: ChartEvent, active?: {}[] }): void {
    console.log(event, active);
  }

  public chartHovered({ event, active }: { event?: ChartEvent, active?: {}[] }): void {
    console.log(event, active);
  }

}
