import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { LendingService } from '../../../dal/lending.service';
import { LoanApplicationQueryRequest } from '../../../models/lending';
import { AuthService } from '../../../services/auth.service';
import { DataGridComponent } from '../../../widgets/data-grid/data-grid.component';

@Component({
  selector: 'app-loan-application',
  templateUrl: './loan-application.component.html'
})
export class LoanApplicationComponent implements OnInit {

  @ViewChild('customerGrid') vc: DataGridComponent;
  busy: Subscription;

  showGrid: boolean = true;
  search: LoanApplicationQueryRequest = new LoanApplicationQueryRequest();

  dataGridConfig: any = {
    // headerTitle: "Customer List",
    gridId: "loan-application-grid",
    referenceName: "loanApplicationGrid",
    items: [],
    itemCount: 0,
    loadLater: false,
    // dataSearch: this.dataSearch,
    // customizeSearch: this.customizeSearch,
    searchModel: this.search,
    buttonName: "Details",
    buttonClick: (row) => this.detailClick(row),
    loadGrid: (searchModel: any, dataGrid: any) => {
      this.router.navigate(['/loan-application-list'], {
        queryParams: {
          page: searchModel.page,
          pageSize: searchModel.pageSize,
          field: searchModel.sort[0] ? searchModel.sort[0].field : null,
          dir: searchModel.sort[0] ? searchModel.sort[0].dir : null
        }
      });
      this.busy = this.lendingService.getLoanApplicationList(searchModel)
        .subscribe(
          data => {
            this.showGrid = true;
            dataGrid.items = data.Data;
            dataGrid.itemCount = data.Total;

            dataGrid.items.forEach((item: any) => {
              item.CustomerGuidHtml=`<a href="/customer-details/${item.CustomerGuid}">${item.CustomerGuid}</a>`;
              item.CustomerNameHtml=`<a href="/customer-details/${item.CustomerGuid}">${item.CustomerName}</a>`;
            });
          },
          error => {
            if (error.status === 401 || error.status === 403) this.showGrid = false;
            console.log(error);
          }
        );
    },
    columns: [
      { title: 'CustomerGuid', data: 'CustomerGuid', sortable: false, resizable: true, type:'html', htmlElement: 'CustomerGuidHtml' },
      { title: 'Name', data: 'CustomerName', sortable: false, resizable: true, type:'html', htmlElement: 'CustomerNameHtml' },
      { title: 'Loan Number', data: 'LoanNumber', sortable: false, resizable: true },
      { title: 'Currency', data: 'Currency', sortable: false, resizable: true },
      { title: 'Amount', data: 'LoanAmount', sortable: false, resizable: true },
      { title: 'Loan Appplication Date', data: 'ApplicationDate', type: 'date', sortable: false, resizable: true },
      { title: 'OTP Verification Date', data: 'OtpVerifiedDate', type: 'date', sortable: false, resizable: true }
    ],
    filters: [
    ],
    rowTooltip: this.rowTooltip,
    rowDoubleClick: (rowEvent) => {
      this.detailClick(rowEvent.row.item);
      //this.router.navigate(['/kyc-customer-detail/' + rowEvent.row.item.CustomerGuid]);
    }
  };
  constructor(public router: Router, public auth: AuthService, private activatedRoute: ActivatedRoute, public lendingService: LendingService) { }

  ngOnInit() {
    this.activatedRoute.queryParams.forEach((params: Params) => {

      if (!this.vc && Object.getOwnPropertyNames(params).length > 0) {
        var page = params['page'];
        var pageSize = params['pageSize'];
        var loanApplicationGuid = params['loanapplicationguid'];
        let field = params['field'];
        let dir = params['dir'];

        this.search.page = page ? page : 1;
        this.search.pageSize = pageSize ? pageSize : 10;

        if (field && dir) {
          this.search.sort = [];
          this.search.sort.push({
            'field': field,
            'dir': dir
          });

          this.dataGridConfig.sortBy = field;
          this.dataGridConfig.sortAsc = dir == 'asc' ? true : false;
        }

        this.dataGridConfig.limit = this.search.pageSize * 1;
        this.dataGridConfig.offset = (this.search.page - 1) * this.search.pageSize;
      }
      else if (this.vc && Object.getOwnPropertyNames(params).length < 1) {
        this.search.sort = [];
        this.search.page = 1;
        this.search.pageSize = 10;
        this.vc.resetGrid(this.vc, this.search);
      }
    });
  }

  detailClick(row) {
    this.activatedRoute.queryParams.forEach((params: Params) => {

      var page = params['page'];
      var pageSize = params['pageSize'];


      this.router.navigate(['/loan-application-detail'], {
        queryParams: {
          loanapplicationguid: row.LoanApplicationGuid,
          customerguid: row.CustomerGuid,
          pageNumber: page,
          pageSize: pageSize
        }
      });

    })
  };

  rowTooltip(item) { return item.Name; }

}
