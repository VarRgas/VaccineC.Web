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

}