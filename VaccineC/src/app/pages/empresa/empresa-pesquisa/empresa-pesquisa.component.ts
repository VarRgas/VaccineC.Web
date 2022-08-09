import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-empresa-pesquisa',
  templateUrl: './empresa-pesquisa.component.html',
  styleUrls: ['./empresa-pesquisa.component.scss']
})
export class EmpresaPesquisaComponent implements OnInit {
  value = '';
  value2 = '';

  displayedColumns: string[] = ['name'];
  dataSource = ELEMENT_DATA;

  constructor() { }

  ngOnInit(): void {
  }

}

export interface PersonElement {
  name: string;
}

const ELEMENT_DATA: PersonElement[] = [
  { name: 'EMPRESA EXEMPLO LTDA' },
];
