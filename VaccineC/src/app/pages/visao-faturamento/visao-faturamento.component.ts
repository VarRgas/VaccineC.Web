import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-visao-faturamento',
  templateUrl: './visao-faturamento.component.html',
  styleUrls: ['./visao-faturamento.component.scss']
})
export class VisaoFaturamentoComponent implements OnInit {
  longText = `Exemplo`;
  currentDate = '01/05/2022';
  endDate = '20/05/2022';
  invoicing = 'R$ 7.130,00';
  profitEstimate = 'R$ 7.870,00'

  constructor() { }

  ngOnInit(): void {
  }

}
