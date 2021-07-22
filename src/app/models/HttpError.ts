/**
 * Created by Anupam on 3/8/2017.
 */

import {Response} from '@angular/http';

export class HttpError{
    public HttpResponse : Response;
    public Message : ErrorMessage;
    public RequestType : string;

    public constructor(httpResponse : Response, message : ErrorMessage, requestType : string) {
        this.HttpResponse = httpResponse;
        this.Message = message;
        this.RequestType = requestType;
    }
}



export class ErrorMessage {
    public ErrorCode : string;
    public Message : string;
    public Type : string;
    public NestedMessages : Array<ErrorMessage>;

    public constructor(data: any = {}) {
        this.ErrorCode = data.ErrorCode || null;
        this.Message = data.Message || null;
        this.Type = data.Type || null;
        this.NestedMessages = data.NestedMessages || 1;
    }
}


