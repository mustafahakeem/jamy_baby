import { Component, OnInit, OnDestroy, ViewChild } from "@angular/core";
import { DepositService } from "../../dal/deposit.service";
import { LookupService } from "../../dal/lookup.service";

import {
  DepositSearch,
  Deposit,
  Currency,
  Wallet,
  FinanceRelocation,
  TransactionType,
  FinanceRelocationLookupResult,
  FinanceRelocationConfirmationData
} from "../../models/deposit";
import { AuthService } from "../../services/auth.service";
import { Subscription } from "rxjs";
import { Router, ActivatedRoute, Params } from "@angular/router";
import { CustomerService } from "../../dal/customer.service";
import { Observable } from "@reactivex/rxjs";
import { Response } from "@angular/http";
import { FinanceRelocationService } from "../../dal/financeRelocation.service";
import { CustomerSearchView } from "../../models/Customer";
import { NgForm } from "@angular/forms";
import { AgentSearchView } from "app/models/agent";
import { AgentService } from "app/dal/agent.service";

@Component({
  providers: [
    DepositService,
    CustomerService,
    LookupService,
    FinanceRelocationService
  ],
  selector: "app-transaction",
  templateUrl: "./transaction.component.html",
  styleUrls: ["./transaction.component.css"]
})
export class TransactionComponent implements OnInit {
  private busy: Subscription;
  public command: FinanceRelocation = new FinanceRelocation();
  private hasValidLookupResult = false;
  private inChecking = false;
  private rewardCodeOrPhoneNumber: string;
  private isRewardCodeOrPhoneNumberValid = true;
  private agentNumber = 0;
  private isAgentNumberValid: boolean = true;
  private receiverType = "MW"; // MW, Customer, Agent
  private minDate: Date;
  private maxDate: Date;
  private isSameManagementWallet = false;
  private currencies: Currency[] = [];
  private financeLookupResult: FinanceRelocationLookupResult = new FinanceRelocationLookupResult();
  private customerSearchView: CustomerSearchView = new CustomerSearchView();
  private agentSearchView: AgentSearchView = new AgentSearchView();
  private modalId = "23fdsfsfsf4eerff-ddd-bb";
  private confirmationData: FinanceRelocationConfirmationData = new FinanceRelocationConfirmationData();
  private inFetching = false;
  private isSubmitting = false;
  private isAmountPositive=true;
  @ViewChild("myForm") myForm: NgForm;

  private transactionTypes: TransactionType[] = [
    {
      name: "Transfer",
      transactionTypeId: 1
    },
    {
      name: "Reward",
      transactionTypeId: 5
    },
    {
      name: "Deposit",
      transactionTypeId: 6
    },
    {
      name: "Withdraw",
      transactionTypeId: 7
    }
  ];
  managementWallets: Wallet[] = [];
  bankWallets: Wallet[] = [];
  submitted = false;
  isSuccessfull = true;
  constructor(
    public depositService: DepositService,
    public auth: AuthService,
    public router: Router,
    private activatedRoute: ActivatedRoute,
    public customerService: CustomerService,
    public lookupService: LookupService,
    private financeRelocationService: FinanceRelocationService,
    private agentService: AgentService
  ) {}

  ngOnInit() {
    this.activatedRoute.queryParams.forEach((params: Params) => {
      var submit = params["submit"];
      if (!submit) {
        this.submitted = false;
        this.isSuccessfull = true;
      }
    });
    this.setDepositDate();
    this.busy = this.lookupService.getCurrencies().subscribe(
      data => {
        this.currencies = data;
      },
      error => {
        this.currencies = [];
        console.log(error);
      }
    );
  }

  private submitNavigation(submit: string) {
    this.router.navigate([], {
      queryParams: {
        submit: submit
      }
    });
  }

  private onManagementWalletChange() {
    if (
      this.command.receiverManagementWalletGuid !== undefined &&
      this.command.receiverManagementWalletGuid != null &&
      this.command.receiverManagementWalletGuid.length > 0 &&
      this.command.receiverManagementWalletGuid ===
        this.command.senderManagementWalletGuid
    ) {
      this.isSameManagementWallet = true;
    } else {
      this.isSameManagementWallet = false;
    }
  }
  private onSubmit() {
    console.clear();
    console.log(this.command);
    this.relocationCommandCleanup();
    this.isSubmitting = true;
    this.submitted = true;
    let commandCoppy = Object.assign({}, this.command);
    if (this.command.transactionTypeId == 6) {
      commandCoppy.depositDate = this.addTimeWithDate(commandCoppy.depositDate);
    } else {
      commandCoppy.depositDate = null;
    }
    this.financeRelocationService.financeFundRelocation(commandCoppy).subscribe(
      data => {
        this.isSubmitting = false;
        this.isSuccessfull = true;
        this.submitNavigation("success");
        console.log(data);
      },
      error => {
        this.isSubmitting = false;
        this.isSuccessfull = false;
        console.log(error);
        this.submitNavigation("error");
      }
    );
  }

  private addTimeWithDate(date: any) {
    var today = new Date();
    date = new Date(date);
    date.setHours(today.getHours());
    date.setMinutes(today.getMinutes());
    date.setSeconds(today.getSeconds() - 10);
    return date;
  }

  private relocationCommandCleanup() {
    if (this.receiverType=='MW') {
      this.command.receiverCustomerGuid = null;
    } else if(this.receiverType=='Customer'){
      this.command.receiverManagementWalletGuid = null;
      this.command.receiverCustomerGuid = this.customerSearchView.CustomerGuid;
    } else {
      this.command.receiverManagementWalletGuid = null;
      this.command.receiverCustomerGuid = this.agentSearchView.CustomerGuid;
    }
  }

  onConfirmRelocation(command: FinanceRelocation): void {
    this.onSubmit();
  }

  private onProceed(): void {
    console.clear();
    console.log(this.command);
    this.relocationCommandCleanup();
    console.log(this.command);
    this.getConfirmationData();
    let myDialog = <any>document.getElementById(this.modalId);
    myDialog.showModal();
    return;
  }

  private getConfirmationData(): void {
    let data = new FinanceRelocationConfirmationData();
    let commandData = this.command;
    data.senderWallet = this.financeLookupResult.SenderWallets.filter(function(
      item
    ) {
      return (
        item.ManagementWalletGuid === commandData.senderManagementWalletGuid
      );
    })[0];
    if (this.command.receiverCustomerGuid !== null && this.receiverType=='Customer') {
      data.receiverCustomer = this.customerSearchView;
      data.receiverName = this.customerSearchView.Name;
    } else if (this.command.receiverCustomerGuid !== null && this.receiverType=='Agent') {
      data.receiverName = this.agentSearchView.AgentName;
    } else {
      data.receiverWallet = this.financeLookupResult.Receiver.ReceiverManagementWallets.filter(
        function(item) {
          return (
            item.ManagementWalletGuid ===
            commandData.receiverManagementWalletGuid
          );
        }
      )[0];
      data.receiverName = data.receiverWallet.Name;
    }
    data.transactionType = this.transactionTypes.filter(function(item) {
      return item.transactionTypeId == commandData.transactionTypeId;
    })[0];
    data.currency = this.currencies.filter(function(item) {
      return item.CurrencyId == commandData.currencyId;
    })[0];
    this.confirmationData = data;
  }
  private getCustomerByTransactionOrPhoneNumber(event) {
    let rewardCodeOrPhoneNumber = event.target.value;
    this.inChecking = true;
    this.customerService
      .getCustomerByRewardCodeOrPhoneNumber(rewardCodeOrPhoneNumber)
      .subscribe(
        data => {
          this.inChecking = false;
          this.isRewardCodeOrPhoneNumberValid = true;
          this.customerSearchView = data;
        },
        error => {
          this.inChecking = false;
          this.isRewardCodeOrPhoneNumberValid = false;
          this.customerSearchView = new CustomerSearchView();
          console.log(error);
        }
      );
  }

  private getAgentByAgentNumber(event) {
    let agentNumber = event.target.value;
    this.inChecking = true;
    this.agentService
      .getAgentShortDetail(agentNumber)
      .subscribe(
        data => {
          this.inChecking = false;
          this.isAgentNumberValid = true;
          this.agentSearchView = data;
          this.agentNumber = this.agentSearchView.AgentNumber;
        },
        error => {
          this.inChecking = false;
          this.isAgentNumberValid = false;
          this.agentSearchView = new AgentSearchView();
          console.log(error);
        }
      );
  }

  onTransactionTypeOrCurrencyChange() {
    if (
      this.command.currencyId == null ||
      this.command.currencyId.toString().length < 1 ||
      this.command.transactionTypeId == null ||
      this.command.transactionTypeId.toString().length < 1
    ) {
      this.hasValidLookupResult = false;
      this.financeLookupResult = new FinanceRelocationLookupResult();
      return;
    }
    this.inFetching = true;
    this.financeRelocationService
      .financeRelocationLookup(this.command)
      .subscribe(
        data => {
          this.hasValidLookupResult = true;
          this.inFetching = false;
          this.command.receiverCustomerGuid = '';
          this.command.senderManagementWalletGuid = '';
          this.rewardCodeOrPhoneNumber = '';
          this.isRewardCodeOrPhoneNumberValid = true;
          this.isAgentNumberValid = true;
          this.customerSearchView = new CustomerSearchView();
          this.agentSearchView = new AgentSearchView();
          this.myForm.form.controls['rewardCode'].markAsPristine();

          if (!data.Receiver.IsWalletAllowed) {
            this.receiverType = "Customer";
          } else {
            this.receiverType = "MW";
          }
          this.financeLookupResult = data;
        },
        error => {
          this.inFetching = false;
          console.log(error);
          this.hasValidLookupResult = false;
        }
      );
  }

  private CheckIfAmountIsPositive(){
    if(this.command.amount<=0){
      this.isAmountPositive=false;
    } else {
      this.isAmountPositive=true;
    }
  }

  private setDepositDate() {
    var today = new Date();
    today.setDate(today.getDate() - 6);
    this.minDate = today;
    this.maxDate = new Date();
    var todayString = this.getStringDate(new Date());
    this.command.depositDate = todayString;
  }

  private getStringDate(date: Date) {
    var day = date.getDate();
    var month = date.getMonth() + 1;
    var year = date.getFullYear();
    var dateString = year + "-";
    if (month < 10) dateString += "0";
    dateString += month + "-";
    if (day < 10) dateString += "0";
    dateString += day;
    return dateString;
  }
}
