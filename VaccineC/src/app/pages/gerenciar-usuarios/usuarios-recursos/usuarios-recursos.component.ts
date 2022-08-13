import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-usuarios-recursos',
  templateUrl: './usuarios-recursos.component.html',
  styleUrls: ['./usuarios-recursos.component.scss']
})

export class UsuariosRecursosComponent implements OnInit {
  value = '';

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
  { screens: 'AGENDAMENTO' },
  { screens: 'APLICAÇÃO' },
  { screens: 'PESSOAS' },
];
