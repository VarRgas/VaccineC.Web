import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BudgetProductModel } from '../models/budget-product-model';

const baseURL = 'http://localhost:5000/api/BudgetsProducts';

@Injectable({
    providedIn: 'root'
})

export class BudgetsProductsDispatcherService {

    constructor(private httpClient: HttpClient) { }

    public getAllBudgetsProducts(): Observable<any> {
        return this.httpClient.get(baseURL);
    }

    public getBudgetProductById(id: string): Observable<any> {
        return this.httpClient.get(`${baseURL}/${id}`);
    }

    public getBudgetsProductsBudget(budgetId: string): Observable<any> {
        return this.httpClient.get(`${baseURL}/${budgetId}/GetBudgetsProductsByBudget`);
    }

    public createBudgetProduct(data: object): Observable<any> {
        return this.httpClient.post(`${baseURL}/Create`, data);
    }

    public createOnDemand(data: BudgetProductModel[]): Observable<any> {
        return this.httpClient.post(`${baseURL}/CreateOnDemand`, data);
    }

    public updateBudgetProduct(id: string, data: object): Observable<any> {
        return this.httpClient.put(`${baseURL}/${id}/Update`, data);
    }

    public deleteBudgetProduct(id: string): Observable<any> {
        return this.httpClient.delete(`${baseURL}/${id}/Delete`);
    }

}