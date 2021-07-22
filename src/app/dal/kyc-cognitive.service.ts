import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { environment } from '../../environments/environment';
import { Http } from '@angular/http';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormRecognizerModelInfo, KycIdCard, KycModelSearch } from "../models/kyc-cognitive";
import 'rxjs/add/operator/map';


@Injectable()
export class KycCognitiveService {

  constructor(private http: Http, private httpClient: HttpClient) { }

  private headers = new HttpHeaders({
    'Content-Type': 'application/json',
    'Device-Client-Id': 'mydevice1'
  });

  public getKycIdCardList(): Observable<KycIdCard[]> {
    const url = `${environment.api.James.domain}/api/Kyc/GetKycIdCardList`;

    return this.httpClient.get(url).map((data: any) => data)
      .catch(this.observableHandleError);
  }
  public getFormModels(object: KycModelSearch): Observable<any> {
    const url = `${environment.api.James.domain}/api/Kyc/GetFormModels`;
    return this.postData(url, object);
  }

  public addUpdateFormRecognizerModelInfo(modelInfo: FormRecognizerModelInfo) {
    const url = `${environment.api.James.domain}/api/Kyc/UpdateKycFormRecognizerModelInfo`;
    return this.postData(url, modelInfo);
  }

  postData(url, object) {
    const body = JSON.stringify(object);
    return this.httpClient.post(url, body, { headers: this.headers }).map((data: any) => {
      return data;
    })
      .catch(this.observableHandleError);
  }

  private observableHandleError(error: any) {
    console.log(error);
    return Observable.throw(error);
  }

}
