import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

const baseURL = 'http://localhost:5000/api/CompaniesParameters';

@Injectable({
  providedIn: 'root'
})

export class CompaniesParametersDispatcherService {

  constructor(private httpClient: HttpClient) { }

  public getAllCompaniesParameters(): Observable<any> {
    return this.httpClient.get(baseURL);
  }

  public getCompanyParameterById(id: string): Observable<any> {
    return this.httpClient.get(`${baseURL}/${id}`);
  }

  public createCompanyParameter(data: object): Observable<any> {
    return this.httpClient.post(`${baseURL}/Create`, data);
  }

  public updateCompanyParameter(id: string, data: object): Observable<any> {
    return this.httpClient.put(`${baseURL}/${id}/Update`, data);
  }

}
