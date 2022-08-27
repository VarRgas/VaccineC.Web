import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { of } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class PersonAutocompleteService {

    constructor(private http: HttpClient) { }
    opts = [];

    getPersonPhysicalData() {
        return this.opts.length ?
            of(this.opts) :
            this.http.get<any>(`http://localhost:5000/api/Persons/${"F"}/GetAllByType`).pipe(tap(data => this.opts = data))
    }

    getPersonJuridicallData() {
        return this.opts.length ?
            of(this.opts) :
            this.http.get<any>(`http://localhost:5000/api/Persons/${"J"}/GetAllByType`).pipe(tap(data => this.opts = data))
    }
}