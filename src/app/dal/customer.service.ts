import { Injectable } from '@angular/core';
import { Http, Headers, Response } from "@angular/http";
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';
import {
    CustomerSearch, CustomerProfile, CustomerAccount, AccountView, CustomerSearchView, AccountHistoryQueryRequest
    , BasicKycInformationView, ThirdPartyKyc, AnxKyc, SmsQueryRequest, CustomerSearchKyc, ReviewKycCommand
    , KycSwapImageCommand, PasswordResetRequest, ManualKycCommand, AdditionalKycFileView, AdditionalKycFileCommand
} from "../models/Customer";
import { environment } from '../../environments/environment';
import { HttpClient, HttpRequest, HttpEvent, HttpHeaders } from '@angular/common/http';
import Any = jasmine.Any;
import { Country } from '../models/deposit';
import { noUndefined } from '@angular/compiler/src/util';


@Injectable()
export class CustomerService {
    reviewCustomerKyc(reviewKycCommad: ReviewKycCommand): any {
        const url = `${environment.api.James.domain}/api/Kyc/JamesVerificationReview`;

        return this.postData(url, reviewKycCommad);

    }

    private headers = new Headers({
        'Content-Type': 'application/json',
        'Device-Client-Id': 'mydevice1'
    });

    constructor(private httpClient: HttpClient) { }

    public getCustomerDetail(customerGuidOrRewardCode: string): Observable<CustomerProfile> {
        const url = `${environment.api.James.domain}/api/Customer/GetCustomer?customerGuidOrRewardCode=` + customerGuidOrRewardCode;

        return this.httpClient.get(url).map((data: CustomerProfile) => data)
            .catch(this.observableHandleError);
    }

    public getCustomerByRewardCodeOrPhoneNumber(
        rewardCodeOrPhoneNumber: string
    ): Observable<CustomerSearchView> {
        const url =
            `${environment.api.James.domain}/api/Customer/GetCustomerByRewardCodeOrPhoneNumber?rewardCodeOrPhoneNumber=` +
            encodeURIComponent(rewardCodeOrPhoneNumber.trim());
        return this.httpClient
            .get(url)
            .map((data: any) => data)
            .catch(this.observableHandleError);
    }

    public getCustomerAccounts(customerGuid: string): Observable<CustomerAccount[]> {
        const url = `${environment.api.James.domain}/api/Customer/GetCustomerAccounts?customerGuid=` + customerGuid;

        return this.httpClient.get(url).map((data: CustomerAccount[]) => data)
            .catch(this.observableHandleError);
    }

    public getCustomerSms(object: SmsQueryRequest): Observable<any> {
        const url = `${environment.api.James.domain}/api/Customer/Sms`;
        return this.postData(url, object);
    }

    public getCustomerBalanceByCustomerId(customerGuid: string): Observable<AccountView[]> {
        const url = `${environment.api.James.domain}/api/Fund/BalanceByCustomerId?customerGuid=` + customerGuid;

        return this.httpClient.get(url).map((data: AccountView[]) => data)
            .catch(this.observableHandleError);
    }

    public getKycInformation(customerGuid: string) {
        const url = `${environment.api.James.domain}/api/Customer/GetKycInformation?customerGuid=` + customerGuid;

        return this.httpClient.get(url).map((data: any) => data)
            .catch(this.observableHandleError);
    }
    public verifyJames(reviewKycCommad: ReviewKycCommand) {
        const url = `${environment.api.James.domain}/api/Kyc/JamesVerification`;

        return this.postData(url, reviewKycCommad);
    }

    public changeKycManually(body: ManualKycCommand) {
        const url = `${environment.api.James.domain}/api/Kyc/ManualChange`;
        return this.httpClient.put(url, body)
    };

    public getKycResuestResponses(customerGuid: string) {
        const url = `${environment.api.James.domain}/api/Kyc/CustomerKycRequestResponses?customerGuid=${customerGuid}`;
        return this.httpClient.get(url)
    };

    public swapImages(kycSwapImageCommand: KycSwapImageCommand) {
        const url = `${environment.api.James.domain}/api/Kyc/SwapImages`;

        return this.postData(url, kycSwapImageCommand);
    }

    accountHistory(object: AccountHistoryQueryRequest) {
        const url = `${environment.api.James.domain}/api/Fund/AccountHistory`;
        return this.postData(url, object);
    }

    accountHistoryTransactionDetails(transactionId: string) {
        const url = `${environment.api.James.domain}/api/Fund/GetAccountHistoryTransactionDetails?transactionId=` + transactionId;
        return this.httpClient.get(url).map((data: Response) => data)
            .catch(this.observableHandleError);
    }

    public getCustomerByRewardCode(rewardCode: string): Observable<CustomerSearchView> {
        const url = `${environment.api.James.domain}/api/Customer/GetCustomerByRewardCode?rewardCode=` + rewardCode;

        return this.httpClient.get(url).map((data: CustomerSearchView) => data)
            .catch(this.observableHandleError);
    }

    searchCustomers(object: CustomerSearch) {
        const url = `${environment.api.James.domain}/api/Customer/SearchCustomer`;
        return this.postData(url, object);
    }

    searchCustomersKyc(object: CustomerSearchKyc) {
        const url = `${environment.api.James.domain}/api/Kyc/SearchCustomerForKyc`;
        return this.postData(url, object);
    }

    resetRecoveryWordsAndView(object: any) {
        const url = `${environment.api.James.domain}/api/Customer/ResetRecoveryWordsAndView`;
        return this.postData(url, object);
    }

    resetSpennBusinessUserPassword(object: any) {
        const url = `${environment.api.James.domain}/api/Business/user/resetpassword`;
        return this.postData(url, object);
    }

    removeUserFromBusiness(object: any) {
        const url = `${environment.api.James.domain}/api/Business/user/remove`;
        return this.postData(url, object);
    }

    public registerExistingCustomerBusiness(object: any) {
        const url = `${environment.api.James.domain}/api/Business/RegisterExistingUser`;
        return this.postData(url, object);
    }

    sendSmsCustomer(object: any) {
        const url = `${environment.api.James.domain}/api/Customer/SendSms`;
        return this.postData(url, object);
    }

    public registerExistingSpennBusinessCustomerToSpenn(object: any) {
        const url = `${environment.api.James.domain}/api/Business/RegisterExistingSBCustomerToSpenn`;
        return this.postData(url, object);
    }


    lockCustomer(object: any) {
        const url = `${environment.api.James.domain}/api/Customer/Lock`;
        return this.postData(url, object);
    }
    approvePasswordResetRequest(object: any) {
        const url = `${environment.api.James.domain}/api/Customer/Update/PasswordRequest`;
        return this.postData(url, object);
    }

    unLockCustomer(object: any) {
        const url = `${environment.api.James.domain}/api/Customer/UnLock`;
        return this.postData(url, object);
    }

    updateKycTier(object: any) {
        const url = `${environment.api.James.domain}/api/Customer/UpdateKycTier`;
        return this.postData(url, object);
    }

    changeCustomerName(object: any) {
        const url = `${environment.api.James.domain}/api/Customer/ChangeName`;
        return this.postData(url, object);
    }

    approveBusinessPermission(object: any) {
        const url = `${environment.api.James.domain}/api/Kyc/ApprovePlusRegistrationStatus`;
        return this.postData(url, object);
    }

    public changeOnlineFlag(object: any) {
        const url = `${environment.api.James.domain}/api/Shop/Change/IsOnline`;
        return this.postData(url, object);
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

    getCountries() {
        const url = `${environment.api.James.domain}/api/Customer/GetCountries`;
        return this.httpClient.get(url).map((data: Country) => data)
            .catch(this.observableHandleError);
    }
    getCustomerPasswordRequests(customerGuid: string) {
        const url = `${environment.api.James.domain}/api/Customer/PasswordRequest?customerGuid=${customerGuid}`;
        return this.httpClient.get(url).map((data: any) => data)
            .catch(this.observableHandleError);
    }

    getKycTierList() {
        const url = `${environment.api.James.domain}/api/Kyc/KycTierList`;
        return this.httpClient.get(url).map((data: any) => data)
            .catch(this.observableHandleError);
    }

    getKycDocumentTypeList() {
        const url = `${environment.api.James.domain}/api/Kyc/KycDocumentTypes`;
        return this.httpClient.get(url).map((data: any) => data)
            .catch(this.observableHandleError);
    }

    getReferredCutomerCount(rewardCode: string) {
        const url = `${environment.api.James.domain}/api/Customer/GetReferredCustomerByRewardCode?rewardCode=${rewardCode}`;
        return this.httpClient.get(url).map((data: any) => data)
            .catch(this.observableHandleError);
    }

    unverifyAllReferredCutomers(object: any) {
        const url = `${environment.api.James.domain}/api/Kyc/UnverifyBulkByRewardCode`;
        return this.postData(url, object);
    }

    uploadAdditionalKycFile(command: AdditionalKycFileCommand, files: FileList): Observable<HttpEvent<any>> {

        const formData: FormData = new FormData();
        formData.append('command', JSON.stringify(command));

        for (var i = 0; i < files.length; i++) {
            formData.append("file", files[i]);
        }

        const url = `${environment.api.James.domain}/api/Customer/UploadAdditionalKycFiles`;
        return this.httpClient.post(url, formData).map((data: any) => {
            return data;
        }).catch(this.observableHandleError);
    }

    getAdditionalKycFiles(customerGuid: string): Observable<AdditionalKycFileView[]> {
        const url = `${environment.api.James.domain}/api/Customer/GetAdditionalKycFiles?customerGuid=${customerGuid}`;

        return this.httpClient.get(url).map((data: any) => data)
            .catch(this.observableHandleError);
    }
}
