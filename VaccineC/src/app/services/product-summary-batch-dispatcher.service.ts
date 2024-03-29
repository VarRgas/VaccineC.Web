import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

const baseURL = 'http://localhost:5000/api/ProductsSummariesBatches';

@Injectable({
    providedIn: 'root'
})

export class ProductsSummariesBatchesDispatcherService {

    constructor(private httpClient: HttpClient) { }

    public getAllProductsSummariesBatches(): Observable<any> {
        return this.httpClient.get(baseURL);
    }

    public getAllBatchsBelowMinimumStock(): Observable<any> {
      return this.httpClient.get(`${baseURL}/GetAllBelowMinimumStock`);
    }

    public getProductsSummariesBatchesById(id: string): Observable<any> {
        return this.httpClient.get(`${baseURL}/${id}`);
    }

    public getProductsSummariesBatchesByProductId(productsId: string): Observable<any> {
        return this.httpClient.get(`${baseURL}/${productsId}/GetAllByProductId`);
    }

    public getProductsSummariesBatchesByName(productId: string, name: string): Observable<any> {
        return this.httpClient.get(`${baseURL}/${productId}/${name}/GetProductSummaryBatchByName`);
    }

    public getNotEmptyProductSummaryBatchByProductId(productId: string): Observable<any> {
        return this.httpClient.get(`${baseURL}/${productId}/GetNotEmptyProductSummaryBatchByProductId`);
    }

    public getValidProductsSummariesBatchesByProductId(productId: string): Observable<any> {
        return this.httpClient.get(`${baseURL}/${productId}/GetValidProductsSummariesBatchesByProductId`);
    }

    public getNotEmptyProductsSummariesBatches(): Observable<any> {
        return this.httpClient.get(`${baseURL}/GetAllNotEmpty`);
    }
}
