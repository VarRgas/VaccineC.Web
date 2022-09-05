import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

const baseURL = 'http://localhost:5000/api/PersonsJuridicals';

@Injectable({
  providedIn: 'root'
})

export class PersonsJuridicalsDispatcherService {

  constructor(private httpClient: HttpClient) { }

  public GetPersonJuridicalByPersonId(personId: string): Observable<any> {
    return this.httpClient.get(`${baseURL}/${personId}/GetPersonJuridicalByPersonId`);
  }

  public create(data: object): Observable<any> {
    return this.httpClient.post(`${baseURL}/Create`, data);
  }

  public update(id: string, data: object): Observable<any> {
    return this.httpClient.put(`${baseURL}/${id}/Update`, data);
  }

}
