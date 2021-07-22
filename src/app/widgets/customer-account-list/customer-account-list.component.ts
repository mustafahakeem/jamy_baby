import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { CustomerService } from '../../dal/customer.service';
import { CustomerAccount } from '../../models/Customer';
import { TransactionListComponent } from '../../pages/transaction-list/transaction-list.component';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-customer-account-list',
  templateUrl: './customer-account-list.component.html',
  styleUrls: ['./customer-account-list.component.css']
})
export class CustomerAccountListComponent implements OnInit {
  @ViewChild('transactionListComponenet') vc: TransactionListComponent;
  @Input() customerGuid: string;
  @Input() showTransactionList: boolean;
  busy: Subscription;
  customerAccount: CustomerAccount = new CustomerAccount();
  customerAccounts: CustomerAccount[];
  columns: any[] = [
    { label: 'AccountId', name: 'AccountId' },
    { label: 'AccountType', name: 'AccountType' },
    { label: 'Currnecy', name: 'Currnecy' },
    { label: 'Subaccount address', name: 'SubAccountAddress' },
    { label: 'Local balance', name: 'LocalBalance' },
    { label: 'AnX balance', name: 'AnXbalance' }
  ];

  constructor(private customerService: CustomerService) { }

  ngOnInit() {
    this.busy = this.customerService.getCustomerAccounts(this.customerGuid).subscribe(
      data => {
        console.log(data);
        this.customerAccounts = data;
      },
      error => {
        console.log(error);
      }
    );
  }
  getAnxBalance() {
    this.busy = this.customerService.getCustomerBalanceByCustomerId(this.customerGuid).subscribe(
        data => {
            console.log(data);

            for (let i = 0; i < this.customerAccounts.length; i++) {
                for (let j = 0; j < data.length; j++) {
                    if (data[j].AccountId == this.customerAccounts[i].AccountId) this.customerAccounts[i].AnxBalance = data[j].Balance;
                }
            }
        },
        error => {
            console.log(error);
        }
    );
  };

  showTransaction(account) {
      this.customerAccount = account;
      //console.log(account);
      if (this.vc) this.vc.gridSearch(this.customerAccount.AccountId, this.vc.dataGridConfig.searchModel.pageSize, true);
  };
}
