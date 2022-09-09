import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { of, tap } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class VaccinesAutocompleteDispatcherService {

  constructor(private http: HttpClient) { }
  opts = [];

  public getVaccinesAutocomplete() {
    return this.opts.length ?
      of(this.opts) :
      this.http.get<any>(`http://localhost:5000/api/Products/GetAllVaccinesAutocomplete`).pipe(tap(data => this.opts = data))
  }
}
