import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "@environments/environment";
import { Observable, of } from "rxjs";

import { AppConstants } from '@app/_constants/app.constants';

@Injectable({ providedIn: 'root' })
export class AdminService {

    constructor(private http: HttpClient, private constants: AppConstants) {}

    /* BASIC ADMIN */
    getUser(username: string): Observable<any> {
        return this.http.get(environment.host + this.constants.ZOEY_ADMIN + this.constants.GET_USER, { headers: new HttpHeaders({ 'username': username})});
    }

    requestPermissions(reqPayload: any): Observable<any> {
        return this.http.post(environment.host + this.constants.ZOEY_ADMIN + this.constants.REQUEST_PERMISSIONS, reqPayload);
    }

    requestPsBotAccess(reqPayload: any, slackId: string, pierSupportGroup: string): Observable<any> {
        return this.http.post(environment.host + this.constants.ZOEY_ADMIN + this.constants.REQUEST_PERMISSIONS, reqPayload, 
            { headers: new HttpHeaders({ 'slack_id': slackId, 'pier_support_group': pierSupportGroup })});
    }

    /* SUPER ADMIN */

    getAllUsers(username: string): Observable<any> {
        return this.http.get(environment.host + this.constants.ZOEY_ADMIN + this.constants.GET_USERS, { headers: new HttpHeaders({ 'username': username})});
    }

    updatePermissions(reqPayload: any, username: string): Observable<any> {
        return this.http.post(environment.host + this.constants.ZOEY_ADMIN + this.constants.UPDATE_PERMISSIONS, reqPayload, { headers: new HttpHeaders({ 'username': username })});
    }

    approveRequestedPermissions(reqPayload, username: string): Observable<any> {
        return this.http.post(environment.host + this.constants.ZOEY_ADMIN + this.constants.APPROVE_PERMISSIONS, reqPayload, { headers: new HttpHeaders({ 'username': username })});
    }

    deleteUser(userToDelete: string, username: string): Observable<any> {
        return this.http.post(environment.host + this.constants.ZOEY_ADMIN + this.constants.DELETE_USER, null, { headers: new HttpHeaders({ 'username': username }), params: { 'username': userToDelete }});
    }

}