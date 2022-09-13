import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, of } from 'rxjs';

const baseURL = 'http://localhost:5000/api/Persons';

@Injectable({
  providedIn: 'root'
})
export class PersonDispatcherService {

  constructor(private httpClient: HttpClient) { }
  opts = [];

  public getAllPersons(): Observable<any> {
    return this.httpClient.get(baseURL);
  }

  public getPersonsByName(name: string): Observable<any> {
    return this.httpClient.get(`${baseURL}/${name}/GetByName`);
  }

  public getPersonById(id: string): Observable<any> {
    return this.httpClient.get(`${baseURL}/${id}`);
  }

  public createPerson(data: object): Observable<any> {
    return this.httpClient.post(`${baseURL}/Create`, data);
  }

  public deletePerson(id: string): Observable<any> {
    return this.httpClient.delete(`${baseURL}/${id}/Delete`);
  }

  public updatePerson(id: string, data: object): Observable<any> {
    return this.httpClient.put(`${baseURL}/${id}/Update`, data);
  }
}
