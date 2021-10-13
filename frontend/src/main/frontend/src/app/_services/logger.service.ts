import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { AppConstants } from "@app/_constants/app.constants";
import { Log } from "@app/_models/log.model";
import { environment } from "@environments/environment";

@Injectable({ providedIn: 'root' })
export class LoggerService {

    constructor(private http: HttpClient, private constants: AppConstants) { }

    logActivity(log: Log): void {

        this.http.post(environment.loggerApi + this.constants.LOG_ACTIVITY, log).subscribe(
            res => {
                // console.log(res);
            },
            err => {
                console.error("Failed to send activity log to Zoey Logger.");
            }
        );
    }

    logError(log: Log): void {
        
        this.http.post(environment.loggerApi + this.constants.LOG_ERROR, log).subscribe(
            res => {
                // console.log(res);
            },
            err => {
                console.error("Failed to send error log to Zoey Logger.");
            }
        );
    }


}