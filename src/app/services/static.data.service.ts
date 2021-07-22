import { Injectable, OnInit } from "@angular/core";
import { LookupService } from "../dal/lookup.service";
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import { database } from "firebase";
import { Country, Currency } from "../models/deposit";
import { PermissionGroup } from "../models/SpennBusiness";
import {PermissionGroupView} from "../models/user";

@Injectable()
export class StaticDataService implements OnInit {

    private countryList = new Array<Country>();
    private currencyList = new Array<Currency>();
    private businessPermissionGroupList = new Array<PermissionGroup>();
    private jamesUserPermissionGroupList = new Array<PermissionGroupView>();
    private countryDict = {};
    private currencyDict = {};

    constructor(private lookupService: LookupService) {

    };

    public getCountryDict(): Observable<any> {

        return this.getCountryList().map(countries => {
            if (Object.keys(this.countryDict).length == 0) {
                countries.forEach(country => {
                    this.countryDict[country.CountryId] = country;
                });
            }

            return this.countryDict;
        });
    }

    public getCurrencyDict(): Observable<any> {

        return this.getCurrencyList().map(currencies => {
            if (Object.keys(this.currencyDict).length == 0)
                currencies.forEach(currency => {
                    this.currencyDict[currency.CurrencyId] = currency;
                });
            return this.currencyDict;
        });
    }
    
    public getCountryList(): Observable<Country[]> {
        if (this.countryList.length != 0) {
            return Observable.of(this.countryList);
        } else {
            return this.lookupService.getCountries().map(countries => {
                this.countryList = countries;
                return countries;
            })
        }
    };

    public getCurrencyList(): Observable<Currency[]> {
        if (this.currencyList.length != 0) {
            return Observable.of(this.currencyList);
        } else {
            return this.lookupService.getCurrencies().map(currencies => {
                this.currencyList = currencies;
                return currencies;
            })
        }
    };

    public getBusinessPermissionGroups(): Observable<PermissionGroup[]> {
        if(this.businessPermissionGroupList.length != 0) {
            return Observable.of(this.businessPermissionGroupList);
        } else {
            return this.lookupService.getBusinessPermissionGroups().map(groups => {
                this.businessPermissionGroupList = groups;
                return groups;
            })
        }
    };
    public getJamesUserPermissionGroups(): Observable<PermissionGroupView[]> {
        if(this.jamesUserPermissionGroupList.length != 0) {
            return Observable.of(this.jamesUserPermissionGroupList);
        } else {
            return this.lookupService.getJamesUserPermissionGroups().map(groups => {
                this.jamesUserPermissionGroupList = groups;
                return groups;
            })
        }
    };

    ngOnInit(): void {
        this.getCountryList();
        this.getCurrencyList();
    }

}