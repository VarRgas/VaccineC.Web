import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

const baseURL = 'http://localhost:5000/api/AuthorizationsNotifications';

@Injectable({
    providedIn: 'root'
})

export class AuthorizationsNotificationsDispatcherService {

    constructor(private httpClient: HttpClient) { }

    public getAllAuthorizationsNotifications(): Observable<any> {
        return this.httpClient.get(baseURL);
    }

    public getAuthorizationNotificationById(id: string): Observable<any> {
        return this.httpClient.get(`${baseURL}/${id}`);
    }

    public getAuthorizationNotificationByAuthorizationId(authorizationId: string): Observable<any> {
        return this.httpClient.get(`${baseURL}/${authorizationId}/GetNotificationsByAuthorizationId`);
    }

}