import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

const baseURL = 'http://localhost:5000/api/Discards';

@Injectable({
    providedIn: 'root'
})

export class DiscardsDispatcherService {

    constructor(private httpClient: HttpClient) { }

    public getAllDiscards(): Observable<any> {
        return this.httpClient.get(baseURL);
    }

    public getDiscardById(id: string): Observable<any> {
        return this.httpClient.get(`${baseURL}/${id}`);
    }

    create(data: object): Observable<any> {
        return this.httpClient.post(`${baseURL}/Create`, data);
    }
}