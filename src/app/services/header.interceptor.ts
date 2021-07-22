import { Injectable } from '@angular/core';
import {
    HttpRequest,
    HttpHandler,
    HttpEvent,
    HttpInterceptor, 
    HttpResponse, 
    HttpErrorResponse,
    HttpParams
} from '@angular/common/http';
import {AuthService} from "./auth.service";
// import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/do';
import {HttpError, ErrorMessage} from "../models/HttpError";
import {NotificationService} from "./notification.service";
import {Observable ,  BehaviorSubject } from 'rxjs';


@Injectable()
export class HeaderInterceptor implements HttpInterceptor{

    isRefreshingToken: boolean = false;
    tokenSubject: BehaviorSubject<string> = new BehaviorSubject<string>(null);

    constructor(public auth: AuthService, private notif: NotificationService ) {}

    addToken(request: HttpRequest<any>): HttpRequest<any> {
        request = request.clone({
            setHeaders: {
                'Device-Client-Id': 'mydevice1',
                'Access-Control-Allow-Origin': '*'
            }
        });

        if(this.auth.token){
            request = request.clone({
                setHeaders: {
                    Authorization: `Bearer ${this.auth.token.accessToken}`,
                    'Content-Type': 'application/json'
                }
            });
        }
        
        if (request.body instanceof FormData) {
            request = request.clone({ headers: request.headers.delete('Content-Type', 'application/json') });
            request = request.clone({ headers: request.headers.delete('Accept', 'application/json')});
          }

          
        return request;
    }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        // return next.handle(request);
        return next.handle(this.addToken(request)).do((event: HttpEvent<any>) => {
            if (event instanceof HttpResponse) {
                // do stuff with response if you want
            }
        }, (err: any) => {
            if (err instanceof HttpErrorResponse) {
                if(err.status === 401){
                    return this.handle401ByRefreshingToken(request, next)
                        .subscribe((result) => {
                            console.log("handle401ByRefreshingToken");
                        });
                }
                else if ((err.status === 403) && (err.error && err.error.Message)) {
                    this.notif.error(`${err.error.Message}, Error occured with HttpStatus- ${err.status}, StatusText- ${err.statusText}`);
                }
                else if (err.status === 403) {
                    this.notif.error(`Error occured with HttpStatus- ${err.status}, StatusText- ${err.statusText}`);
                }
                else if(err.error && err.error.Message){
                    this.notif.error(`${err.error.Message}, ErrorCode- ${err.error.ErrorCode}`);
                }

            }
            return Observable.throw(err);
        });
    }

    handle401ByRefreshingToken(req: HttpRequest<any>, next: HttpHandler) {
        console.log("renew token:  call from handle401ByRefreshingToken");
        return this.auth.refreshTokenAsync()
          .switchMap(() => {
              req = this.addToken(req);
              return next.handle(req);
          })
          .catch(() => {
              this.auth.logout();
              return Observable.empty();
          });
    }
}
