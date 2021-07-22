import { Injectable } from '@angular/core';
import {Headers, Response} from "@angular/http";
// import {HttpClient} from "../services/HttpClient";
import { HttpClient } from '@angular/common/http';
import {LogViewerQueryRequest, LoggerView} from "../models/LoggerView";
import {environment} from "../../environments/environment";
// import {Observable} from "@reactivex/rxjs";
import { Observable } from 'rxjs/Observable';

@Injectable()
export class LogViewerService {
  private headers = new Headers({'Content-Type': 'application/json',
    'Device-Client-Id': 'mydevice1'});

  constructor(private httpClient: HttpClient) { }

  public getLogById(logId: number, audience:number): Observable<LoggerView>{
    const url = `${environment.api.James.domain}/api/LogViewer/GetLogById?logId=`+logId+`&audience=`+audience;

    return this.httpClient.get(url).map((data: LoggerView) => data)
        .catch(this.observableHandleError);
  }

  public searchLogs(object: LogViewerQueryRequest){
    const url = `${environment.api.James.domain}/api/LogViewer/SearchLog`;
    return this.postData(url, object);
  }

  postData(url, object) {
    const body = JSON.stringify(object);
    const headers = new Headers();

    return this.httpClient.post(url, body).map((data: any) => {
      return data;
    }).catch(this.observableHandleError);
  }

  private observableHandleError(error: any) {
    console.log(error);
    return Observable.throw(error);
  }

}
