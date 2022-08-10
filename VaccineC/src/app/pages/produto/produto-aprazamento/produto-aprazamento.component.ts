import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

export interface ProductDoseElement {
  doseType: string;
  doseRangeMonth: string;
}

const ELEMENT_DATA: ProductDoseElement[] = [
  { doseType: 'DOSE 1', doseRangeMonth: '' },
  { doseType: 'DOSE 2', doseRangeMonth: '3'},
  { doseType: 'DOSE 3', doseRangeMonth: '5'},
  { doseType: 'DOSE DE REFORÇO', doseRangeMonth: ''},
];

@Component({
  selector: 'app-produto-aprazamento',
  templateUrl: './produto-aprazamento.component.html',
  styleUrls: ['./produto-aprazamento.component.scss']
})
export class ProdutoAprazamentoComponent implements OnInit {
  
  displayedColumns: string[] = ['doseType', 'doseRangeMonth'];
  dataSource = ELEMENT_DATA;

  constructor(public dialog: MatDialog) { }

  ngOnInit(): void {
  }

}
