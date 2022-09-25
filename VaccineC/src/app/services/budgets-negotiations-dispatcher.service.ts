import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

const baseURL = 'http://localhost:5000/api/BudgetsNegotiations';

@Injectable({
    providedIn: 'root'
})

export class BudgetsNegotiationsDispatcherService {
    
    constructor(private httpClient: HttpClient) { }

    public getAllBudgetsNegotiations(): Observable<any> {
        return this.httpClient.get(baseURL);
    }

    public getBudgetNegotiationById(id: string): Observable<any> {
        return this.httpClient.get(`${baseURL}/${id}`);
    }

    public getBudgetsNegotiationsBudget(budgetId: string): Observable<any> {
        return this.httpClient.get(`${baseURL}/${budgetId}/GetBudgetsNegotiationsByBudget`);
    }

}
