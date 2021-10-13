import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { AppConstants } from "@app/_constants/app.constants";
import { environment } from "@environments/environment";
import { Observable, of } from "rxjs";

@Injectable()
export class DatasourceService {

    constructor(private http: HttpClient, private constants: AppConstants) {}

    getDatasources(): Observable<any> {
        return this.http.get(environment.host + this.constants.ZOEY_ADMIN + this.constants.ONBOARDING + this.constants.GET_DATASOURCES);
    }
    
    addDatasource(reqPayload: any): Observable<any> {
        return this.http.post(environment.host + this.constants.ZOEY_ADMIN + this.constants.ONBOARDING + this.constants.REGISTER_DATASOURCE, reqPayload);
    }

    modifyDatasource(reqPayload: any): Observable<any> {
        return this.http.post(environment.host + this.constants.ZOEY_ADMIN + this.constants.ONBOARDING + this.constants.MODIFY_DATASOURCE, reqPayload);
    }

    deleteDatasource(datasourceName: string): Observable<any> {
        return this.http.delete(environment.host + this.constants.ZOEY_ADMIN + this.constants.ONBOARDING + this.constants.DELETE_DATASOURCE, { params: { 'datasource_name': datasourceName }});
    }

    addEndpoint(datasourceName: string, reqPayload: any): Observable<any> {
        return this.http.post(environment.host + this.constants.ZOEY_ADMIN + this.constants.ONBOARDING + this.constants.ADD_ENDPOINT, reqPayload, { params: { datasource_name: datasourceName } });
    }

    modifyEndpoint(datasourceName: string, reqPayload: any): Observable<any> {
        return this.http.post(environment.host + this.constants.ZOEY_ADMIN + this.constants.ONBOARDING + this.constants.MODIFY_ENDPOINT, reqPayload, { params: { datasource_name: datasourceName } });
    }

    deleteEndpoint(datasourceName: string, endpointName: string): Observable<any> {
        return this.http.delete(environment.host + this.constants.ZOEY_ADMIN + this.constants.ONBOARDING + this.constants.DELETE_ENDPOINT, { params: { datasource_name: datasourceName, endpoint_name: endpointName }});
    }

    uploadSwagger(swaggerFile: File): Observable<any> {
        const formData = new FormData();
        formData.append('swagger', swaggerFile, swaggerFile.name);

        // let params = new HttpParams();
        return this.http.post(environment.host + this.constants.ZOEY_ADMIN + this.constants.ONBOARDING + this.constants.PARSE_SWAGGER, formData);
    }
}