import { Component, Inject, OnInit } from '@angular/core';

@Component({
  selector: 'app-minha-conta',
  templateUrl: './minha-conta.component.html',
  styleUrls: ['./minha-conta.component.scss']
})
export class MinhaContaComponent implements OnInit {

  password: string | undefined;

  constructor() { }
  ngOnInit(): void {
    if (document.getElementById('sidebarToggle')?.classList.contains('withdrawn')) {
      document.getElementById('center')?.classList.add('container-expand');
      document.getElementById('center')?.classList.remove('container-retract');

    } else {
      document.getElementById('center')?.classList.add('container-retract');
      document.getElementById('center')?.classList.remove('container-expanded');

    }
  }

}
