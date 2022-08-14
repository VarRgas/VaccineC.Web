import { Component, OnInit } from '@angular/core';

export interface BatchElement {
  product: string;
  batch: string;
  validity: string;
}

const ELEMENT_DATA: BatchElement[] = [
  { product: 'VACINA INFLUENZA', batch: 'A1B2C3', validity: '13/09/2022' },
  { product: 'VACINA BCG', batch: 'D4E5F6', validity: '13/10/2022' }
];

@Component({
  selector: 'app-situacao-estoque-lotes',
  templateUrl: './situacao-estoque-lotes.component.html',
  styleUrls: ['./situacao-estoque-lotes.component.scss']
})

export class SituacaoEstoqueLotesComponent implements OnInit {

  value = '';

  displayedColumns: string[] = ['product', 'batch', 'validity'];
  dataSource = ELEMENT_DATA;

  constructor() { }

  ngOnInit(): void {
  }

}
