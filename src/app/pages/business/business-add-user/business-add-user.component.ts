import { Component, OnInit, OnDestroy } from '@angular/core';
import { Params, ActivatedRoute } from '@angular/router';
import {Subscription } from 'rxjs';
import {AuthService} from "../../../services/auth.service";
import {Country} from "../../../models/deposit";
import {NotificationService} from "../../../services/notification.service";
import {SpennBusinessUser} from "../../../models/SpennBusiness";
import {LookupService} from '../../../dal/lookup.service'
import { SpennBusinessService } from '../../../dal/spenn-business.service';
import { CustomerService } from '../../../dal/customer.service';
import { StaticDataService } from '../../../services/static.data.service';

@Component({
  providers: [LookupService, SpennBusinessService, CustomerService],
  selector: 'business-add-user',
  styleUrls: ['./business-add-user.component.css'],
  templateUrl: './business-add-user.component.html'
})
export class BusinessAddUserComponent implements OnInit, OnDestroy {
  busy: Subscription;
  countries: Country[]=[];
  submitted = false;
  isSuccessfull = true;
  businessUser = new SpennBusinessUser();
  error: any;

  constructor(private activatedRoute: ActivatedRoute,
              private notif: NotificationService,
              private auth : AuthService,
              private lookupService: LookupService,
              private spennBusinessService: SpennBusinessService,
              private staticDataService: StaticDataService) {
  }

  public ngOnInit() {
    console.log("Spenn Business Add User");
    this.businessUser = new SpennBusinessUser();

    this.activatedRoute.queryParams.forEach((params: Params) => {
      if(Object.getOwnPropertyNames(params).length > 0) {
        this.businessUser.BusinessCustomerGuid = params['businessCustomerGuid'];
        this.businessUser.CountryId = params['countryId'];
      }
    });

    this.busy = this.lookupService.getCountries().subscribe(
      data => {
        this.countries = data;
        var otherCountry: Country = {...new Country (), CountryId: 0, Name: 'Other' };
        this.countries.push(otherCountry);
      },
      error => {
        this.countries =[];
        console.log(error);
      }
    );

    if(this.hasBusinessPermission()) {
      this.staticDataService.getBusinessPermissionGroups().subscribe(
        data => {
          this.businessUser.PermissionGroups = data;
        }, error => {
          console.log(error);
        }
      );
    }
  }

  public onSubmit() {
    try{ 
      this.businessUser.validate();
    } catch(err) {
      this.notif.clear();
      this.notif.error(err, "Invalid Input");
      return ;
    }
    this.busy = this.spennBusinessService.addBusinessUser(this.businessUser)
      .subscribe(
        data => {
          console.log("Added new spenn business user successfully.");
          this.notif.success("Added new business user successfully.");
          this.businessUser.Email = "";
          this.businessUser.Password = "";
          this.businessUser.ConfirmPassword = "";
          this.businessUser.PhoneNumber = "";
          this.businessUser.PermissionGroups.forEach(group => group.Checked = false);
        },
        error => {
          console.log(error);
          this.error = error;
        }
      );
  }

  public ngOnDestroy() {
  }

  hasBusinessPermission(): boolean {
    return this.auth.isUserHasInPermissionGroup("SpennBusinessAdministrator");
  }

  trackByIdx(index: number, obj: any): any {
    return index;
  }
  
}
