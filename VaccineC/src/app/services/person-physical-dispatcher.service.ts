import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

const baseURL = 'http://localhost:5000/api/PersonsPhysicals';

@Injectable({
  providedIn: 'root'
})

export class PersonsPhysicalsDispatcherService {

  constructor(private httpClient: HttpClient) { }


  public GetPersonPhysicalByPersonId(personId: string): Observable<any> {
    return this.httpClient.get(`${baseURL}/${personId}/GetPersonPhysicalByPersonId`);
  }

  public createPhysicalComplements(data: object): Observable<any> {
    return this.httpClient.post(`${baseURL}/Create`, data);
  }

  public updatePhysicalComplements(id: string, data: object): Observable<any> {
    return this.httpClient.put(`${baseURL}/${id}/Update`, data);
  }

}
