import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

@Component({
  selector: 'app-usuarios-cadastro',
  templateUrl: './usuarios-cadastro.component.html',
  styleUrls: ['./usuarios-cadastro.component.scss']
})

export class UsuariosCadastroComponent implements OnInit {

  myControl = new FormControl('');
  options: string[] = ['AMANDA MASCHIO', 'GUILHERME SCARIOT VARGAS', 'JOÃO SILVA'];
  filteredOptions: Observable<string[]> | undefined;

  constructor() { }
  
  ngOnInit(): void {
    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value || '')),
    );
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.options.filter(option => option.toLowerCase().includes(filterValue));
  }
}
