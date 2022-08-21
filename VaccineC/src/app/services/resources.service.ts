import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

const baseURL = 'http://localhost:5000/api/Resources';

@Injectable({
    providedIn: 'root'
})

export class ResourcesService {

    constructor(private httpClient: HttpClient) { }

    getAll(): Observable<any> {
        return this.httpClient.get(baseURL);
    }

    getById(id: number): Observable<any> {
        return this.httpClient.get(`${baseURL}/${id}`);
    }
    create(data: object): Observable<any> {
        return this.httpClient.post(`${baseURL}/Create`, data);
    }

    update(id: number, data: object): Observable<any> {
        return this.httpClient.put(`${baseURL}/${id}/Update`, data);
    }

    delete(id: number): Observable<any> {
        return this.httpClient.delete(`${baseURL}/${id}/Delete`);
    }
}