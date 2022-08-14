import { Component, OnInit } from '@angular/core';

export interface MovementElement {
  movement: string;
  operation: string;
  product: string;
  date: string;
  amount: string;
}

const ELEMENT_DATA: MovementElement[] = [
  { movement: '123', operation: 'ENTRADA', product: 'VACINA INFLUENZA', date: '07/03/2022', amount: '100,00' },
  { movement: '456', operation: 'SAÍDA', product: 'VACINA BCG', date: '10/10/2022', amount: '150,00' },
];

@Component({
  selector: 'app-movimentar-estoque-pesquisa',
  templateUrl: './movimentar-estoque-pesquisa.component.html',
  styleUrls: ['./movimentar-estoque-pesquisa.component.scss']
})
export class MovimentarEstoquePesquisaComponent implements OnInit {

  value = '';

  displayedColumns: string[] = ['movement', 'operation', 'product', 'date', 'amount'];
  dataSource = ELEMENT_DATA;

  constructor() { }

  ngOnInit(): void {
  }

}
