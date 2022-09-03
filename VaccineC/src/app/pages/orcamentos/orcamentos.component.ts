import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-orcamentos',
  templateUrl: './orcamentos.component.html',
  styleUrls: ['./orcamentos.component.scss']
})
export class OrcamentosComponent implements OnInit {

  informationField!: string;

  constructor() { }

  ngOnInit(): void {
  }

}
