/**
 * Created by Anupam on 12/27/2016.
 */

import { Component, OnInit, ViewChild } from '@angular/core';
import { CustomerService } from "../../dal/customer.service";
import { AuthService } from "../../services/auth.service";
import { Params, Router, ActivatedRoute } from "@angular/router";
import 'jquery';
import { CustomerSearchKyc } from "../../models/Customer";
import { Subscription } from 'rxjs';
import { DataGridComponent } from "../../widgets/data-grid/data-grid.component";
import { Country } from '../../models/deposit';
import { LookupService } from '../../dal/lookup.service';


@Component({
  providers: [CustomerService, DataGridComponent, LookupService],
  selector: 'app-kyc-customer',
  styleUrls: ['./kyc-verification.component.css'],
  templateUrl: './kyc-verification.component.html'
})
export class KycVerificationComponent implements OnInit {
  @ViewChild('customerGrid') vc: DataGridComponent;
  busy: Subscription;
  countryId: number;
  isEscalated: boolean = false;
  showGrid: boolean = true;

  countries: Country[] = [];

  search: CustomerSearchKyc = new CustomerSearchKyc();

  dataGridConfig: any = {
    gridId: "customer-kyc-grid",
    referenceName: "customerGrid",
    items: [],
    itemCount: 0,
    loadLater: false,
    searchModel: this.search,
    buttonName: "Details",
    buttonClick: (row) => this.detailClick(row),
    loadGrid: (searchModel: any, dataGrid: any) => {
      this.router.navigate(['/customer-verification-list'], {
        queryParams: {
          page: searchModel.page,
          pageSize: searchModel.pageSize,
          countryId: searchModel.countryId,
          isEscalated: searchModel.isEscalated,
          field: searchModel.sort[0] ? searchModel.sort[0].field : null,
          dir: searchModel.sort[0] ? searchModel.sort[0].dir : null
        }
      });
      this.busy = this.customerService.searchCustomersKyc(searchModel)
        .subscribe(
          data => {
            this.showGrid = true;
            dataGrid.items = data.Data;
            dataGrid.itemCount = data.Total;
          },
          error => {
            if (error.status === 401 || error.status === 403) this.showGrid = false;
            console.log(error);
          }
        );
    },
    columns: [
      { title: 'CustomerGuid', data: 'CustomerGuid', sortable: false, resizable: true },
      { title: 'Country Name', data: 'CountryName', sortable: false, resizable: true },
      { title: 'Email', data: 'Email', sortable: false, resizable: true },
      { title: 'Phone', data: 'Phone', sortable: false, resizable: true },
      { title: 'Reward Code', data: 'RewardCode', sortable: false , resizable: true },
      { title: 'Status', data: 'Status', sortable: false, resizable: true, type: 'conditional', condition: { positive: false } }
    ],
    filters: [
      {
        title: 'Customer Country', name: 'countryId', type: 'select', options: this.countries,
        optionValue: 'CountryId', optionLabel: 'Name', isRequired: true, searchable: true
      },
      { title: 'Escalated', name: 'isEscalated', type: 'checkbox', searchable: true}],
    rowTooltip: this.rowTooltip,
    rowClick: (rowEvent) => {
      this.detailClick(rowEvent.row.item);
      //this.router.navigate(['/kyc-customer-detail/' + rowEvent.row.item.CustomerGuid]);
    }
  };

  constructor(public customerService: CustomerService, public auth: AuthService, public router: Router, private activatedRoute: ActivatedRoute, private lookupService: LookupService) {
  }

  detailClick(row) {
    this.activatedRoute.queryParams.forEach((params: Params) => {

      var countryId = params['countryId'];
      var page = params['page'];
      var pageSize = params['pageSize'];
      var isEscalated = params['isEscalated'];


      this.router.navigate(['/kyc-customer-detail'], {
        queryParams: {
          customerguid: row.CustomerGuid,
          pageNumber: page,
          countryId: countryId,
          pageSize: pageSize,
          isEscalated: isEscalated
        }
      });

    })
  };

  rowTooltip(item) { return item.Name; }

  ngOnInit() {
    this.activatedRoute.queryParams.forEach((params: Params) => {

      if (!this.vc && Object.getOwnPropertyNames(params).length > 0) {
        var page = params['page'];
        var pageSize = params['pageSize'];
        this.countryId = params['countryId'];
        this.isEscalated = params['isEscalated'];
        var customerGuid = params['customerguid'];
        var rewardCode = params['rewardCode'];
        let field = params['field'];
        let dir = params['dir'];

        this.search.page = page ? page : 1;
        this.search.pageSize = pageSize ? pageSize : 10;
        this.search.countryId = this.countryId;
        this.search.isEscalated = this.isEscalated;
        this.search.customerGuid = customerGuid;
        this.search.rewardCode = rewardCode;

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
        this.search.countryId = null;
        this.search.isEscalated = false;
        this.search.sort = [];
        this.search.page = 1;
        this.search.pageSize = 10;
        this.vc.resetGrid(this.vc, this.search);
      }
    });

    this.lookupService.getCountries().subscribe(data => {
      console.table(data)
      this.countries = data;
      console.table(this.countries);
      this.dataGridConfig.filters[0].options = this.countries;//need to remove after sync this list filter
      if (this.countries && this.countries.length > 0) {
        this.dataGridConfig.searchModel.countryId = '';
      }
    })
  }

}