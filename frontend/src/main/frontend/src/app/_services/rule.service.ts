import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

import { environment } from "src/environments/environment";
import { AppConstants } from "@app/_constants/app.constants";

/**
 * Communication between {@link TableComponent} and {@link FormComponent} and API backend.
 */
@Injectable()
export class RuleService {

    constructor(private http: HttpClient, private constants: AppConstants) { }

    queryAllRules(username: string): Observable<any> {
        return this.http.get(environment.host + this.constants.ZOEY_ADMIN + this.constants.QUERY_ALL_RULES, { headers: new HttpHeaders({ 'username': username }) });
    }
    
    addRule(rule: Object, username: string): Observable<any> {
        return this.http.post(environment.host + this.constants.ZOEY_ADMIN
            + this.constants.ADD_RULE, rule, { observe: 'response', headers: new HttpHeaders({ 'username': username }) });
    }
    
    modifyRule(rule: Object, username: string): Observable<any> {

        return this.http.post(environment.host + this.constants.ZOEY_ADMIN
            + this.constants.MODIFY_RULE, rule, { observe: 'response', headers: new HttpHeaders({ 'username': username }) });
    }

    deleteRule(ruleId: string, username: string): Observable<any> {

        return this.http.request('delete', environment.host + this.constants.ZOEY_ADMIN
            + this.constants.DELETE_RULE, { observe: 'response', headers: new HttpHeaders({ 'username': username }), params: { rule_id: ruleId } });
    }

    // Tools
    
    nsmQuery(input: {api: string, msisdn: string}): Observable<any> {
        
        const [dataSource] = input.api.split('-', 1);
        const path = `/${input.api}/v1/${dataSource}/all`;

        const headers = new HttpHeaders().set('msisdn', input.msisdn);

        // proxy must be used to make calls to this API (by running 'npm start') for local dev
        // TODO: implement zoey admin as the intermediary for making the calls
        if (!environment.production) {
            return this.http.get('/proxy-api' + path, {headers: headers});
        }

        return this.http.get(environment.host + path, {headers: headers});
    }

    testRule(input: {ruleId: string, featureList: string[], subscriptionIds: string}): Observable<any> {

        const headers = new HttpHeaders();

        const payload = {
            "requestId": String(Math.floor(Math.random() * 10000000000)),
            "ruleId": input.ruleId,
            "featureList": input.featureList.map(x => ({"id": x})),
            "subscriptionIds": [{
                "type": "MSISDN",
                "value": input.subscriptionIds
            }]
        };

        if (!environment.production) {
            return this.http.post('/proxy-api' + this.constants.ZOEY_PV + this.constants.TEST_RULE, payload);
        }
    
        return this.http.post(environment.host + this.constants.ZOEY_PV + this.constants.TEST_RULE, payload);
    }
}