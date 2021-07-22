/**
 * Created by Anupam on 1/17/2017.
 */

import {Injectable} from '@angular/core';
import {Http, Headers, Response, RequestOptions, ConnectionBackend} from '@angular/http';
import {Token} from "../models/Token";
import {AuthService} from "./auth.service";
import {Observable} from 'rxjs/Observable';
import {HttpError, ErrorMessage} from "../models/HttpError";
import {NotificationService} from "./notification.service";



@Injectable()
export class HttpClient extends Http {

    private headers = new Headers();


    constructor(backend: ConnectionBackend,
                defaultOptions: RequestOptions,
                private auth : AuthService,
                private notif: NotificationService
    ) {
        super(backend, defaultOptions);
        this.headers.set('Device-Client-Id', 'mydevice1');
        this.headers.set('Access-Control-Allow-Origin', '*');
    }

    createAuthorizationHeader(headers: Headers) {
        var token = this.auth.token;
        if(token) headers.set('Authorization', `Bearer ${token.accessToken}`);
    }

    get(url) : Observable<Response> {
       this.createAuthorizationHeader(this.headers);
        return super.get(url, {
            headers: this.headers
        }).map((data: any) => {
            console.log(this.headers);
            return data;
        }).catch(this.catchAuthErrorGet(this, url));
            //.catch(this.catchAuthErrorGet(this, url));
    }

    post(url, data) : Observable<Response> {
        this.headers.set('Content-Type', 'application/json');
        this.createAuthorizationHeader(this.headers);
        return super.post(url, data, {
            headers: this.headers
        }).map((data: any) => {
            return data;
        }).catch(this.catchAuthErrorGet(this, url));
            //.catch(this.catchAuthErrorPost(this, url, data));
    }

    private catchAuthErrorGet (self: HttpClient, url : string ) {
        // we have to pass HttpService's own instance here as `self`
        return (res: Response) => {
            var httpError = new HttpError(res, new ErrorMessage(res.json()), "GET");
            if(httpError.Message && httpError.Message.Message){
                this.notif.error(httpError.Message.Message);
            }
            else if(res.status === 401 || res.status === 403){
                this.notif.error(`Error occured with HttpStatus- ${res.status}, StatusText- ${res.statusText}`);
            }

            // if (res.status === 401 || res.status === 403) {
            //    return this.auth.renewToken().flatMap((token: Response)=>{
            //       return this.get(url)
            //     });
            // }
            return Observable.throw(res);
        };
    }

    private catchAuthErrorPost (self: HttpClient, url : string, data : any ) {
        // we have to pass HttpService's own instance here as `self`
        return (res: Response) => {
            var httpError = new HttpError(res, new ErrorMessage(res.json()), "GET");
            if(httpError.Message && httpError.Message.Message){
                this.notif.error(`${httpError.Message.Message}, ErrorCode- ${httpError.Message.ErrorCode}`);
            }
            else if(res.status === 401 || res.status === 403){
                this.notif.error(`Error occured with HttpStatus- ${res.status}, StatusText- ${res.statusText}`);
            }
            // if (res.status === 401 || res.status === 403) {
            //    return this.auth.renewToken().flatMap((token: Response)=>{
            //       return this.get(url)
            //     });
            // }
            return Observable.throw(res);
        };
    }
}