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

}