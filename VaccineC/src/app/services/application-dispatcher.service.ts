import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

const baseURL = 'http://localhost:5000/api/Applications';

@Injectable({
    providedIn: 'root'
})

export class ApplicationsDispatcherService {
    constructor(private httpClient: HttpClient) { }

    public getAllApplications(): Observable<any> {
        return this.httpClient.get(baseURL);
    }

    public getApplicationById(id: string): Observable<any> {
        return this.httpClient.get(`${baseURL}/${id}`);
    }

    public getPersonApplicationNumber(personId: string): Observable<any> {
        return this.httpClient.get(`${baseURL}/${personId}/GetPersonApplicationNumber`);
    }

    public getHistoryApplicationsByPersonId(personId: string): Observable<any> {
        return this.httpClient.get(`${baseURL}/${personId}/GetHistoryApplicationsByPersonId`);
    }

    public getAvailableApplicationsByPersonId(personId: string): Observable<any> {
        return this.httpClient.get(`${baseURL}/${personId}/GetAvailableApplicationsByPersonId`);
    }

    public getApplicationsByParameters(personName: string, responsibleId: string, applicationDate: string): Observable<any> {
        return this.httpClient.get(`${baseURL}/${personName}/${responsibleId}/${applicationDate}/GetApplicationsByParameters`);
    }

    public getSipniImunizationById(applicationId: string): Observable<any> {
        return this.httpClient.get(`${baseURL}/${applicationId}/GetSipniImunizationById`);
    }

    public getPersonApplicationProductSameDay(personId: string, productId: string): Observable<any> {
        return this.httpClient.get(`${baseURL}/${personId}/${productId}/GetPersonApplicationProductSameDay`);
    }

    public getApplicationsByPersonGender(month: number, year: number): Observable<any> {
        return this.httpClient.get(`${baseURL}/${month}/${year}/GetApplicationsByPersonGender`);
    }

    public getSipniIntegrationSituation(month: number, year: number): Observable<any> {
        return this.httpClient.get(`${baseURL}/${month}/${year}/GetSipniIntegrationSituation`);
    }

    public getApplicationNumbers(month: number, year: number): Observable<any> {
        return this.httpClient.get(`${baseURL}/${month}/${year}/GetApplicationNumbers`);
    }

    public getApplicationsByProduct(month: number, year: number): Observable<any> {
        return this.httpClient.get(`${baseURL}/${month}/${year}/getApplicationsByProductId`);
    }

    public getApplicationsByPersonAge(month: number, year: number): Observable<any> {
        return this.httpClient.get(`${baseURL}/${month}/${year}/GetApplicationsByAge`);
    }

    public getApplicationsByType(month: number, year: number): Observable<any> {
        return this.httpClient.get(`${baseURL}/${month}/${year}/GetApplicationsByType`);
    }

    public verifyApplicationAbleUpdate(applicationId: string, userId: string): Observable<any> {
        return this.httpClient.get(`${baseURL}/${applicationId}/${userId}/VerifyApplicationAbleUpdate`);
    }

    public createApplication(data: object): Observable<any> {
        return this.httpClient.post(`${baseURL}/Create`, data);
    }

    public AddSipniImunizationById(applicationId: string, personId: string, userId: string): Observable<any> {
        return this.httpClient.post(`${baseURL}/${applicationId}/${personId}/${userId}/AddSipniImunizationById`, "");
    }
}
