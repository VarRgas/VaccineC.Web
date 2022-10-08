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

    public getBudgetsByBorrower(borrowerId: string): Observable<any> {
      return this.httpClient.get(`${baseURL}/${borrowerId}/GetAllByBorrower`);
    }

    public getBudgetById(id: string): Observable<any> {
      return this.httpClient.get(`${baseURL}/${id}`);
    }

    public createBudget(data: object): Observable<any> {
      return this.httpClient.post(`${baseURL}/Create`, data);
    }

    public updateBudget(id: string, data: object): Observable<any> {
      return this.httpClient.put(`${baseURL}/${id}/Update`, data);
    }
}
