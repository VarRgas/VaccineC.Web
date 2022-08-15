import { Component, OnInit } from '@angular/core';

export interface PersonElement {
  imageUrl: string;
  pacient: string;
  date: string;
}

const ELEMENT_DATA: PersonElement[] = [
  { imageUrl: '../../../../assets/img/undraw_profile.svg', pacient: 'JOÃO ALMEIDA', date: '15/08/2022 as 10:00'},
  { imageUrl: '../../../../assets/img/undraw_profile_3.svg', pacient: 'MARIA DA SILVA', date: '15/08/2022 as 10:10'}
];


@Component({
  selector: 'app-aplicacao-pesquisa',
  templateUrl: './aplicacao-pesquisa.component.html',
  styleUrls: ['./aplicacao-pesquisa.component.scss']
})
export class AplicacaoPesquisaComponent implements OnInit {

  value = '';

  displayedColumns: string[] = ['imageUrl','pacient', 'date'];
  dataSource = ELEMENT_DATA;

  constructor() { }

  ngOnInit(): void {
  }

}
