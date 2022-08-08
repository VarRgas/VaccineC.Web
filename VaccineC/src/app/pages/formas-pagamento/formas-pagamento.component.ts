import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-formas-pagamento',
  templateUrl: './formas-pagamento.component.html',
  styleUrls: ['./formas-pagamento.component.scss']
})
export class FormasPagamentoComponent implements OnInit {

  public displayedColumns: string[] = ['paymentForm', 'parcels'];
  public value = '';
  public value2 = '';
  public dataSource = ELEMENT_DATA;

  constructor() { }

  ngOnInit(): void {
  }

}

export interface PeriodicElement {
  paymentForm: string;
  parcels: number;
}

const ELEMENT_DATA: PeriodicElement[] = [
  { paymentForm: 'BOLETO', parcels: 1 },
  { paymentForm: 'CARTÃO DE CRÉDITO', parcels: 5 },
  { paymentForm: 'CARTÃO DE DÉBITO', parcels: 1 },
  { paymentForm: 'CHEQUE', parcels: 20 }
];
