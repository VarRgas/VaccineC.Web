import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-formas-pagamento-pesquisa',
  templateUrl: './formas-pagamento-pesquisa.component.html',
  styleUrls: ['./formas-pagamento-pesquisa.component.scss']
})

export class FormasPagamentoPesquisaComponent implements OnInit {
  
  public displayedColumns: string[] = ['paymentForm', 'parcels'];
  public value = '';
  public value2 = '';
  public dataSource = ELEMENT_DATA;

  constructor() { }

  ngOnInit(): void {
  }

}

export interface PaymentFormElement {
  paymentForm: string;
  parcels: number;
}

const ELEMENT_DATA: PaymentFormElement[] = [
  { paymentForm: 'BOLETO', parcels: 1 },
  { paymentForm: 'CARTÃO DE CRÉDITO', parcels: 5 },
  { paymentForm: 'CARTÃO DE DÉBITO', parcels: 1 },
  { paymentForm: 'CHEQUE', parcels: 20 }
];
