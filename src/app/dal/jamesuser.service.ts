import { Injectable } from '@angular/core';
import { Http, Headers, Response } from "@angular/http";
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';
import { UserSearch, User, UserDetailView, PermissionGroupView } from "../models/user";
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { StaticDataService } from '../services/static.data.service';
import Any = jasmine.Any;

@Injectable()
export class JamesuserService {

  private permissionGroups = new Array<PermissionGroupView>();

  constructor(private http: Http,
    private httpClient: HttpClient,
    private staticDataService: StaticDataService) {

  }

  searchUsers(object: UserSearch) {
    const url = `${environment.api.James.domain}/api/UserManagement/searchUser`;
    return this.postData(url, object);
  }

  public getUserDetails(userGuid: string): Observable<UserDetailView> {
    const url = `${environment.api.James.domain}/api/UserManagement/userdetails?pricipleId=` + userGuid;

    return this.httpClient.get(url).map((data: any) => {
      return data;
    })
      .catch(this.observableHandleError);
  }


  public updateUserPermissions(user: UserDetailView) {
    var command = {
      UserGuid: user.UserPermissionDto.Id,
      PermissionGroupGuids: user.PermissionGroupViews.filter(x => x.Checked).map(x => x.PermissionGroupGuid)
    };
    const url = `${environment.api.James.domain}/api/UserManagement/UpdatePermissionGroupsByPrincipleId`;
    return this.postData(url, command);
  }
  
  postData(url, object) {
    const body = JSON.stringify(object);
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
