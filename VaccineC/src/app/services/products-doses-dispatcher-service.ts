import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

const baseURL = 'http://localhost:5000/api/ProductsDoses';

@Injectable({
    providedIn: 'root'
})

export class ProductsDosesDispatcherService {

    constructor(private httpClient: HttpClient) { }

    public getAllProductsDoses(): Observable<any> {
        return this.httpClient.get(baseURL);
    }

    public getProductDosesById(id: string): Observable<any> {
        return this.httpClient.get(`${baseURL}/${id}`);
    }

    public getProductsDosesByType(doseType: string): Observable<any> {
        return this.httpClient.get(`${baseURL}/${doseType}/GetByType`);
    }
}
