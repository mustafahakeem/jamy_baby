import { Injectable } from '@angular/core';
import { Http, Headers, Response } from "@angular/http";
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';
import {Currency, Country} from "../models/deposit";
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import {LookupService} from '../dal/lookup.service';
import {Bank, SpennBusiness, SpennBusinessUser, SpennBusinessUsers, PermissionGroup, SpennBusinessUserCommand} from "../models/SpennBusiness";
import { StaticDataService } from '../services/static.data.service';
import {AuthService} from "../services/auth.service";

@Injectable()
export class SpennBusinessService {
    constructor(private http: Http, 
        private httpClient: HttpClient, 
        private lookupService: LookupService, 
        private staticDataService: StaticDataService,
        private authService: AuthService) {
            if(this.hasBusinessPermission()) {
                this.staticDataService.getBusinessPermissionGroups().subscribe(
                    data => this.permissionGroups = data,
                    error => {
                        console.log("Error loading permission groups");
                    }
                );
            }
    }

    private headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Device-Client-Id': 'mydevice1'
    });

    private permissionGroups = new Array<PermissionGroup>();

    public registerBusiness(business: SpennBusiness) {
        const url = `${environment.api.James.domain}/api/Business/Register`;
        return this.postData(url, business);
    }
   public addBusinessUser(businessUser: SpennBusinessUser) {
        var command = new SpennBusinessUserCommand(businessUser);
        const url = `${environment.api.James.domain}/api/Business/CreateUser`;
        return this.postData(url, command);
    }

    public getBusinessUsers(businessGuid: string): Observable<SpennBusinessUsers>{
        const url = `${environment.api.James.domain}/businessapi/users?customerGuid=${businessGuid}`;
        return this.httpClient.get(url).map((data: any) => {
            return new SpennBusinessUsers(data);
        })
            .catch(this.observableHandleError);
    }

    public getBusinessUserPermissions(userGuid: string): Observable<PermissionGroup[]> {
        const userGroupsUrl = `${environment.api.James.domain}/api/Permission/GetPermissionGroupsByPrincipleId?principleId=` + userGuid;
        return this.httpClient.get(userGroupsUrl).map((data: any) => {
            return PermissionGroup.MergeTwoArrays(PermissionGroup.ConvertToArrayWithChecked(data), this.permissionGroups);
        })
            .catch(this.observableHandleError);
    }

    public updatePaymentApprovalRoleToPrinciple(businessUserPaymentApproval: any) {
        const url = `${environment.api.James.domain}/api/Permission/UpdatePermissionGroupByPrincipleId`;
        return this.postData(url, businessUserPaymentApproval);
    }

    public updateBusinessUserPermissions(user: SpennBusinessUser) {
        var command = {
            BusinessUserGuid: user.UserGuid,
            PermissionGroupGuids: user.PermissionGroups.filter(x => x.Checked).map(x => x.PermissionGroupGuid)
        };
        const url = `${environment.api.James.domain}/api/Permission/UpdatePermissionGroupsByPrincipleId`;
        return this.postData(url, command);
    }

    postData(url, object) {
        const body = JSON.stringify(object);

        return this.httpClient.post(url, body, {headers: this.headers}).map((data: any) => {
            return data;
        })
            .catch(this.observableHandleError);
    }

    private observableHandleError(error: any) {
        console.log(error);
        return Observable.throw(error);
    }

    hasBusinessPermission(): boolean {
        return this.authService.isUserHasInPermissionGroup("SpennBusinessAdministrator");
    }
}
