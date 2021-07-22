import { Injectable } from "@angular/core";
import { Http, Headers, Response } from "@angular/http";
import "rxjs/add/operator/map";
import { Observable } from "rxjs/Observable";
import {
  DepositSearch,
  Deposit,
  Currency,
  Wallet,
  Country,
  FinanceRelocationLookupResult,
  FinanceRelocationLookupCommand,
  FinanceRelocation
} from "../models/deposit";
import { environment } from "../../environments/environment";
// import {HttpClient} from "../services/HttpClient";
import { HttpClient } from "@angular/common/http";
//import {AuthService} from "../services/auth.service";
import { LookupService } from "../dal/lookup.service";

@Injectable()
export class FinanceRelocationService {
  constructor(
    private http: Http,
    private httpClient: HttpClient,
    private lookupService: LookupService
  ) {}

  public financeRelocationLookup(
    request: FinanceRelocationLookupCommand
  ): Observable<FinanceRelocationLookupResult> {
    const url = `${environment.api.James.domain}/api/Deposit/FinanceRelocationLookup`;
    return this.postData(url, request);
  }

  public financeFundRelocation(
    request: FinanceRelocation
  ) {
    const url = `${environment.api.James.domain}/api/Deposit/FinanceFundRelocation`;
    return this.postData(url, request);
  }

  private postData(url, object) {
    const body = JSON.stringify(object);
    const headers = new Headers();
    return this.httpClient
      .post(url, body)
      .map((data: any) => data)
      .catch(this.observableHandleError);
  }

  private observableHandleError(error: any) {
    console.log(error);
    return Observable.throw(error);
  }
}
