import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { BreadcrumbService } from '../../../services/breadcrumb.service';
import {Subscription } from 'rxjs';
import {AuthService} from "../../../services/auth.service";
import {Response} from '@angular/http';
import {Observable} from 'rxjs/Observable';
import {Currency, Country} from "../../../models/deposit";
import {NotificationService} from "../../../services/notification.service";
import {Bank, SpennBusiness} from "../../../models/SpennBusiness";
import {LookupService} from '../../../dal/lookup.service'
import { SpennBusinessService } from '../../../dal/spenn-business.service';
import { CustomerService } from '../../../dal/customer.service';

declare var KF: any;

@Component({
  providers: [LookupService, SpennBusinessService, CustomerService],
  selector: 'business-register',
  styleUrls: ['./business-register.component.css'],
  templateUrl: './business-register.component.html'
})
export class BusinessComponent implements OnInit, OnDestroy {
  busy: Subscription;
  currencies: Currency[]=[];
  countries: Country[]=[];
  banks: Bank[]=[];
  kycTierList = [];
  submitted = false;
  isSuccessfull = true;
  business = new SpennBusiness();
  error: any;

  constructor(private breadServ: BreadcrumbService,
              private router: Router,
              private activatedRoute: ActivatedRoute,
              private notif: NotificationService,
              private auth : AuthService,
              private lookupService: LookupService,
              private spennBusinessService: SpennBusinessService,
              private customerService: CustomerService) {
    // TODO
  }

  public ngOnInit() {
    console.log("Spenn Business");
    this.business.CountryId = 0;

    this.busy = this.lookupService.getCurrencies().subscribe(
      data => {
          this.currencies = data;
      },
      error => {
          this.currencies =[];
          console.log(error);
      }
    );

    this.busy = this.lookupService.getCountries().subscribe(
      data => {
          this.countries = data;
      },
      error => {
          this.countries =[];
          console.log(error);
      }
    );

    this.busy = this.lookupService.getBanks().subscribe(
      data => {
          this.banks = data;
      },
      error => {
          this.banks =[];
          console.log(error);
      }
    );

    this.busy = this.customerService.getKycTierList().subscribe(
      data => {
          this.kycTierList = data;
      },
      error => {
          this.kycTierList =[];
          console.log(error);
      }
    );
  }

  public onSubmit() {
    try{ 
      this.business.validate();
    } catch(err) {
      this.notif.clear();
      this.notif.error(err, "Invalid Input");
      return ;
    }

    this.busy = this.spennBusinessService.registerBusiness(this.business)
      .subscribe(
        data => {
          console.log("Registered new spenn business successfully.");
          this.notif.success("Registered new spenn business successfully.");
          this.router.navigate(['/business-add-user'], {queryParams: {businessCustomerGuid: data.CustomerGuid, countryId: this.business.CountryId}});
        },
        error => {
            console.log(error);
            this.error = error;
        }
      );
  }

  public countryChange(countryId: number) {
    this.business.CurrencyId = 0;
    this.countries.forEach(country => {
      if(country.CountryId == countryId) {
        this.business.CurrencyId = country.DefaultCurrencyId;
        this.currencyChange(this.business.CurrencyId);
        return ;
      }
    });
  }

  public currencyChange(currencyId: number) {
    this.business.BankId = 0;
    this.banks.forEach(bank => {
      if(bank.CurrencyId == currencyId) {
        this.business.BankId = bank.BankId;
        return ;
      }
    });
  }

  public ngOnDestroy() {

  }
  

}
