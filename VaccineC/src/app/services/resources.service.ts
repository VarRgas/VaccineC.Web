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

    getById(id: string): Observable<any> {
        return this.httpClient.get(`${baseURL}/${id}`);
    }

    getByName(name: string): Observable<any> {
        return this.httpClient.get(`${baseURL}/${name}/GetByName`);
    }

    getByUser(id: string): Observable<any> {
        return this.httpClient.get(`${baseURL}/${id}/GetByUser`);
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
}