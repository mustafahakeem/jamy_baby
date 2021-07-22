import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs/Rx';
import { Http, Response } from '@angular/http';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
//import {Http, URLSearchParams, Headers, Response} from '@angular/http';

@Injectable()
export class CanActivateGuard implements CanActivate {
  constructor(private auth: AuthService, private router: Router) { }

  public canActivate() {
    let isAuth = this.auth.isAuthenticated();

    if (isAuth !== true) {
      this.auth.login();
    }

    return isAuth;
  }
}

@Injectable()
export class CanActivateWithAuthenticationGuard implements CanActivate {
  constructor(private auth: AuthService, private router: Router) { }

  public canActivate(): Observable<boolean> {
    this.auth.checkAuthFromLocalStorage();

    let isAuth = this.auth.isAuthenticated();

    if (!this.auth.token) this.auth.login();

    if (this.auth.token && this.auth.isTokenExpired()) return this.auth.renewToken()
      .map((d: Response) => this.auth.isAuthenticated())
      .catch((res: Response) => {
        this.auth.login();
        return Observable.throw(res);
      });

    return Observable.of(isAuth);
  }
}

@Injectable()
export class CanActivateWithAuthenticatedAndVerifiedGuard implements CanActivate {
  constructor(private auth: AuthService, private router: Router) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {

    this.auth.checkAuth();

    if (!this.auth.token) {
      this.auth.login();
      return;
    }

    if (this.auth.token && this.auth.isTokenExpired()) {
      return this.auth.renewToken().map((d: Response) => {
        return this.auth.isAuthenticated() && this.auth.isVerified();
      }).catch((res: Response) => {
        this.auth.login();
        return Observable.throw(res);
      });
    }

    let isAuth = this.auth.isAuthenticated();
    let isVerified = this.auth.isVerified();
    if (!isVerified) this.router.navigate(['/info'], { queryParams: { q: "unverified" } });
    var isAuthorized = this.auth.CheckAuthorization(next);
    return Observable.of(isAuth && isVerified && isAuthorized);
  }
}

@Injectable()
export class CanActivateWithAuthenticatedAndVerifiedGuard2 implements CanActivate {
  constructor(private auth: AuthService, private router: Router, private http: Http, private httpClient: HttpClient) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {

    return this.auth.checkAuth2().flatMap(() => {

      if (!this.auth.token) {
        this.auth.login();
        return Observable.of(false);
      }

      if (this.auth.token && this.auth.isTokenExpired()) {
        console.log("renew token:  call from canActivate");
        return new Observable<boolean>(() => {
          this.auth.refreshTokenAsync()
            .map(() => {
              return this.auth.isAuthenticated() && this.auth.isVerified();
            })
            .catch(() => {
              this.auth.logout();
              return Observable.empty();
            });
        });
      }

      let isAuth = this.auth.isAuthenticated();
      let isVerified = this.auth.isVerified();
      console.log(this.auth.token);
            if (!isVerified) this.router.navigate(['/info'], { queryParams: { q: "unverified" } });
      //this.auth.updateUserInfo();

      var isAuthorized = this.auth.CheckAuthorization(next);
      return Observable.of(isAuth && isVerified && isAuthorized);

    });

  }

}
