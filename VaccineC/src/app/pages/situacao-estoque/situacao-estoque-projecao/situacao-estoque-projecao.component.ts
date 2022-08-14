import { Component, OnInit } from '@angular/core';

export interface ProjectionElement {
  scheduling: string;
  date: string;
  product: string;
  quantityInStock: string;
  quantityAfterApplication: string;
}

const ELEMENT_DATA: ProjectionElement[] = [
  { scheduling: '10', date: '04/04/2022 as 14:00', product: 'VACINA INFLUENZA', quantityInStock: '34', quantityAfterApplication: '33' },
  { scheduling: '11', date: '04/04/2022 as 15:30', product: 'VACINA BCG', quantityInStock: '22', quantityAfterApplication: '21' },
];

@Component({
  selector: 'app-situacao-estoque-projecao',
  templateUrl: './situacao-estoque-projecao.component.html',
  styleUrls: ['./situacao-estoque-projecao.component.scss']
})

export class SituacaoEstoqueProjecaoComponent implements OnInit {

  value = '';

  displayedColumns: string[] = ['scheduling', 'date', 'product', 'quantityInStock', 'quantityAfterApplication'];
  dataSource = ELEMENT_DATA;

  constructor() { }

  ngOnInit(): void {
  }

}
