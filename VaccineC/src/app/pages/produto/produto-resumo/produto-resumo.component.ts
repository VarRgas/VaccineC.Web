import { Component, OnInit } from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-produto-resumo',
  templateUrl: './produto-resumo.component.html',
  styleUrls: ['./produto-resumo.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],

})
export class ProdutoResumoComponent implements OnInit {
  
  dataSource = ELEMENT_DATA;
  columnsToDisplay = ['inventory', 'numberOfUnits'];
  columnsToDisplayWithExpand = [...this.columnsToDisplay, 'expand'];
  expandedElement: ProductSummaryElement | null | undefined;

  constructor() { }

  ngOnInit(): void {
  }

}

export interface ProductSummaryElement {
  inventory: string;
  numberOfUnits: number;
  description: string
}

const ELEMENT_DATA: ProductSummaryElement[] = [
  {
    inventory: 'LOCAL',
    numberOfUnits: 20,
    description: `Lote ABC12345 | Data de Fabricação 27/06/2022 | Data de Validade 30/10/2022 | Fabricante FLUARIX | Unidades 20`,
  },
  {
    inventory: 'LOCAL',
    numberOfUnits: 12,
    description: `Lote DEF678910 | Data de Fabricação 30/07/2022 | Data de Validade 30/10/2024 | Fabricante BUTANTAN | Unidades 12`,
 },
];