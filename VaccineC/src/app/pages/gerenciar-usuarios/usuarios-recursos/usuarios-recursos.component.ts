import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-usuarios-recursos',
  templateUrl: './usuarios-recursos.component.html',
  styleUrls: ['./usuarios-recursos.component.scss']
})

export class UsuariosRecursosComponent implements OnInit {
  value = '';
  value2 = '';

  displayedColumns: string[] = ['screens'];
  dataSource = ELEMENT_DATA;

  constructor() { }

  ngOnInit(): void {
  }

}

export interface resourcesElement {
  screens: string;
}

const ELEMENT_DATA: resourcesElement[] = [
  { screens: 'PESSOAS' },
  { screens: 'OUTRA TELA DE EXEMPLO' }
];
