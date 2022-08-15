import { Component, OnInit } from '@angular/core';

export interface PersonElement {
  product: string;
  scheduling: string;
  date: string;
}

const ELEMENT_DATA: PersonElement[] = [
  { product: 'VACINA INFLUENZA', scheduling: '12345', date: '15/08/2022 10:30' },
  { product: 'VACINA BCG', scheduling: '67891', date: '16/08/2022 15:00' }
];


@Component({
  selector: 'app-aplicacao',
  templateUrl: './aplicacao.component.html',
  styleUrls: ['./aplicacao.component.scss']
})
export class AplicacaoComponent implements OnInit {
  value = '';

  displayedColumns: string[] = ['product', 'scheduling', 'date'];
  dataSource = ELEMENT_DATA;

  constructor() { }

  ngOnInit(): void {
  }

}
