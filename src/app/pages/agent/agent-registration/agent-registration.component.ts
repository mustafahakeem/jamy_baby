import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { BreadcrumbService } from '../../../services/breadcrumb.service';
import {Subscription } from 'rxjs';
import {AuthService} from "../../../services/auth.service";
import {Response} from '@angular/http';
import {Observable} from 'rxjs/Observable';
import {Currency, Country} from "../../../models/deposit";
import {NotificationService} from "../../../services/notification.service";
import {Bank} from "../../../models/SpennBusiness";
import {LookupService} from '../../../dal/lookup.service'
import { CustomerService } from '../../../dal/customer.service';
import { AgentService } from 'app/dal/agent.service';
import { Agent } from 'app/models/agent';

declare var KF: any;

@Component({
  providers: [LookupService, AgentService, CustomerService],
  selector: 'agent-registration',
  styleUrls: ['./agent-registration.component.css'],
  templateUrl: './agent-registration.component.html'
})
export class AgentRegistrationComponent implements OnInit {
  busy: Subscription;
  currencies: Currency[]=[];
  countries: Country[]=[];
  banks: Bank[]=[];
  kycTierList = [];
  submitted = false;
  isSuccessfull = true;
  agent = new Agent();
  agentCreated: boolean = false;
  agentNumber: number = 0;
  error: any;

  constructor(private breadServ: BreadcrumbService,
              private router: Router,
              private activatedRoute: ActivatedRoute,
              private notif: NotificationService,
              private auth : AuthService,
              private lookupService: LookupService,
              private agentService: AgentService,
              private customerService: CustomerService) {
    // TODO
  }

  public ngOnInit() {
    this.agent.CountryId = 0;

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
      this.agent.validate();
    } catch(err) {
      this.notif.clear();
      this.notif.error(err, "Invalid Input");
      return ;
    }

    this.busy = this.agentService.registerAgent(this.agent)
      .subscribe(
        data => {
          console.log("Registered new Agent successfully.");
          this.notif.success("Registered new Agent successfully.");
          this.agent = new Agent();
          this.router.navigate(['/agent-details/' + data.AgentNumber]);
        },
        error => {
            console.log(error);
            this.error = error;
        }
      );
  }

  public countryChange(countryId: number) {
    this.agent.CurrencyId = 0;
    this.countries.forEach(country => {
      if(country.CountryId == countryId) {
        this.agent.CurrencyId = country.DefaultCurrencyId;
        this.currencyChange(this.agent.CurrencyId);
        return ;
      }
    });
  }

  public currencyChange(currencyId: number) {
    this.agent.BankId = 0;
    this.banks.forEach(bank => {
      if(bank.CurrencyId == currencyId) {
        this.agent.BankId = bank.BankId;
        return ;
      }
    });
  }
  

}
