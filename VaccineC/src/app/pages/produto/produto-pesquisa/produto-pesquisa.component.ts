import { Component, OnInit } from '@angular/core';

export interface ProductElement {
  name: string;
  saleValue: number;
}

const ELEMENT_DATA: ProductElement[] = [
  { name: 'VACINA BCG', saleValue: 100.00 },
  { name: 'VACINA INFLUENZA', saleValue: 150.00}
];

@Component({
  selector: 'app-produto-pesquisa',
  templateUrl: './produto-pesquisa.component.html',
  styleUrls: ['./produto-pesquisa.component.scss']
})
export class ProdutoPesquisaComponent implements OnInit {
  value = '';
  displayedColumns: string[] = ['name', 'saleValue'];
  dataSource = ELEMENT_DATA;
 
  constructor() { }

  ngOnInit(): void {
  }

}
