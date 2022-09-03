import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-movimentar-estoque',
  templateUrl: './movimentar-estoque.component.html',
  styleUrls: ['./movimentar-estoque.component.scss']
})
export class MovimentarEstoqueComponent implements OnInit {

  informationField!: string;

  constructor() { }

  ngOnInit(): void {
  }

}
