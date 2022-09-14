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

    public getProductsDosesByProductId(productsId: string): Observable<any> {
        return this.httpClient.get(`${baseURL}/${productsId}/GetAllByProductId`);
    }

    public createProductDoses(data: object): Observable<any> {
      return this.httpClient.post(`${baseURL}/Create`, data);
    }
    public updateProductDoses(id: string, data: object): Observable<any> {
      return this.httpClient.put(`${baseURL}/${id}/Update`, data);
    }

    public deleteProductDoses(id: string): Observable<any> {
      return this.httpClient.delete(`${baseURL}/${id}/Delete`);
    }
}
