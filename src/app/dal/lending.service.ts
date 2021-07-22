import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { environment } from '../../environments/environment';
import { CustomerLoanQueryRequest, LoanApplicationCommand, LoanApplicationQueryRequest } from '../models/lending';

@Injectable()
export class LendingService {

  loanApplicationDetailList: any[];

  private headers = new Headers({
    'Content-Type': 'application/json',
    'Device-Client-Id': 'mydevice1'
  });

  constructor(private httpClient: HttpClient) { }

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

  public getLoanApplicationList(object: LoanApplicationQueryRequest) {
    const url = `${environment.api.James.domain}/api/Loan/GetLoanApplications`;
    return this.postData(url, object);
  }

  public customerLoanDetails(object: CustomerLoanQueryRequest) {
    const url = `${environment.api.James.domain}/api/Loan/CustomerLoans`;
    return this.postData(url, object);
  }

  public getLoanApplicationByGuid(loanApplicationGuid: string, customerGuid: string) {
    const url = `${environment.api.James.domain}/api/Loan/GetLoanApplicationByGuid?loanApplicationGuid=${loanApplicationGuid}&customerGuid=${customerGuid}`;
    return this.httpClient.get(url).map((data: any) => data)
      .catch(this.observableHandleError);
  }

  public ApproveLoanApplication(object: LoanApplicationCommand) {
    const url = `${environment.api.James.domain}/api/Loan/Approve`;
    return this.postData(url, object);
  }

  public RejectLoanApplication(object: LoanApplicationCommand) {
    const url = `${environment.api.James.domain}/api/Loan/Reject`;
    return this.postData(url, object);
  }

  public loadLoanApplicationDetailList(loanApplicationSearch: LoanApplicationQueryRequest) {

    const url = `${environment.api.James.domain}/api/Loan/GetLoanApplications`;
    return this.postData(url, loanApplicationSearch).toPromise().then(res => {
      if (res.Data.length > 0)
        this.setLoanApplicationDetailList(res.Data);
      return res.Data;
    });
  };

  public setLoanApplicationDetailList(list: any[]) {
    this.loanApplicationDetailList = list;
  };

  public isLastLoanApplication(loanApplicationGuid: string): boolean {
    var index = this.loanApplicationDetailList.findIndex(_ => _.LoanApplicationGuid == loanApplicationGuid);
    return index == this.loanApplicationDetailList.length - 1;
}
  public hasItem(loanApplicationGuid: string): boolean {
    if (!this.loanApplicationDetailList) return false;
    var index = this.loanApplicationDetailList.findIndex(_ => _.LoanApplicationGuid == loanApplicationGuid);
    return index > -1;
  };

  public getLoanApplicationDetails(loanApplicationGuid: string) {
    var index = this.loanApplicationDetailList.findIndex(_ => _.LoanApplicationGuid == loanApplicationGuid);
    return this.loanApplicationDetailList[index];
};

public getNextItem(loanApplicationGuid: string) {
  var index = this.loanApplicationDetailList.findIndex(_ => _.LoanApplicationGuid == loanApplicationGuid);
  if (index + 1 <= this.loanApplicationDetailList.length - 1)
      return this.loanApplicationDetailList[index + 1];
  return null;
};

}
