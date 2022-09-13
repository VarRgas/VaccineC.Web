import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

const baseURL = 'http://localhost:5000/api/MovementsProducts';

@Injectable({
    providedIn: 'root'
})

export class MovementsProductsDispatcherService {

    constructor(private httpClient: HttpClient) { }

    public getAll(): Observable<any> {
        return this.httpClient.get(baseURL);
    }

    public getAllByMovementId(movementId: string): Observable<any> {
        return this.httpClient.get(`${baseURL}/${movementId}/GetAllMovementsProductsByMovementId`);
    }

    public getById(id: string): Observable<any> {
        return this.httpClient.get(`${baseURL}/${id}`);
    }

    public create(data: object): Observable<any> {
        return this.httpClient.post(`${baseURL}/Create`, data);
    }

    public delete(id: string): Observable<any> {
        return this.httpClient.delete(`${baseURL}/${id}/Delete`);
    }

    public update(id: string, data: object): Observable<any> {
        return this.httpClient.put(`${baseURL}/${id}/Update`, data);
    }

}
