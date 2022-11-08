import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserResourceModel } from '../models/user-resource-model';

const baseURL = 'http://localhost:5000/api/UsersResources';

@Injectable({
    providedIn: 'root'
})

export class UserResourceService {
    
    constructor(private httpClient: HttpClient) { }

    getAll(): Observable<any> {
        return this.httpClient.get(baseURL);
    }

    getById(id: string): Observable<any> {
        return this.httpClient.get(`${baseURL}/${id}`);
    }

    getByUserResource(userResourceModel: UserResourceModel): Observable<any> {
        return this.httpClient.post(`${baseURL}/GetByUserResource`, userResourceModel);
    }

    getResourcesMenuByUser(userId: string): Observable<any> {
        return this.httpClient.get(`${baseURL}/${userId}/GetResourcesMenuByUser`);
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