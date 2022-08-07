import { Component, OnInit } from '@angular/core';

export interface PeriodicElement {
  paymentForm: string;
  parcels: number;
}

const ELEMENT_DATA: PeriodicElement[] = [
  { paymentForm: 'Boleto', parcels: 1},
  { paymentForm: 'Cartão de crédito', parcels: 5},
  { paymentForm: 'Cartão de débito', parcels: 1},
  { paymentForm: 'Cheque', parcels: 20}
];

@Component({
  selector: 'app-formas-pagamento',
  templateUrl: './formas-pagamento.component.html',
  styleUrls: ['./formas-pagamento.component.scss']
})
export class FormasPagamentoComponent implements OnInit {
  value = '';
  value2 = '';

  displayedColumns: string[] = ['paymentForm', 'parcels'];
  dataSource = ELEMENT_DATA;

  constructor() { }

  ngOnInit(): void {
  }

}
