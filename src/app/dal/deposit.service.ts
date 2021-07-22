import { Injectable } from '@angular/core';
import { Http, Headers, Response } from "@angular/http";
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs';
import {DepositSearch, Deposit, Currency, Wallet, Country} from "../models/deposit";
import { environment } from '../../environments/environment';
// import {HttpClient} from "../services/HttpClient";
import { HttpClient } from '@angular/common/http';
//import {AuthService} from "../services/auth.service";
import {LookupService} from '../dal/lookup.service'

@Injectable()
export class DepositService {

  constructor(private http: Http, private httpClient: HttpClient, private lookupService: LookupService) { }

  public getCurrencies(): Observable<Currency[]>{
    const url = `${environment.api.Blockbonds.domain}/Lookup/Currency`;

    return this.httpClient.get(url).map((data: Currency[]) => data)
        .catch(this.observableHandleError);
  }

  public getCountries(): Observable<Country[]>{
    return this.lookupService.getCountries();
  }

  public getBankTypeWallets(): Observable<Wallet[]>{
    const url = `${environment.api.James.domain}/api/ManagementWallet/GetWalletByType?walletTypeId=2`; //make 'walletType' enum and move this id to BankType

    return this.httpClient.get(url).map((data: Wallet[]) => data)
        .catch(this.observableHandleError);
    
  }

  public getBankTypeWalletsByCurrency(currencyId: number): Observable<Wallet[]>{
    const url = `${environment.api.James.domain}/api/ManagementWallet/GetWalletByTypeAndCurrency?walletTypeId=2&currencyId=${currencyId}`; //make 'walletType' enum and move this id to BankType

    return this.httpClient.get(url).map((data: Wallet[]) => data)
        .catch(this.observableHandleError);

  }

  public getMarketingTypeWallets(): Observable<Wallet[]>{
    const url = `${environment.api.James.domain}/api/ManagementWallet/GetWalletByType?walletTypeId=1`; //make 'walletType' enum and move this id to BankType

    return this.httpClient.get(url).map((data: Wallet[]) => data)
        .catch(this.observableHandleError);
  }

  public getMarketingTypeWalletsByCurrency(currencyId: number): Observable<Wallet[]>{
    const url = `${environment.api.James.domain}/api/ManagementWallet/GetWalletByTypeAndCurrency?walletTypeId=1&currencyId=${currencyId}`; //make 'walletType' enum and move this id to BankType

    return this.httpClient.get(url).map((data: Wallet[]) => data)
        .catch(this.observableHandleError);
  }

  public getManagementWalletsByCurrency(currencyId: number): Observable<Wallet[]>{
    const url = `${environment.api.James.domain}/api/ManagementWallet/GetWalletByCurrency?currencyId=${currencyId}`;

    return this.httpClient.get(url).map((data: Wallet[]) => data)
        .catch(this.observableHandleError);
  }

  searchDeposits(object: DepositSearch) {
    const url = `${environment.api.James.domain}/api/Report/Deposit`;
    //const url = 'http://bb-ci-jamesapi.azurewebsites.net/api/Report/Doposit';

    return this.postData(url, object);
  }

  postData(url, object)
  {
    const body = JSON.stringify(object);
    const headers = new Headers();
    // headers.append('Content-Type', 'application/json');
    // headers.append('Device-Client-Id', 'mydevice1');
    // headers.append('Access-Control-Allow-Origin', '*');

    return this.httpClient.post(url, body).map((data: any) => data)
        .catch(this.observableHandleError);
  }

  private observableHandleError (error: any) {
    console.log(error);
    return Observable.throw(error);
  }

}
