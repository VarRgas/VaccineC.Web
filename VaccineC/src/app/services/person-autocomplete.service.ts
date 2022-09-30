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

    getAllPersonData() {
        return this.opts.length ?
            of(this.opts) :
            this.http.get<any>(`http://localhost:5000/api/Persons`).pipe(tap(data => this.opts = data))
    }

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

    getPersonUserAutocomplete() {
        return this.opts.length ?
            of(this.opts) :
            this.http.get<any>(`http://localhost:5000/api/Persons/GetAllUserAutocomplete`).pipe(tap(data => this.opts = data))
    }

    getPersonCompanyAutocomplete() {
        return this.opts.length ?
            of(this.opts) :
            this.http.get<any>(`http://localhost:5000/api/Persons/GetAllCompanyAutocomplete`).pipe(tap(data => this.opts = data))
    }
}