import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

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

}
