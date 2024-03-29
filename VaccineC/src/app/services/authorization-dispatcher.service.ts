import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthorizationModel } from '../models/authorization-model';
import { AuthorizationSuggestionModel } from '../models/authorization-suggestion-model';

const baseURL = 'http://localhost:5000/api/Authorizations';

@Injectable({
    providedIn: 'root'
})

export class AuthorizationsDispatcherService {
    constructor(private httpClient: HttpClient) { }

    public getAllAuthorizations(): Observable<any> {
        return this.httpClient.get(baseURL);
    }

    public getAllAuthorizationsForApplication(): Observable<any> {
        return this.httpClient.get(`${baseURL}/GetAuthorizationsForApplication`);
    }

    public getAuthorizationById(id: string): Observable<any> {
        return this.httpClient.get(`${baseURL}/${id}`);
    }

    public getAuthorizationByEventId(eventId: string): Observable<any> {
        return this.httpClient.get(`${baseURL}/${eventId}/GetAuthorizationByEventId`);
    }

    public getAuthorizationByParameter(information: string, situation: string, responsible: string): Observable<any> {
        return this.httpClient.get(`${baseURL}/${information}/${situation}/${responsible}/GetAuthorizationByParameter`);
    }
    
    public getAuthorizationsDashInfo(month: number, year: number): Observable<any> {
        return this.httpClient.get(`${baseURL}/${month}/${year}/GetAuthorizationsDashInfo`);
    }

    public GetSummarySituationAuthorization(): Observable<any> {
        return this.httpClient.get(`${baseURL}/GetSummarySituationAuthorization`);
    }

    public createOnDemand(data: AuthorizationModel[]): Observable<any> {
        return this.httpClient.post(`${baseURL}/CreateOnDemand`, data);
    }

    public update(id: string, data: object): Observable<any> {
        return this.httpClient.put(`${baseURL}/${id}/Update`, data);
    }

    public delete(id: string, userId: string): Observable<any> {
        return this.httpClient.delete(`${baseURL}/${id}/${userId}/Delete`);
    }

    public suggestDoses(data: AuthorizationSuggestionModel[]): Observable<any> {
        return this.httpClient.post(`${baseURL}/SuggestDoses`, data);
    }

    public suggestJuridicalDoses(data: AuthorizationSuggestionModel[]): Observable<any> {
        return this.httpClient.post(`${baseURL}/SuggestJuridicalDoses`, data);
    }
}