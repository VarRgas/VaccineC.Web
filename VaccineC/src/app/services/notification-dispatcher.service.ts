import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

const baseURL = 'http://localhost:5000/api/Notifications';

@Injectable({
    providedIn: 'root'
})

export class NotificationsDispatcherService {

    constructor(private httpClient: HttpClient) { }

    public getAllNotifications(): Observable<any> {
        return this.httpClient.get(baseURL);
    }

    public getNotificationById(id: string): Observable<any> {
        return this.httpClient.get(`${baseURL}/${id}`);
    }

    public getAllNotificationsByUserId(userId: string): Observable<any> {
        return this.httpClient.get(`${baseURL}/${userId}/GetAllNotificationsByUser`);
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

    markAllAsReaded(data: any): Observable<any> {
        return this.httpClient.post(`${baseURL}/UpdateOnDemand`, data);
    }

}