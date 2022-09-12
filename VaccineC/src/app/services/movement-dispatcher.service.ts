import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

const baseURL = 'http://localhost:5000/api/Movements';

@Injectable({
    providedIn: 'root'
})

export class MovementsDispatcherService {

    constructor(private httpClient: HttpClient) { }

    public getAll(): Observable<any> {
        return this.httpClient.get(baseURL);
    }

    public getAllByMovementNumber(movementNumber: string): Observable<any> {
        return this.httpClient.get(`${baseURL}/${movementNumber}/GetAllByMovementNumber`);
    }

    public getById(id: string): Observable<any> {
        return this.httpClient.get(`${baseURL}/${id}`);
    }

    create(data: object): Observable<any> {
        return this.httpClient.post(`${baseURL}/Create`, data);
    }

    finish(id: string, data: object): Observable<any> {
        return this.httpClient.put(`${baseURL}/${id}/FinishMovement`, data);
    }

    cancel(id: string, data: object): Observable<any> {
        return this.httpClient.put(`${baseURL}/${id}/CancelMovement`, data);
    }

}
