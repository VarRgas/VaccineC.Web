import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

const baseURL = 'http://localhost:5000/api/BudgetsHistorics';

@Injectable({
    providedIn: 'root'
})

export class BudgetsHistoricsDispatcherService {

    constructor(private httpClient: HttpClient) { }

    public getAllBudgetsHistorics(): Observable<any> {
        return this.httpClient.get(baseURL);
    }

    public getBudgetHistoricById(id: string): Observable<any> {
        return this.httpClient.get(`${baseURL}/${id}`);
    }

    public getBudgetsHistoricsBudget(budgetId: string): Observable<any> {
        return this.httpClient.get(`${baseURL}/${budgetId}/GetBudgetsHistoricsByBudget`);
    }
    
}
