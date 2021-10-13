import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { AppConstants } from "@app/_constants/app.constants";
import { environment } from "@environments/environment";
import { Observable } from "rxjs/internal/Observable";

@Injectable()
export class PierService {
    constructor(private http: HttpClient, private constants: AppConstants) { }

    getAllIssues(username: string): Observable<any> {
        return this.http.get(environment.host + this.constants.ZOEY_ADMIN + this.constants.QUERY_ALL_ISSUES, { headers: new HttpHeaders({ 'username': username }) });
    }

    addIssue(username: string, payload: any): Observable<any> {
        return this.http.post(environment.host + this.constants.ZOEY_ADMIN + this.constants.INSERT_PIER_INFO, payload, { observe: 'response', headers: new HttpHeaders({ 'username': username }) });
    }

    editIssue(username: string, payload: any): Observable<any> {
        return this.http.post(environment.host + this.constants.ZOEY_ADMIN + this.constants.UPDATE_PIER_INFO, payload, { observe: 'response', headers: new HttpHeaders({ 'username': username }) });
    }

    deleteIssue(username: string, issue: string): Observable<any> {
        return this.http.delete(environment.host + this.constants.ZOEY_ADMIN + this.constants.DELETE_PIER_INFO, { headers: new HttpHeaders({ 'username': username }), params: { 'issue': issue } });
    }
}