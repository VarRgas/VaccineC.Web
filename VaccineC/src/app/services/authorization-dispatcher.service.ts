import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

const baseURL = 'http://localhost:5000/api/Authorizations';

@Injectable({
    providedIn: 'root'
})

export class AuthorizationsDispatcherService {
    constructor(private httpClient: HttpClient) { }

    public getAllAuthorizations(): Observable<any> {
        return this.httpClient.get(baseURL);
    }

    public getAuthorizationById(id: string): Observable<any> {
        return this.httpClient.get(`${baseURL}/${id}`);
    }

    public GetSummarySituationAuthorization(): Observable<any> {
        return this.httpClient.get(`${baseURL}/GetSummarySituationAuthorization`);
    }
}