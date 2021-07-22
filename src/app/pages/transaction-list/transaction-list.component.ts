import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { CustomerAccount, AccountHistoryQueryRequest } from "../../models/Customer";
import { environment } from "../../../environments/environment";
import { GenericGridComponent } from "../../widgets/generic-grid/generic-grid.component";
import 'jquery';
import { Subscription } from "rxjs";
import { CustomerService } from "../../dal/customer.service";
import { DataGridComponent } from "../../widgets/data-grid/data-grid.component";
import { Router } from "@angular/router";
import { MoneyFormatterService } from '../../services/moneyFormatter.service';
var $: any;

@Component({
    providers: [DataGridComponent],
    selector: 'transaction-list',
    templateUrl: './transaction-list.component.html',
    styleUrls: ['./transaction-list.component.css']
})
export class TransactionListComponent implements OnInit {
    @Input() customerAccount: CustomerAccount;
    @ViewChild('transactionGrid') vc: DataGridComponent;
    busyTransaction: Subscription;
    search: AccountHistoryQueryRequest = new AccountHistoryQueryRequest();
    constructor(public customerService: CustomerService, public router: Router, private moneyFormatterService: MoneyFormatterService) { }
    private modalId = "23fdsfsfsf4eerdd-ppp-rr";
    transactionInfo : any;
    details=[];
    transactionTypesList:any=[];
    dataGridConfig: any = {
        gridId: "transaction-grid",
        referenceName: "transactionGrid",
        items: [],
        itemCount: 0,
        loadLater: false,
        // dataSearch: this.dataSearch,
        // customizeSearch: this.customizeSearch,
        searchModel: this.search,
        buttonName: "Show Details",
        buttonClick: (row) => this.detailClick(row),
        loadGrid: (searchModel: any, dataGrid: any) => {
            searchModel.accountGuid = searchModel.accountGuid ? searchModel.accountGuid : this.customerAccount.AccountId;
            this.busyTransaction = this.customerService.accountHistory(searchModel)
                .subscribe(
                    data => {
                        dataGrid.items = data.Data.map(item => {
                            item.Amount = this.moneyFormatterService.format(item.Amount);
                            item.BalanceAfter = this.moneyFormatterService.format(item.BalanceAfter);
                            return item;
                        });
                        dataGrid.itemCount = data.Total;

                        dataGrid.items.forEach((item: any) => {
                            if (item.Direction == "Out") {
                                item.Amount = '-' + item.Amount;
                            }
                            item.OtherPartyName = `<a href="/customer-details/${item.OtherPartyCustomerGuid}">${item.OtherPartyName}</a>`;

                            if (item.Direction == "In") {
                                item.AmountHtml = `<div class="text-green">${item.Amount}</div>`;
                            }
                            else if (item.Direction == "Out") {
                                item.AmountHtml = `<div class="text-red">${item.Amount}</div>`;
                            }   

                            if(item.Status == "TransactionFailed") {
                                item.BalanceAfter = "";
                            }
                            else if(item.Status != "TransactionVerified"){
                                item.BalanceAfter = 'Pending';
                            }
                            if( this.transactionTypesList.indexOf(item.TransactionType)>-1)
                            {
                                item.HideButton=false;
                            }
                            else{
                                item.HideButton=true;
                            }
                        });
                    },
                    error => {
                        console.log(error);
                    }
                );
        },
        columns: [
            { title: 'Created', data: 'TimestampCreated', type: "date", sortable: true, resizable: true },
            { title: 'Type', data: 'TransactionType', sortable: true, resizable: true, nowrap: true },
            { title: 'Amount', data: 'Amount', sortable: true, resizable: true, type: "html", htmlElement: 'AmountHtml' },
            { title: 'Balance After', data: 'BalanceAfter', sortable: false, resizable: true },
            { title: 'Status', data: 'Status', sortable: true, resizable: true, nowrap: true },
            // {title: 'Other Party Name ', data:'OtherPartyName', sortable: false, resizable: true, type: "click", clickfn: (row) => this.clickfn(row)},
            { title: 'Metadata', data: 'Metadata', sortable: false, resizable: true, type: "html", htmlElement: 'Metadata', hide: true },
            { title: 'Other Party Name ', data: 'OtherPartyName', sortable: false, resizable: true, type: "html", htmlElement: 'OtherPartyName' },
            { title: 'Other Party Id ', data: 'OtherPartyCustomerGuid', sortable: false, resizable: true , hide: true},
            {title: 'Comments', data: 'Comments', sortable: true, resizable: true},
            { title: 'ANX Coin Tx Id', data: 'CoinTransactionId', sortable: true, resizable: true, nowrap: true, hide: true },
            { title: 'SPENN TransactionID', data: 'TransactionId', sortable: true, resizable: true, hide: true },
            { title: 'Message', data: 'Message', sortable: false, resizable: true},
            { title: 'ANX ID', data: 'ExternalTransactionGuid', sortable: true, resizable: true, hide: true },
            { title: 'Hide Button', data: 'HideButton', sortable: false, resizable: false, hide: true },
        ],
        filters: [],
        rowTooltip: this.rowTooltip,
    };

    rowTooltip(item) { return item.TransactionType + ": " + item.Amount; }

    // clickfn(row){
    //   console.log(row);
    //   this.router.navigate(['/customer-details/' + row.OtherPartyCustomerGuid]);
    // }

    gridSearch(accountGuid, pageSize = null, resetOffsetFlag = false) {
        this.search.accountGuid = accountGuid;
        this.search.page = 1;
        this.search.pageSize = pageSize ? pageSize : 10;
        this.search.sort = [];
        if(resetOffsetFlag) this.vc.resetOffset();
        this.vc.savedPageInfo.pageSize = 0;
        this.vc.savedPageInfo.offset = 0;
        this.vc.reloadItems(this.search);
    }

    detailClick(row) {
        this.transactionInfo=null;
        this.bindTransactionDetails(row.TransactionId);
    }    

    bindTransactionDetails(transactionId){
        this.details=[];
        this.busyTransaction = this.customerService.accountHistoryTransactionDetails(transactionId).subscribe( 
        response => {
            this.transactionInfo=response;
            let myDialog = <any>document.getElementById(this.modalId);
            myDialog.showModal();
        },
        error => {
            console.log(error);
        });
    }

    ngOnInit(){
        this.transactionTypesList=["BillPayment",
                                    "RefundBillPayment",
                                    "AirTime",
                                    "RefundAirTime",
                                    "Reward",
                                    "Deposit",
                                    "Withdraw",
                                    "WithdrawalRefund",
                                    "PartnerWithdrawal"];
    }
}
