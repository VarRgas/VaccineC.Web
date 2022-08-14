import { Component, OnInit } from '@angular/core';

export interface BudgetElement {
  budgetNumber: string;
  person: string;
  date: string;
  amount: string;
}

const ELEMENT_DATA: BudgetElement[] = [
  { budgetNumber: '11', person: 'JOÃO', date: '14/08/2022', amount: '300,00' },
  { budgetNumber: '12', person: 'MARIA', date: '15/08/2022', amount: '450,00' }
];

@Component({
  selector: 'app-orcamento-pesquisa',
  templateUrl: './orcamento-pesquisa.component.html',
  styleUrls: ['./orcamento-pesquisa.component.scss']
})
export class OrcamentoPesquisaComponent implements OnInit {

  value = '';

  displayedColumns: string[] = ['budgetNumber', 'person', 'date', 'amount'];
  dataSource = ELEMENT_DATA;

  constructor() { }

  ngOnInit(): void {
  }

}
