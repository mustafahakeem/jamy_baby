import { Component, OnInit, ViewChild } from '@angular/core';
import { LogViewerService } from "../../dal/log-viewer.service";
import { AuthService } from "../../services/auth.service";
import { Router, ActivatedRoute, Params } from "@angular/router";
import { environment } from "../../../environments/environment";
import { Server, LoggerView, LogViewerQueryRequest } from "../../models/LoggerView";
import { Subscription } from "rxjs";
import { DataGridComponent } from "../../widgets/data-grid/data-grid.component";

@Component({
  providers: [LogViewerService, DataGridComponent],
  selector: 'app-log-viewer',
  templateUrl: './log-viewer.component.html',
  styleUrls: ['./log-viewer.component.css']
})
export class LogViewerComponent implements OnInit {
  busy: Subscription;
  busyDetail: Subscription;
  audience: number = 1;
  keywords: string;
  loggerView: LoggerView = new LoggerView();
  serverList: Server[] = [
    { id: 1, name: 'SpennApi' },
    { id: 3, name: 'JamesApi' },
    { id: 25, name: 'AgentApi' },
    { id: 16, name: 'SpennBusinessApi' },
    { id: 8, name: 'Query Server' },
    { id: 2, name: 'Identity Server' },
    { id: 4, name: 'Access Server' },
    { id: 5, name: 'Spenn Scheduler App' },
    { id: 6, name: 'Transaction Event Handler' },
    { id: 7, name: 'Transaction Queue' },
    { id: 9, name: 'Logged In Event Handler App' },
    { id: 10, name: 'Push Notification App' },
    { id: 11, name: 'Transaction Report App' },
    { id: 12, name: 'Sms App' },
    { id: 13, name: 'Reward Hanlder App' },
    { id: 14, name: 'Payment Hanlder App' },
    { id: 15, name: 'BusinessEvent Hanlder App' },
    { id: 17, name: 'ServiceBus Events' },
    { id: 18, name: 'Balance Processor App' },
    { id: 19, name: 'Kyc Cognitive Service App' },
    { id: 20, name: 'Airtime Recharge Service App' },
    { id: 21, name: 'Lending Service App' },
    { id: 22, name: 'Spenn Business Request Processor App' },
    { id: 23, name: 'Transaction report reconciliation App' },
    { id: 24, name: 'Rescale Image App' }
  ];
  search: LogViewerQueryRequest = new LogViewerQueryRequest();

  dataGridConfig: any = {
    gridId: "logger-grid",
    referenceName: "loggerGrid",
    items: [],
    itemCount: 0,
    loadLater: false,
    searchModel: this.search,
    buttonName: "Details",
    buttonClick: (row) => this.detailClick(row),
    loadGrid: (searchModel: any, dataGrid: any) => {
      this.router.navigate(['/log-viewer'], {
        queryParams: {
          audience: searchModel.audience,
          page: searchModel.page,
          pageSize: searchModel.pageSize,
          fromDate: searchModel.fromDate,
          toDate: searchModel.toDate,
          field: searchModel.sort[0] ? searchModel.sort[0].column : '',
          dir: searchModel.sort[0] ? searchModel.sort[0].dir : '',
          keywords: searchModel.keywords
        }
      });

      this.busy = this.logViewerService.searchLogs(searchModel)
        .subscribe(
          data => {
            dataGrid.items = data.Data;
            dataGrid.itemCount = data.Total;
          },
          error => {
            dataGrid.items = [];
            dataGrid.itemCount = 0;
            console.log(error);
          }
        );

      this.loggerView = new LoggerView();
    },
    columns: [
      { title: 'Id', name: 'Id', data: 'Id', sortable: true, resizable: true },
      { title: 'Date', name: 'Date', data: 'Date', sortable: true, resizable: true, type: "date" },
      { title: 'Exception', name: 'Exception', data: 'Exception', sortable: true, resizable: true, nowrap: true },
      { title: 'Message', name: 'Message', data: 'Message', sortable: false, resizable: true, nowrap: true },
      { title: 'Logger', name: 'Logger', data: 'Logger', sortable: false, resizable: true, nowrap: true },
      { title: 'StackTrace', name: 'StackTrace', data: 'StackTrace', sortable: false, resizable: true, nowrap: true },
      { title: 'UserName', name: 'UserName', data: 'UserName', sortable: true, resizable: true, nowrap: true }
    ],
    filters: [
      { title: 'From Date', name: 'fromDate', type: 'date', searchable: true },
      { title: 'To Date', name: 'toDate', type: 'date', searchable: true },
      { title: 'Server', name: 'audience', type: 'select', value: this.audience, options: this.serverList, optionValue: 'id', optionLabel: 'name', searchable: true },
      { title: 'Search by any word', name: 'keywords', type: 'text', searchable: true, isNewRow: true },
    ],
    rowTooltip: this.rowTooltip,
  };

  constructor(public logViewerService: LogViewerService, public auth: AuthService, public router: Router, private activatedRoute: ActivatedRoute) { }

  detailClick(row) {
    console.log(row);
    this.getLogById(row.Id, this.search.audience);
  }

  rowTooltip(item) { return item.Message; }

  ngOnInit() {
    this.activatedRoute.queryParams.forEach((params: Params) => {
      var page = params['page'];
      var pageSize = params['pageSize'];
      var audience = params['audience'];
      var fromDate = params['fromDate'];
      var toDate = params['toDate'];
      let field = params['field'];
      let dir = params['dir'];
      var keywords = params['keywords'];

      this.search.page = page ? page : 1;
      this.search.pageSize = pageSize ? pageSize : 10;
      this.search.audience = audience ? audience : 1;
      this.search.fromDate = fromDate;
      this.search.toDate = toDate;
      this.search.keywords = keywords;

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
    });
  }

  getLogById(logId, audience) {
    if (!audience) audience = 1;
    this.busyDetail = this.logViewerService.getLogById(logId, audience).subscribe(
      data => {
        console.log(data);
        this.loggerView = data;
        this.loggerView.Message = this.formatException(this.loggerView.Message);
        setTimeout(() => this.jumpToId('details'));
      },
      error => {
        console.log(error);
        this.loggerView = new LoggerView();
      }
    );
  };

  formatException(exceptionMessage) {
    var result = exceptionMessage || '';

    var searchReplaces = [
      {
        find: /   at/g,
        repl: '\r\n   at'
      },
      {
        find: / ---> /g,
        repl: '\r\n ---> '
      },
      {
        find: /\) at /g,
        repl: '\r\n at '
      },
      {
        find: /--- End of stack trace from previous location where exception was thrown ---/g,
        repl: ''
      }
    ]

    searchReplaces.forEach(function (item) {
      result = result.replace(item.find, item.repl);
    });

    return result;
  };

  jumpToId(fragment) {
    window.location.hash = fragment;

    if (fragment) {
      const element = document.querySelector('#' + fragment);
      if (element) element.scrollIntoView();
    }
  }

}
