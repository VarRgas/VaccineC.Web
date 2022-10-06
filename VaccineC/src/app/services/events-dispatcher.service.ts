import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

const baseURL = 'http://localhost:5000/api/Events';

@Injectable({
    providedIn: 'root'
})

export class EventsDispatcherService {

    constructor(private httpClient: HttpClient) { }

    public getAllEvents(): Observable<any> {
        return this.httpClient.get(baseURL);
    }

    public getEventById(id: string): Observable<any> {
        return this.httpClient.get(`${baseURL}/${id}`);
    }

}