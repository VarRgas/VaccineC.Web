import { Component, OnInit } from '@angular/core';
@Component({
  selector: 'app-recursos',
  templateUrl: './recursos.component.html',
  styleUrls: ['./recursos.component.scss']
})
export class RecursosComponent implements OnInit {
  public value = '';
  public value2 = '';
  public displayedColumns: string[] = ['resourceName', 'resourceUrl'];
  public dataSource = ELEMENT_DATA;

  constructor() { }

  ngOnInit(): void {
  }

}

export interface PeriodicElement {
  resourceName: string;
  resourceUrl: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  { resourceName: 'PESSOAS', resourceUrl: 'https://vaccinec.com.br/pessoas' },
  { resourceName: 'FORMAS PAGAMENTO', resourceUrl: 'https://vaccinec.com.br/formas-pagamento' }
];
