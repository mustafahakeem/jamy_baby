import { Component, Input, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { CustomerService } from '../../dal/customer.service';
import { CustomerLoanQueryRequest } from '../../models/lending';
import 'jquery';
import { LendingService } from '../../dal/lending.service';
declare var $: any;
@Component({
  selector: 'app-customer-loan-list',
  templateUrl: './customer-loan-list.component.html'
})
export class CustomerLoanListComponent implements OnInit {

  @Input() customerGuid: string;
  busy: Subscription;
  search: CustomerLoanQueryRequest = new CustomerLoanQueryRequest();
  private modalId = "23fdsfsfsf4eerff-ccc-tt";
  command: any;
  constructor(private lendingService: LendingService) { }

  ngOnInit() {
    this.search.customerGuid = this.customerGuid;
    this.search.page = 1;
    this.search.pageSize = 10;
  }

  dataGridConfig: any = {
    gridId: "customer-loan-grid",
    referenceName: "customerLoanGrid",
    items: [],
    itemCount: 0,
    loadLater: false,
    searchModel: this.search,
    rowTooltip: this.rowTooltip,
    buttonName: "Details",
    buttonClick: (row) => this.detailClick(row),
    loadGrid: (searchModel: any, dataGrid: any) => {
      searchModel.customerGrid = this.customerGuid;
      this.busy = this.lendingService.customerLoanDetails(searchModel)
        .subscribe(
          data => {
            dataGrid.items = data.Data;
            dataGrid.itemCount = data.Total;

            dataGrid.items.forEach((item: any) => {
              item.LoanStatusHtml = `<span>${item.LoanStatus.Name}</span>`;
            });
          },
          error => {
            dataGrid.items = [];
            dataGrid.itemCount = 0;
            console.log(error);
          }
        );
    },
    columns: [
      { title: 'Loan Number', data: 'LoanNumber', sortable: false, resizable: true},
      { title: 'Loan Model', data: 'LoanModel', sortable: false, resizable: true},
      { title: 'Currency', data: 'Currency', sortable: false, resizable: true},
      { title: 'Amount', data: 'LoanPaidOut', sortable: false, resizable: true},
      { title: 'Status', data: 'LoanStatus', sortable: false, resizable: true, type: "html", htmlElement: 'LoanStatusHtml'}
    ]
  };
  detailClick(row) {
    this.command = row;
    let myDialog = <any>document.getElementById(this.modalId);
    myDialog.showModal();
  }


  rowTooltip(item) { return item.LoanNumber; }
}
