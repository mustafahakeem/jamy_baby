import { Component, OnInit, ViewChild } from '@angular/core';
import { DepositSearch, DepositView, Wallet } from "../../../models/deposit";
import { DepositService } from "../../../dal/deposit.service";
import { AuthService } from "../../../services/auth.service";
import 'jquery';
import { Subscription } from 'rxjs';
import { DataGridComponent } from "../../../widgets/data-grid/data-grid.component";
import { NotificationService } from '../../../services/notification.service';
import { MoneyFormatterService } from '../../../services/moneyFormatter.service';

declare var $: any;

@Component({
  providers: [DepositService],
  selector: 'app-deposit-list',
  templateUrl: './deposit-list.component.html',
  styleUrls: ['./deposit-list.component.css']
})

export class DepositListComponent implements OnInit {
  @ViewChild('depositGrid') vc: DataGridComponent;
  managementWallets: Wallet[] = [];
  busy: Subscription;
  search: DepositSearch = new DepositSearch();
  items = [];
  itemCount = 0;
  limit = 10;
  offset = 0;
  sortBy: string;
  sortAsc: boolean;

  dataGridConfig: any = {
    items: [],
    itemCount: 0,
    loadLater: true,
    loadGrid: (searchModel: any, dataGrid: any) => {
      if (!searchModel.managementWalletGuid || !searchModel.fromDate || !searchModel.toDate) {
        var message = 'Please select ';
        if (!searchModel.managementWalletGuid) message += 'a management wallet.';
        else if (!searchModel.fromDate) message += 'From Date.';
        else if (!searchModel.toDate) message += 'To Date.';

        var headerMessage = !searchModel.managementWalletGuid ? 'Wallet ' : 'Date'
        this.notificationService.error(message, headerMessage + ' selection');
        return;
      }
      this.busy = this.depositService.searchDeposits(searchModel)
        .subscribe(
          data => {
            dataGrid.items = data.Data.map(item => {
              item.Amount = this.moneyFormatterService.format(item.Amount);
              return item;
            });
            dataGrid.itemCount = data.Total;
          },
          error => {
            console.log(error);
          }
        );
    },
    // dataSearch: this.dataSearch,
    searchModel: this.search,
    columns: [
      { title: 'Customer Name', data: 'CustomerName', sortable: true, resizable: true },
      { title: 'Amount', data: 'Amount', sortable: true, resizable: true },
      { title: 'Deposit Date', data: 'DepositDate', sortable: true, resizable: true, type: "date" },
      { title: 'Transaction Date', data: 'TransactionDate', sortable: true, resizable: true, type: "date" },
      { title: 'Customer Reference', data: 'CustomerReference', sortable: true, resizable: true },
      { title: 'Message', data: 'Message', sortable: true, resizable: true },
      { title: 'Depositor', data: 'Depositor', sortable: true, resizable: true },
      { title: 'Branch', data: 'Branch', sortable: true, resizable: true }
    ],
    filters: [
      {
        title: 'Management Wallet', name: 'managementWalletGuid', type: 'select', options: this.managementWallets,
        optionValue: 'ManagementWalletGuid', optionLabel: 'Name', isRequired: true, searchable: true
      },
      { title: 'From Date', name: 'fromDate', type: 'date', isRequired: true, searchable: true, value: this.search.fromDate },
      { title: 'To Date', name: 'toDate', type: 'date', isRequired: true, searchable: true },
      { title: 'CustomerReference', name: 'customerReference', type: 'text', searchable: false }],
    rowTooltip: this.rowTooltip,
    // indexColumn: false
  };

    constructor(private depositService: DepositService, public auth: AuthService, private moneyFormatterService: MoneyFormatterService, private notificationService: NotificationService) { }

  rowTooltip(item) { return item.CustomerName; }


  ngOnInit() {
    //'2019-02-12' iso date format to fill html date type input;
    var today = new Date();
    this.search.fromDate = new Date(today.setMonth(today.getMonth() - 1)).toISOString().slice(0, 10);
    this.search.toDate = new Date().toISOString().slice(0, 10);

    this.depositService.getBankTypeWallets().subscribe(
      data => {
        this.managementWallets = data;
        console.log(this.managementWallets);
        this.dataGridConfig.filters[0].options = this.managementWallets;//need to remove after sync this list filter
        if (this.managementWallets && this.managementWallets.length > 0) {
          this.dataGridConfig.searchModel.managementWalletGuid = this.managementWallets[0].ManagementWalletGuid
        }
      },
      error => {
        this.managementWallets = [];
        console.log(error);
      }
    );
  }

}