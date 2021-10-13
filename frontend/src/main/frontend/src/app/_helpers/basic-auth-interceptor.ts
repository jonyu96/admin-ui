import { HttpErrorResponse, HttpEvent, HttpHandler, HttpHeaders, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';
import { Injectable, isDevMode } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { environment } from 'src/environments/environment';


@Injectable()
export class BasicAuthInterceptor implements HttpInterceptor {
    
    constructor() {}

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        let auth = 'Basic ' + environment.basicAuth;

        // NSM API basic auth
        if (req.url.endsWith('/all')) {
            auth = environment.nsmBasicAuth;
        }

        let authReq;

        if (req.url.endsWith('/parseSwagger')) {
            authReq = req.clone({
                headers: req.headers.set('Authorization', auth)
                                    .set('tracking_id', this.genRandomString())
                                    .set('enctype', 'multipart/form-data')
            });
        } else {
            authReq = req.clone({
                headers: req.headers.set('Authorization', auth)
                                    .set('tracking_id', this.genRandomString())
                                    .set('Content-Type', 'application/json')
            });
        }


        return next.handle(authReq).pipe(
            // retry(1)
            catchError((error: HttpErrorResponse) => {
                if (error.status === 401) {
                    // TO DO: refresh token
                }
                return throwError(error);
            })
        );
    }

    private genRandomString(): string {

        let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890,./;'[]\=-)(*&^%$#@!~`";
        let text = "";
        for (let i = 0; i < 10; i++) {
            text += possible.charAt(Math.floor(Math.random() * possible.length));
        }
        
        return text;
    }
}