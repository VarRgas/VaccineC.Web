import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-recursos-pesquisa',
  templateUrl: './recursos-pesquisa.component.html',
  styleUrls: ['./recursos-pesquisa.component.scss']
})
export class RecursosPesquisaComponent implements OnInit {
  
  public value = '';
  public value2 = '';
  public displayedColumns: string[] = ['resourceName', 'resourceUrl'];
  public dataSource = ELEMENT_DATA;

  constructor() { }

  ngOnInit(): void {
  }

}

export interface ResourceElement {
  resourceName: string;
  resourceUrl: string;
}

const ELEMENT_DATA: ResourceElement[] = [
  { resourceName: 'PESSOAS', resourceUrl: 'https://vaccinec.com.br/pessoas' },
  { resourceName: 'FORMAS PAGAMENTO', resourceUrl: 'https://vaccinec.com.br/formas-pagamento' }
];
