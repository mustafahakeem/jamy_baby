import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuditHistorySearch } from '../models/Customer';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable()
export class AuditHistoryService {


    private headers = new Headers({
        'Content-Type': 'application/json',
        'Device-Client-Id': 'mydevice1'
    });

    constructor(private httpClient: HttpClient) { }

    public getAuditHistories(auditHistorySearch : AuditHistorySearch){
        //const url = `${environment.api.James.domain}/api/AuditHistory/SearchAuditHistory`;
        const url = `${environment.api.James.domain}/api/Customer/GetAuditHistory`;
        
        return this.postData(url, auditHistorySearch);
    }

    postData(url, object) {
        const body = JSON.stringify(object);
        const headers = new Headers();

        return this.httpClient.post(url, body).map((data: any) => {
            return data;
        })
            .catch(this.observableHandleError);
    }

    private observableHandleError(error: any) {
        console.log(error);
        return Observable.throw(error);
    }

}