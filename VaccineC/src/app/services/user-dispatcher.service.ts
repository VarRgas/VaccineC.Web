import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

const baseURL = 'http://localhost:5000/api/Users';

@Injectable({
    providedIn: 'root'
})

export class UsersService {

    constructor(private httpClient: HttpClient) { }

    getAll(): Observable<any> {
        return this.httpClient.get(baseURL);
    }

    getAllActive(): Observable<any> {
        return this.httpClient.get(`${baseURL}/GetAllActive`);
    }

    getById(id: string): Observable<any> {
        return this.httpClient.get(`${baseURL}/${id}`);
    }

    getByName(name: string): Observable<any> {
        return this.httpClient.get(`${baseURL}/${name}/GetByEmail`);
    }

}