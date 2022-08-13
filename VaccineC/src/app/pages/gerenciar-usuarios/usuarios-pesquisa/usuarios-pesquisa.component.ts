import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-usuarios-pesquisa',
  templateUrl: './usuarios-pesquisa.component.html',
  styleUrls: ['./usuarios-pesquisa.component.scss']
})

export class UsuariosPesquisaComponent implements OnInit {
  value = '';

  displayedColumns: string[] = ['userEmail', 'userName', 'situation'];
  dataSource = ELEMENT_DATA;

  constructor() { }

  ngOnInit(): void {
  }

}

export interface UserElement {
  userEmail: string;
  userName: string;
  situation: string;
}

const ELEMENT_DATA: UserElement[] = [
  { userEmail: 'alinesantos@empresa.com', userName: 'ALINE SANTOS', situation: 'Ativa' },
  { userEmail: 'pedroalberto@empresa.com', userName: 'PEDRO ALBERTO', situation: 'Inativa' }
];
