/**
 * Created by Anupam on 2/28/2017.
 */

import {Injectable} from '@angular/core';


@Injectable()
export class Screen{
    constructor(){

    }

    public isMobileMode(): boolean {
      return window.innerWidth < 768;
    }

    public isNormalMobileMode(): boolean {
        return window.innerWidth > 500 && window.innerWidth < 768;
    }

    public isMiniMobile(): boolean {
        return window.innerWidth < 501;
    }

    public isMobileLandscapeMode(): boolean {
        return window.innerWidth > 320 && window.innerWidth < 500;
    }

    public isTabMode(): boolean {
        return window.innerWidth > 767 && window.innerWidth < 992;
    }

    public isLandscapeTabMode(): boolean {
        return window.innerWidth > 767 && window.innerWidth < 1025;
    }

    public isSmallDesktop(): boolean {
        return window.innerWidth > 991 && window.innerWidth < 1092;
    }

    public isMediumDesktop(): boolean {
        return window.innerWidth > 1091 && window.innerWidth < 1289;
    }

    public isLargeDesktop(): boolean {
        return window.innerWidth > 1288 && window.innerWidth < 1401;
    }

    public isVLargeDesktop(): boolean {
        return window.innerWidth > 1400;
    }
}