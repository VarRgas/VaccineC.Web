import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-visao-faturamento-pesquisa',
  templateUrl: './visao-faturamento-pesquisa.component.html',
  styleUrls: ['./visao-faturamento-pesquisa.component.scss']
})
export class VisaoFaturamentoPesquisaComponent implements OnInit {

  longText = `Exemplo`;
  currentDate = '01/05/2022';
  endDate = '20/05/2022';
  invoicing = 'R$ 7.130,00';
  profitEstimate = 'R$ 7.870,00'

  constructor() { }

  ngOnInit(): void {
  }

}

