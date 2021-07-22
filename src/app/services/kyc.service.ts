import { Injectable, OnInit, OnDestroy } from "@angular/core";
import { HttpClient, HttpResponse } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "../../environments/environment";
import { SessionStorageService } from "./sessionStorage.service";
import { CustomerSearchKyc } from "../models/Customer";

@Injectable()
export class KycService implements OnInit, OnDestroy {

    ngOnDestroy(): void {

    }

    kycDetailList: any[];
    storageKey: string = 'kycDetailList';

    constructor(private httpClient: HttpClient, private sessionStorageService: SessionStorageService) { }

    public getKycDetails(customerGuid: string) {
        var index = this.kycDetailList.findIndex(_ => _.Customer.CustomerGuid == customerGuid);
        return this.kycDetailList[index];
    };

    public getNextItem(customerGuid: string) {
        var index = this.kycDetailList.findIndex(_ => _.Customer.CustomerGuid == customerGuid);
        if (index + 1 <= this.kycDetailList.length - 1)
            return this.kycDetailList[index + 1];
        return null;
    };

    public getFirstItem() {
        return this.kycDetailList[0];
    }

    public isLastCustomer(customerGuid: string): boolean {
        var index = this.kycDetailList.findIndex(_ => _.Customer.CustomerGuid == customerGuid);
        return index == this.kycDetailList.length - 1;
    }

    public hasItem(customerGuid: string): boolean {
        if (!this.kycDetailList) return false;
        var index = this.kycDetailList.findIndex(_ => _.Customer.CustomerGuid == customerGuid);
        return index > -1;
    };

    public setKycDetailList(list: any[]) {
        this.kycDetailList = list;
    };

    public loadKycDetailList(customerSearch: CustomerSearchKyc) {

        const url = `${environment.api.James.domain}/api/Kyc/GetKycDetailList`;
        return this.postData(url, customerSearch).toPromise().then(res => {
            if (res.Data.length > 0)
                this.setKycDetailList(res.Data);
            return res.Data;
        });
    };

    public loadSanctionListCount(customerGuid: string) {
        const url = `${environment.api.James.domain}/api/Kyc/GetSanctionListCount?customerGuid=`+customerGuid;
        return this.httpClient.get(url).map((data: any) => {
            console.log(data);
            return data;
        });
    };
    public getRejectionReasons() {
        const url = `${environment.api.James.domain}/api/Kyc/GetRejectionReasons`;
        return this.httpClient.get(url).map((data: any) => {
            return data;
        });
    };
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

    ngOnInit() {
        this.kycDetailList = new Array();
    };

    public escalateCustomersKyc(object: any) {
        const url = `${environment.api.James.domain}/api/Kyc/JamesVerificationEscalation`;
        return this.postData(url, object);
    };

}