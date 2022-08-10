import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-usuarios-pesquisa',
  templateUrl: './usuarios-pesquisa.component.html',
  styleUrls: ['./usuarios-pesquisa.component.scss']
})

export class UsuariosPesquisaComponent implements OnInit {
  value = '';
  value2 = '';

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
  { userEmail: 'alinesantos@empresa.com', userName: 'Aline Santos', situation: 'Ativa' },
  { userEmail: 'pedroauberto@empresa.com', userName: 'Pedro Auberto', situation: 'Inativa' }
];
