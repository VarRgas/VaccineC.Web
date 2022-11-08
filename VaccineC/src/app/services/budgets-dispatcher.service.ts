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

  public getBudgetsByResponsible(responsibleId: string): Observable<any> {
    return this.httpClient.get(`${baseURL}/${responsibleId}/GetAllByResponsible`);
  }

  public getBudgetById(id: string): Observable<any> {
    return this.httpClient.get(`${baseURL}/${id}`);
  }

  public getBudgetsDashInfo(month: number, year: number): Observable<any> {
    return this.httpClient.get(`${baseURL}/${month}/${year}/GetBudgetsDashInfo`);
  }

  public createBudget(data: object): Observable<any> {
    return this.httpClient.post(`${baseURL}/Create`, data);
  }

  public manageBudgetOverdue(data: object): Observable<any> {
    return this.httpClient.post(`${baseURL}/manageBudgetOverdue`, data);
  }

  public updateBudget(id: string, data: object): Observable<any> {
    return this.httpClient.put(`${baseURL}/${id}/Update`, data);
  }
}
