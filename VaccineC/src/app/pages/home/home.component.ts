import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  public name!: string;

  constructor() { 
  }

  ngOnInit(): void {
    this.name = localStorage.getItem('name')!.split(" ")[0];
  }

}
