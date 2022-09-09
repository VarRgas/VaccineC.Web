import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

const baseURL = 'http://localhost:5000/api/Products';

@Injectable({
    providedIn: 'root'
})

export class ProductsDispatcherService {

    constructor(private httpClient: HttpClient) { }

    public getAllProducts(): Observable<any> {
        return this.httpClient.get(baseURL);
    }

    public getProductById(id: string): Observable<any> {
        return this.httpClient.get(`${baseURL}/${id}`);
    }

    public getProductsByName(name: string): Observable<any> {
        return this.httpClient.get(`${baseURL}/${name}/GetByName`);
    }

    public createProduct(data: object): Observable<any> {
        return this.httpClient.post(`${baseURL}/Create`, data);
    }

    public updateProduct(id: string, data: object): Observable<any> {
        return this.httpClient.put(`${baseURL}/${id}/Update`, data);
    }

    public deleteProduct(id: string): Observable<any> {
        return this.httpClient.delete(`${baseURL}/${id}/Delete`);
    }
}
