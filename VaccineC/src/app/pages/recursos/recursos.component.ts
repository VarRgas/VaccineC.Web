import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-recursos',
  templateUrl: './recursos.component.html',
  styleUrls: ['./recursos.component.scss']
})

export class RecursosComponent implements OnInit {

  selected = new FormControl(0)
  
  constructor() { }

  ngOnInit(): void {
  }

}