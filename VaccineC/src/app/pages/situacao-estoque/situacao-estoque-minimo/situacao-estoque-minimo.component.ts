import { Component, OnInit } from '@angular/core';

export interface InventoryElement {
  product: string;
  minimumStock: string;
  total: string;
}

const ELEMENT_DATA: InventoryElement[] = [
  { product: 'PNEUMOCÓCICA', minimumStock: '15', total: '2' },
  { product: 'VACINA BCG', minimumStock: '31', total: '5' }
];


@Component({
  selector: 'app-situacao-estoque-minimo',
  templateUrl: './situacao-estoque-minimo.component.html',
  styleUrls: ['./situacao-estoque-minimo.component.scss']
})

export class SituacaoEstoqueMinimoComponent implements OnInit {

  value = '';

  displayedColumns: string[] = ['product', 'minimumStock', 'total'];
  dataSource = ELEMENT_DATA;

  constructor() { }

  ngOnInit(): void {
  }

}
