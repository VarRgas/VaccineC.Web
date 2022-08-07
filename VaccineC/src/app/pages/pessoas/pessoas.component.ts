import { Component, OnInit } from '@angular/core';

export interface PeriodicElement {
  name: string;
  document: string;
  birthDate: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  { name: 'AMANDA', document: '123.456.789-10', birthDate: '07/03/1997' },
  { name: 'GUILHERME', document: '019.876.543-21', birthDate: '01/01/2000' }
];

@Component({
  selector: 'app-pessoas',
  templateUrl: './pessoas.component.html',
  styleUrls: ['./pessoas.component.scss']
})

export class PessoasComponent implements OnInit {
  value = '';
  value2 = '';

  displayedColumns: string[] = ['name', 'document', 'birthDate'];
  dataSource = ELEMENT_DATA;

  constructor() { }

  ngOnInit(): void {
  }
}