import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserModel } from '../models/user-model';

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

    create(data: object): Observable<any> {
        return this.httpClient.post(`${baseURL}/Create`, data);
    }

    update(id: string, data: object): Observable<any> {
        return this.httpClient.put(`${baseURL}/${id}/Update`, data);
    }

    delete(id: string): Observable<any> {
        return this.httpClient.delete(`${baseURL}/${id}/Delete`);
    }

    activateSituation(id: string): Observable<any> {
        return this.httpClient.post(`${baseURL}/${id}/ActivateSituation`, id);
    }

    deactivateSituation(id: string): Observable<any> {
        return this.httpClient.post(`${baseURL}/${id}/DeactivateSituation`, id);
    }

    resetPassword(id: string, userModel: UserModel): Observable<any> {
        return this.httpClient.post(`${baseURL}/${id}/ResetPassword`, userModel);
    }
}