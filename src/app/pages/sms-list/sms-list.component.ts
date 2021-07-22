import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { DataGridComponent } from '../../widgets/data-grid/data-grid.component';
import { SmsQueryRequest } from '../../models/Customer';
import { Subscription } from 'rxjs';
import { CustomerService } from '../../dal/customer.service';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  providers: [DataGridComponent],
  selector: 'sms-list',
  templateUrl: './sms-list.component.html'
})
export class SmsListComponent {
  @Input() customerGuid: string;
  @ViewChild('smsGrid') vc: DataGridComponent;
  busyTransaction: Subscription;
  search: SmsQueryRequest = new SmsQueryRequest();
  constructor(public customerService: CustomerService, public router: Router, public auth: AuthService) { }
  showGrid: boolean = true;
  dataGridConfig: any = {
    gridId: "sms-grid",
    referenceName: "smsGrid",
    items: [],
    itemCount: 0,
    loadLater: false,
    // dataSearch: this.dataSearch,
    // customizeSearch: this.customizeSearch,
    searchModel: this.search,
    loadGrid: (searchModel: any, dataGrid: any) => {
      searchModel.customerGuid = searchModel.customerGuid ? searchModel.customerGuid : this.customerGuid;
      this.busyTransaction = this.customerService.getCustomerSms(searchModel)
        .subscribe(
          data => {
            dataGrid.items = data.Data;
            dataGrid.itemCount = data.Total;
            this.showGrid = true;

          },
          error => {
            if (error.status === 401 || error.status === 403) this.showGrid = false;
            console.log(error);
          }
        );
    },
    columns: [
      { title: 'Send Date', data: 'SendDate', type: "date", sortable: true, resizable: true },
      { title: 'Recipient', data: 'Recipient', sortable: true, resizable: true, nowrap: true },
      { title: 'Message', data: 'Message', sortable: false, resizable: true },
      { title: 'Delivery Status', data: 'DeliveryStatus', sortable: true, resizable: true, nowrap: true },
      { title: 'Delivery Report Date', data: 'DeliveryReportDate', type: "date", sortable: false, resizable: true, nowrap: true },
      { title: 'Information', data: 'Information', sortable: false, resizable: true },
    ],
    filters: [],
    rowTooltip: this.rowTooltip,
  };

  rowTooltip(item) { return null; }

  // clickfn(row){
  //   console.log(row);
  //   this.router.navigate(['/customer-details/' + row.OtherPartyCustomerGuid]);
  // }

  gridSearch() {
    this.search.page = 1;
    this.search.pageSize = 10;
    this.search.CustomerGuid = this.customerGuid;
    this.vc.savedPageInfo.pageSize = 0;
    this.vc.savedPageInfo.offset = 0;
    this.vc.reloadItems(this.search);
  }
}
