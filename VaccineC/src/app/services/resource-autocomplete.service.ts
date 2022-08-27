import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { of } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class ResourceAutocompleteService {

    constructor(private http: HttpClient) { }
    opts = [];

    getResourceData() {
        return this.opts.length ?
            of(this.opts) :
            this.http.get<any>('http://localhost:5000/api/Resources').pipe(tap(data => this.opts = data))
    }
}