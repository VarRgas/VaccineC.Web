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

}