import { HttpErrorResponse } from "@angular/common/http";
import { ErrorHandler, Injectable, Injector } from "@angular/core";
import { ToasterService } from "@app/_services/toaster.service";
import { CustomError } from "@app/_models/custom-error.model";
import { LoggerService } from "@app/_services/logger.service";
import { AccountService } from "@app/_services/account.service";

/**
 * Source: https://medium.com/angular-in-depth/expecting-the-unexpected-best-practices-for-error-handling-in-angular-21c3662ef9e4
 * 
 */
@Injectable()
export class GlobalErrorHandler implements ErrorHandler {

    private ts: any;

    constructor(private injector: Injector, 
                private logger: LoggerService,
                private accountService: AccountService) {
        this.ts = this.injector.get(ToasterService);
    }

    handleError(error: Error | HttpErrorResponse): void {
        
        // log error to console
        console.error(error);

        if (error instanceof HttpErrorResponse) { // HTTP request errors
            if (error.error instanceof Object) {
                if ('baseError' in error.error) {
                    this.ts.showError(error.error.baseError['explanation'], error.error.baseError['code']);
                } else {
                    this.ts.showError(error.error['message'], error.status);
                }
            } else {
                this.ts.showError(error.error);
            }

            // const payload = new Log({
            //     message: error.message,
            //     user: this.accountService.getUser(),
            //     url: error.url,
            //     type: "SERVER_ERROR"
            // })
            // this.logger.logError(payload);

        }

        if (error instanceof Error) { // internally thrown errors

            if (error instanceof CustomError) {
                this.ts.showError(error.msg);
            
            } else {
                // const payload = new Log({
                //     message: error.stack,
                //     user: this.accountService.getUser(),
                //     type: "UI_ERROR"
                // })
                // this.logger.logError(payload);
            }
        }
    }
}