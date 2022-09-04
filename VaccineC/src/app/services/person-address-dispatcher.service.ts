import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CompanyScheduleModel } from '../models/company-schedule-model';

const baseURL = 'http://localhost:5000/api/PersonsAddresses';

@Injectable({
  providedIn: 'root'
})

export class PersonsAddressesDispatcherService {

  constructor(private httpClient: HttpClient) { }

  public getAllPersonsAddresses(): Observable<any> {
    return this.httpClient.get(baseURL);
  }

  public getPersonAddressById(id: string): Observable<any> {
    return this.httpClient.get(`${baseURL}/${id}`);
  }

  public getAllPersonsAddressesByPersonId(personId: string): Observable<any> {
    return this.httpClient.get(`${baseURL}/${personId}/GetAllPersonsAddressesByPersonId`);
  }

  public getPrincipalPersonAddressByPersonId(personId: string): Observable<any> {
    return this.httpClient.get(`${baseURL}/${personId}/GetPrincipalPersonAddress`);
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