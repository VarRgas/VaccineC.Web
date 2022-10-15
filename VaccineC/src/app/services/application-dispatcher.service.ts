import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

const baseURL = 'http://localhost:5000/api/Applications';

@Injectable({
    providedIn: 'root'
})

export class ApplicationsDispatcherService {
    constructor(private httpClient: HttpClient) { }

    public getAllApplications(): Observable<any> {
        return this.httpClient.get(baseURL);
    }

    public getApplicationById(id: string): Observable<any> {
        return this.httpClient.get(`${baseURL}/${id}`);
    }

    public getApplicationsByName(name: string): Observable<any> {
      return this.httpClient.get(`${baseURL}/${name}/GetByName`);
    }
}
