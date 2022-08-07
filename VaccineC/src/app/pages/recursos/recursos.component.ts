import { Component, OnInit } from '@angular/core';

export interface PeriodicElement {
  resourceName: string;
  resourceUrl: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  { resourceName: 'Pessoas', resourceUrl: 'https://vaccinec.com.br/pessoas' },
  { resourceName: 'Formas de Pagamentos', resourceUrl: 'https://vaccinec.com.br/formas-pagamento' }
];

@Component({
  selector: 'app-recursos',
  templateUrl: './recursos.component.html',
  styleUrls: ['./recursos.component.scss']
})
export class RecursosComponent implements OnInit {
  value = '';
  value2 = '';

  displayedColumns: string[] = ['resourceName', 'resourceUrl'];
  dataSource = ELEMENT_DATA;

  constructor() { }

  ngOnInit(): void {
  }

}
