import { HttpClient } from '@angular/common/http';
import { Component, Injectable, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable, of, Subscription } from 'rxjs';
import { tap, startWith, debounceTime, distinctUntilChanged, switchMap, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class Service {
  constructor(private http: HttpClient) { }

  opts = [];

  getData() {
    return this.opts.length ?
      of(this.opts) :
      this.http.get<any>('http://localhost:5000/api/Resources').pipe(tap(data => this.opts = data))
    }
}


@Component({
  selector: 'app-empresa-cadastro',
  templateUrl: './empresa-cadastro.component.html',
  styleUrls: ['./empresa-cadastro.component.scss']
})
export class EmpresaCadastroComponent implements OnInit {

  myControl = new FormControl();
  options: string[] = [];
  filteredOptions: Observable<any[]> | undefined;

  constructor(private service: Service) {
    this.filteredOptions = this.myControl.valueChanges.pipe(
     startWith(''),
     debounceTime(400),
     distinctUntilChanged(),
     switchMap(val => {
           return this.filter(val || '')
      }) 
   )
  }

 ngOnInit() {
  
 }

 filter(val: string): Observable<any[]> {
   // call the service which makes the http-request
   return this.service.getData()
    .pipe(
      map(response => response.filter((option: { Name: string; }) => { 
        return option.Name.toLowerCase().indexOf(val.toLowerCase()) === 0
      }))
    )
  }  
}
