import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

const baseURL = 'http://localhost:5000/api/Companies';

@Injectable({
    providedIn: 'root'
})

export class CompaniesDispatcherService {

    constructor(private httpClient: HttpClient) { }

    public getAllCompanies(): Observable<any> {
        return this.httpClient.get(baseURL);
    }

    public getCompanyById(id: string): Observable<any> {
        return this.httpClient.get(`${baseURL}/${id}`);
    }

    public getCompanyByName(name: string): Observable<any> {
        return this.httpClient.get(`${baseURL}/${name}/GetByName`);
    }

    public createCompany(data: object): Observable<any> {
        return this.httpClient.post(`${baseURL}/Create`, data);
    }

    public updateCompany(id: string, data: object): Observable<any> {
        return this.httpClient.put(`${baseURL}/${id}/Update`, data);
    }

    public deleteCompany(id: string): Observable<any> {
        return this.httpClient.delete(`${baseURL}/${id}/Delete`);
    }
}
