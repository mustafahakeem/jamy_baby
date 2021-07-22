import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { environment } from '../../environments/environment';
import { Http } from '@angular/http';
import { HttpClient } from '@angular/common/http';
import { DepositSearch, Deposit, Currency, Wallet, Country } from "../models/deposit";
import { Bank, PermissionGroup } from "../models/SpennBusiness";
import { PermissionGroupView } from "../models/user";
import 'rxjs/add/operator/map';

@Injectable()
export class LookupService {

  constructor(private http: Http, private httpClient: HttpClient) { }

  public getCountries(): Observable<Country[]> {
    const url = `${environment.api.Blockbonds.domain}/Lookup/Country`;

    return this.httpClient.get(url).map((data: Country[]) => data)
        .catch(this.observableHandleError);
  }

  public getCurrencies(): Observable<Currency[]> {
    const url = `${environment.api.Blockbonds.domain}/Lookup/Currency`;

    return this.httpClient.get(url).map((data: Currency[]) => data)
        .catch(this.observableHandleError);
  }

  public getBanks(): Observable<Bank[]> {
    const url = `${environment.api.Blockbonds.domain}/Lookup/Bank`;

    return this.httpClient.get(url).map((data: Bank[]) => data)
        .catch(this.observableHandleError);
  }

  public getBusinessPermissionGroups() : Observable<PermissionGroup[]> {
    const businessPermissionGroupsUrl = `${environment.api.James.domain}/api/Business/permissiongroups`;
    return this.httpClient.get(businessPermissionGroupsUrl).map((data: Response) => PermissionGroup.ConvertToArray(data))
        .catch(this.observableHandleError);
  }

  public getJamesUserPermissionGroups(): Observable<PermissionGroupView[]> {
    const userPermissionGroupsUrl = `${environment.api.James.domain}/api/UserManagement/PermissionGroups`;
    return this.httpClient.get(userPermissionGroupsUrl).map((data: Response) => PermissionGroupView.ConvertToArray(data))
      .catch(this.observableHandleError);
  }

  private observableHandleError(error: any) {
    console.log(error);
    return Observable.throw(error);
  }

}
