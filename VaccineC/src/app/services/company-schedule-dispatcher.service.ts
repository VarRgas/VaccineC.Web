import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CompanyScheduleModel } from '../models/company-schedule-model';

const baseURL = 'http://localhost:5000/api/CompaniesSchedules';

@Injectable({
  providedIn: 'root'
})

export class CompaniesSchedulesDispatcherService {

  constructor(private httpClient: HttpClient) { }

  public getAllCompaniesSchedules(): Observable<any> {
    return this.httpClient.get(baseURL);
  }

  public getCompanyScheduleById(id: string): Observable<any> {
    return this.httpClient.get(`${baseURL}/${id}`);
  }

  public getAllCompaniesSchedulesByCompanyId(id: string): Observable<any> {
    return this.httpClient.get(`${baseURL}/${id}/GetAllCompaniesSchedulesByCompanyID`);
  }

  createOnDemand(data: CompanyScheduleModel[]): Observable<any> {
    return this.httpClient.post(`${baseURL}/CreateOnDemand`, data);
  }

  public update(id: string, data: object): Observable<any> {
    return this.httpClient.put(`${baseURL}/${id}/Update`, data);
  }

  public delete(id: string): Observable<any> {
    return this.httpClient.delete(`${baseURL}/${id}/Delete`);
  }

}