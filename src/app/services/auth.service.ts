import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { AngularFireDatabase } from '@angular/fire/database';
import { NotificationService } from './notification.service';

import { Router, ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';

//let auth0Lock = require('auth0-lock').default;
import { environment } from '../../environments/environment';
import { Token } from "../models/Token";
import { Http, URLSearchParams, Headers, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Subject } from "rxjs/Subject";


@Injectable()
export class AuthService {
  // private lock: Auth0LockStatic;
  private auth: any;
  private profile: any;
  public token: Token;
  private jwtHelper: JwtHelperService = new JwtHelperService();
  private refreshTokenCall: Observable<Response>;
  private accessTokenCall: Observable<Response>;
  private x = 0;
  private isRenewTokenCalled = false;
  private isAuthenticatedsubject: Subject<boolean> = new Subject();
  private renewTokensubject: Subject<Response> = new Subject();

  refreshTokenInProgress = false;

  tokenRefreshedSource = new Subject();
  tokenRefreshed$ = this.tokenRefreshedSource.asObservable();

  readonly tokenEndPoint = `${environment.server.IdentityServer.domain}/token`;

  constructor(private af: AngularFireDatabase,
    private notif: NotificationService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private http: Http) {
    this.profile = this.getProfile();
  }

  public getUserEmail = (): string => {
    return "";
  }

  public getUserPicture = (): string => {
    return "/public/assets/img/avatar.png";
  }

  public getUserName = (): string => {
    var tokenObject = this.jwtHelper.decodeToken(this.token.accessToken);
    return tokenObject != null ? tokenObject.unique_name : "";
  }

  public getUserId = (): string => {
    var tokenObject = this.jwtHelper.decodeToken(this.token.accessToken);
    return tokenObject != null ? tokenObject.sub : "";
  }

  public login = (): void => {
    // const jamesTestUrl = `${environment.api.James.domain}/api/Test`;
    // const isTestUrl = `${environment.server.IdentityServer.domain}/api/Test`;
    // this.http.get(jamesTestUrl).map((data: any) => data).subscribe();
    // this.http.get(isTestUrl).map((data: any) => data).subscribe();
  
    this.notif.success("", "Redirection to Login Page...");
    window.location.href = `${environment.server.IdentityServer.domain}/OAuth/Authorize?client_id=${environment.bbAuth.clientID}&redirect_uri=${environment.bbAuth.redirectUrl}&audience=${environment.bbAuth.audience}&scope=${environment.appScopes.join(' ')}&response_type=code`;
  }

  // public logout = (): void => {
  //   localStorage.removeItem('id_token');
  //   this.af.auth.logout();
  //   this.profile = null;
  //   this.notif.success('You successfully loged out');
  // }
  public logout = (): void => {
    console.log("logout....");
    localStorage.removeItem('bb_token');
    this.token = null;
    // this.af.auth.logout();
    // this.profile = null;
    this.notif.success('You successfully logged out');
    window.location.href = `${environment.server.IdentityServer.domain}/api/Account/logout?redirect_uri=${environment.bbAuth.redirectUrl}`;
  }

  public isAuthenticated = (): boolean => {
    if (!this.token) return false;
    return !this.jwtHelper.isTokenExpired(this.token.accessToken);
  }

  public isAuthenticatedAsync = (): Observable<boolean> => {
    if (!this.token) return Observable.of(false);

    if (!this.jwtHelper.isTokenExpired(this.token.accessToken)) return Observable.of(true);

    if (this.refreshTokenInProgress) return this.isAuthenticatedsubject;
    else {
      console.log("renew token:  call from isAuthenticatedAsync");
      this.refreshTokenAsync().subscribe((data) => {
        this.isAuthenticatedsubject.next(true);
      });
      return this.isAuthenticatedsubject;
    }
  }


  public isAuthorized(allowedRoles: string[]): boolean {
    // ByPass rolewise menue Show hide feature if it is disabled
    if (!environment.uiPermission.enableMenueShowHideBasedOnUserRole) {
      return true;
    }
    if (allowedRoles == null || allowedRoles.length === 0) {
      return true;
    }
    if (!this.isAuthenticated()) {
      console.log("Not authenticated");
      return false;
    }
    var permissionGroups = this.token.permissionGroups;
    console.log("Current Permissions: " + permissionGroups);
    // check if the user roles is in the list of allowed roles, return true if allowed and false if not allowed
    return allowedRoles.some(x => permissionGroups.indexOf(x) > -1);
  }

  refreshTokenAsync() {
    if (this.refreshTokenInProgress) {
      return new Observable(observer => {
        this.tokenRefreshed$.subscribe(() => {
          observer.next();
          observer.complete();
        });
      });
    } else {
      this.refreshTokenInProgress = true;

      return this.renewToken()
        .do(() => {
          this.refreshTokenInProgress = false;
          this.tokenRefreshedSource.next();
        });
    }
  }

  public renewTokenAsync = (): Observable<Response> => {
    if (this.isRenewTokenCalled) return this.renewTokensubject;
    else {
      this.renewToken().subscribe((data) => {
        this.renewTokensubject.next(data);
      });
      return this.renewTokensubject;
    }
  }

  public isTokenExpired = (): boolean => {
    return this.jwtHelper.isTokenExpired(this.token.accessToken);
  }

  public isVerified = (): boolean => {
    if (!this.token || !this.token.accessToken) return false;
    // var groupClaim = this.jwtHelper.decodeToken(this.token.accessToken).group;

    var groupClaim = this.token.permissionGroups;
    // if(groupClaim == "JamesBasic") return true;

    if (Array.isArray(groupClaim) && groupClaim.indexOf("JamesBasic") > -1)
      return true;

    return false;
  }

  public checkVerificationAndRedirect = (): void => {
    if (!this.isVerified()) this.router.navigate(['/info'], { queryParams: { q: "unverified" } });
  }

  private getProfile = () => {
    // let profile = localStorage.getItem('profile');
    //
    // if (profile) {
    //   return JSON.parse(profile);
    // }

    return null;
  }

  // private generateLockOption = (): Auth0LockConstructorOptions => {
  //   return {
  //     additionalSignUpFields: [
  //       { name: 'name', placeholder: 'Your name' }
  //     ]
  //   };
  // }

  private generateAuthOption = (token: string): any => {
    return {
      api: 'firebase',
      id_token: token,
      scope: 'openid name email displayName',
      target: 'uyZPfupm9XEM2jdDwiz9xGmvDnly5ydU'
    };
  }

  public checkAuth = (): void => {
    var accessTokenFromQp = this.getQueryParameterByName("access_token");
    var refreshTokenFromQp = this.getQueryParameterByName("refresh_token");
    if (accessTokenFromQp && refreshTokenFromQp) {
      this.token = new Token({ access_token: accessTokenFromQp, refresh_token: refreshTokenFromQp });
      localStorage.setItem('bb_token', JSON.stringify(this.token));
      this.router.navigate(['']);
      this.notif.success('You successfully logged In');
      console.log(this.jwtHelper.decodeToken(this.token.accessToken));
    } else {
      this.checkAuthFromLocalStorage();
    }
    console.log(this.token);
  }
  
  public checkAuth2 = (): Observable<any> => {
    var authCodeFromQp = this.getQueryParameterByName("code");
    if (authCodeFromQp) {
      let command = new URLSearchParams();
      command.append('grant_type', "authorization_code");
      command.append('client_id', environment.bbAuth.clientID);
      command.append('client_secret', environment.bbAuth.clientSecret);
      command.append('audience', environment.bbAuth.audience);
      command.append('code', authCodeFromQp);
      command.append('redirect_uri', environment.bbAuth.redirectUrl);

      var accesstokencall = this.http.post(this.tokenEndPoint, command.toString()).flatMap((token: Response) => {
        this.token = new Token(token.json());
        if (this.isAuthenticated()) {
          this.updateUserInfo();
        }
        var headers = new Headers();
        headers.set('Authorization', `Bearer ${this.token.accessToken}`);
        const userGroupsUrl = `${environment.api.James.domain}/api/Permission/GetGroupNamesByPrincipleId?principleId=` + this.getUserId();     
        return this.http.get(userGroupsUrl, {
          headers: headers
        }).map(
          data => {
            console.log(data);
            this.token.permissionGroups = data.json();

            localStorage.setItem('bb_token', JSON.stringify(this.token));

            if(localStorage.getItem('last_Url')){
              this.router.navigate([localStorage.getItem('last_Url')]);
            }else
             this.router.navigate(['']);
            this.notif.success('You successfully logged In');
          },
          error => {
            console.log(error);
            this.auth.login();
          }
        );

      });
      

      return accesstokencall;
    } else {
      return this.checkAuthFromLocalStorage2();
    }
  }

  public updateUserInfo = (): void => {
    var authCodeFromQp = this.getQueryParameterByName("code");
    if (!authCodeFromQp || !this.token) {
      return;
    }
    console.log("Updating user info");
    var headers = new Headers();
    headers.set('Authorization', `Bearer ${this.token.accessToken}`);
    const url = `${environment.api.James.domain}/api/Customer/RetriveUserInfo?guid=` + this.getUserId();
    this.http.get(url, {
      headers: headers
    }).subscribe(
      data => {
        console.log(data);
      },
      error => {
        console.log(error);
      }
    );
  }

  public checkAuthFromLocalStorage = (): void => {
    var tokenString = localStorage.getItem('bb_token');
    if (tokenString) this.token = JSON.parse(tokenString);
  }

  public checkAuthFromLocalStorage2 = (): Observable<Token> => {
    var tokenString = localStorage.getItem('bb_token');
    if (tokenString) {
      this.token = JSON.parse(tokenString);
      return Observable.of(this.token);
    }
    return Observable.of(null);
  }

  public renewToken = (): Observable<Response> => {

    if (this.isRenewTokenCalled) {
      return this.refreshTokenCall;
    }

    let refreshTokenCommand = new URLSearchParams();
    refreshTokenCommand.append('grant_type', "refresh_token");
    refreshTokenCommand.append('client_id', environment.bbAuth.clientID);
    refreshTokenCommand.append('client_secret', environment.bbAuth.clientSecret);
    refreshTokenCommand.append('audience', environment.bbAuth.audience);
    refreshTokenCommand.append('refresh_token', this.token.refreshToken);
    console.log("renew token");
    this.refreshTokenCall = this.http.post(this.tokenEndPoint, refreshTokenCommand.toString()).map((token: Response) => {
      var permissionGroups = this.token.permissionGroups;
      this.token = new Token(token.json());
      this.token.permissionGroups = permissionGroups;
      localStorage.setItem('bb_token', JSON.stringify(this.token));
      return token;
    }
    ).catch(this.observableHandleError)
      .finally(() => {
        this.isRenewTokenCalled = false;
      });

    this.isRenewTokenCalled = true;
    return this.refreshTokenCall;
  }

  private observableHandleError = (error: any) => {
    console.log(error);
    this.logout();
    return Observable.throw(error);
  }

  public getQueryParameterByName = (name: string): string => {
    let url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");

    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
      results = regex.exec(url);

    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
  }

  public isUserHasInPermissionGroup = (groupName: string): boolean => {
    var permissionGroups = JSON.parse(localStorage.bb_token).permissionGroups;
    if (!permissionGroups) return false;
    return permissionGroups.indexOf(groupName) >= 0;
  }

  public CheckAuthorization(next: ActivatedRouteSnapshot): boolean {
    const allowedRoles = next.data.allowedRoles;
    const fallBackPath = next.data.fallBackPath;
    const isAuthorized = this.isAuthorized(allowedRoles);

    if (!isAuthorized) {
      // if not authorized, show access denied message
      if (fallBackPath != undefined) {
        this.router.navigate([fallBackPath]);
      }
      else {
        this.router.navigate(['/accessdenied']);
      }
    }
    return isAuthorized;
  }
}
