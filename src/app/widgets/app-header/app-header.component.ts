import { Component, Input } from '@angular/core';
import { TranslateService } from 'ng2-translate';
import { AuthService } from '../../services/auth.service';
import { Screen } from '../../services/Screen';
import { environment } from '../../../environments/environment';
import 'jquery';

declare var $: any;

@Component( {
    selector: 'app-header',
    styleUrls: ['./app-header.component.css'],
    templateUrl: './app-header.component.html'
})
export class AppHeaderComponent {

    public loginUrl: string = `${environment.server.IdentityServer.domain}/login?client_id=${environment.bbAuth.clientID}&client_secret=${environment.bbAuth.clientSecret}&redirect_uri=${environment.bbAuth.redirectUrl}&audience=${environment.bbAuth.audience}&scope=${environment.appScopes.join(' ')}`;
    public registerUrl: string = `${environment.server.IdentityServer.domain}/register?client_id=${environment.bbAuth.clientID}&client_secret=${environment.bbAuth.clientSecret}&redirect_uri=${environment.bbAuth.redirectUrl}&audience=${environment.bbAuth.audience}&scope=${environment.appScopes.join(' ')}`;
    constructor( public auth: AuthService,  private screen: Screen) {
        // TODO
        //alert("Hioi");

        $(window).on('resize', function () {
           if(screen.isMobileMode()){
             $('.logo').css("position", "relative");
           }
           else $('.logo').css("position", "fixed");
        });
    }



}
