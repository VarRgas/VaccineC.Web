import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CompanyScheduleModel } from '../models/company-schedule-model';

const baseURL = 'http://localhost:5000/api/PersonsPhones';

@Injectable({
  providedIn: 'root'
})

export class PersonsPhonesDispatcherService {

  constructor(private httpClient: HttpClient) { }

  public getAllPersonsPhones(): Observable<any> {
    return this.httpClient.get(baseURL);
  }

  public getPersonPhoneById(id: string): Observable<any> {
    return this.httpClient.get(`${baseURL}/${id}`);
  }

  public getAllPersonsPhonesByPersonId(personId: string): Observable<any> {
    return this.httpClient.get(`${baseURL}/${personId}/GetAllPersonsPhonesByPersonId`);
  }

  public getAllPersonsPhonesCelByPersonId(personId: string): Observable<any> {
    return this.httpClient.get(`${baseURL}/${personId}/GetAllPersonsPhonesCellByPersonId`);
  }

  public getPrincipalPersonPhoneByPersonId(personId: string): Observable<any> {
    return this.httpClient.get(`${baseURL}/${personId}/GetPrincipalPersonPhone`);
  }

  create(data: object): Observable<any> {
    return this.httpClient.post(`${baseURL}/Create`, data);
  }

  update(id: string, data: object): Observable<any> {
    return this.httpClient.put(`${baseURL}/${id}/Update`, data);
  }

  delete(id: string): Observable<any> {
    return this.httpClient.delete(`${baseURL}/${id}/Delete`);
  }

}