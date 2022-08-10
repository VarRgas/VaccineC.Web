import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

@Component({
  selector: 'app-produto-cadastro',
  templateUrl: './produto-cadastro.component.html',
  styleUrls: ['./produto-cadastro.component.scss']
})

export class ProdutoCadastroComponent implements OnInit {
  myControl = new FormControl('');
  options: string[] = ['BCG ID', 'FEBRE AMARELA', 'HEPATITE A','HEPATITE B','INFLUENZA (GRIPE)','PNEUMOCÓCICAS CONJUGADAS','ROTAVÍRUS','TRIPLÍCE BACTERIANA'];
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
