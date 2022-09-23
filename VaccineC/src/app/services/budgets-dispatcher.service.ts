import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

const baseURL = 'http://localhost:5000/api/Budgets';

@Injectable({
    providedIn: 'root'
})

export class BudgetsDispatcherService {
    constructor(private httpClient: HttpClient) { }

    public getAllBudgets(): Observable<any> {
        return this.httpClient.get(baseURL);
    }

    public getBudgetsByPersonName(personName: string): Observable<any> {
      return this.httpClient.get(`${baseURL}/${personName}/GetByPersonName`);
    }
}
