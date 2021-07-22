/**
 * Created by Anupam on 12/27/2016.
 */

import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { CustomerService } from "../../dal/customer.service";
import { environment } from "../../../environments/environment";
import { AuthService } from "../../services/auth.service";
import { Params, Router, Routes, ActivatedRoute } from "@angular/router";
import { GenericGridComponent } from "../../widgets/generic-grid/generic-grid.component";
import 'jquery';
import {CustomerSearch} from "../../models/Customer";
import { Subscription } from 'rxjs';
import {DataGridComponent} from "../../widgets/data-grid/data-grid.component";

declare var $: any;

@Component({
    providers: [CustomerService, DataGridComponent],
    selector: 'app-customer',
    styleUrls: ['./customer.component.css'],
    templateUrl: './customer.component.html'
})
export class CustomerComponent implements OnInit{
    @ViewChild('customerGrid') vc:DataGridComponent;
    busy: Subscription;
    name: string;
    email: string;
    phone: string;
    showGrid: boolean = true;

    search: CustomerSearch = new CustomerSearch();

    dataGridConfig:any={
        // headerTitle: "Customer List",
        gridId: "customer-grid",
        referenceName: "customerGrid",
        items: [],
        itemCount: 0,
        loadLater: true,
        // dataSearch: this.dataSearch,
        customizeSearch: this.customizeSearch,
        searchModel: this.search,
        buttonName: "Details",
        buttonClick: (row) => this.detailClick(row),
        loadGrid: (searchModel: any, dataGrid: any) => {
            this.router.navigate(['/customer'],{ queryParams: {
                page: searchModel.page,
                pageSize: searchModel.pageSize,
                name: searchModel.name,
                email: searchModel.email,
                phone: searchModel.phone,
                customerguid: searchModel.customerGuid,
                rewardCode: searchModel.rewardCode,
                businessName: searchModel.businessName,
                field: searchModel.sort[0] ? searchModel.sort[0].field : null,
                dir: searchModel.sort[0] ? searchModel.sort[0].dir : null
            }});
            this.busy = this.customerService.searchCustomers(searchModel)
                .subscribe(
                    data => {
                        this.showGrid = true;
                        dataGrid.items = data.Data;
                        dataGrid.itemCount = data.Total;

                        dataGrid.items.forEach((item: any) => {
                            item.CustomerGuidHtml = `<a href="/customer-details/${item.CustomerGuid}">${item.CustomerGuid}</a>`;
                            item.NameHtml = `<a href="/customer-details/${item.CustomerGuid}">${item.Name}</a>`;
                            item.PhoneHtml = `<a href="/customer-details/${item.CustomerGuid}">${item.Phone}</a>`;

                            if(item.RewardCode) {
                                item.RewardCodeHtml = `<a href="/customer-details/${item.CustomerGuid}">${item.RewardCode}</a>`;
                            }
                        });
                    },
                    error => {
                        if(error.status === 401 || error.status === 403) this.showGrid = false;
                        console.log(error);
                    }
                );
        },
        columns:[
            {title: 'CustomerGuid', data:'CustomerGuid', sortable: false, resizable: true, type: "html", htmlElement: 'CustomerGuidHtml'},
            {title: 'Name', data:'Name', sortable: true, resizable: true, type: "html", htmlElement: 'NameHtml'},
            {title: 'Email', data:'Email', sortable: true, resizable: true},
            {title: 'Phone', data:'Phone', sortable: true, resizable: true, type: "html", htmlElement: 'PhoneHtml'},
            {title: 'Reward Code', data:'RewardCode', sortable: true, resizable: true, type: "html", htmlElement: 'RewardCodeHtml'},
            {title: 'Business Name', name:'businessName',sortable: true, data:'BusinessName', type: 'text', searchable: true},
            {title: 'Status', data:'Status', sortable: true, resizable: true, type: 'conditional', condition:{positive: false }}
        ],
        filters:[
            {title: 'Name', name:'name', data:'Name', value: '', type: 'text', searchable: true},
            {title: 'Email', name:'email', data:'Email', type: 'text', searchable: true},
            {title: 'Phone', name:'phone', data:'Phone', type: 'text', searchable: true},
            {title: 'Reward Code', name:'rewardCode', data:'RewardCode', type: 'text', searchable: true},
            {title: 'Customer Guid', name:'customerGuid', data:'CustomerGuid', value: '', type: 'guid', searchable: true},
            {title: 'Business Name', name:'businessName', data:'BusinessName', type: 'text', searchable: true}],
        rowTooltip: this.rowTooltip,
        rowDoubleClick: (rowEvent) => {
            this.router.navigate(['/customer-details/' + rowEvent.row.item.CustomerGuid]);
        }
    };

    constructor(public customerService: CustomerService, public auth : AuthService, public router: Router, private activatedRoute: ActivatedRoute){
    }

    customizeSearch(searchModel){
        if(searchModel!=null && searchModel.name!=null && searchModel.name!="" && !searchModel.name.includes('*')){
            searchModel.name = '*' + searchModel.name.trim(' ') +'*';
        }
        if(searchModel!=null && searchModel.email!=null && searchModel.email!="" && !searchModel.email.includes('*')){
            searchModel.email = '*' + searchModel.email.trim(' ') +'*';
        }
        if(searchModel!=null && searchModel.businessName!=null && searchModel.businessName!="" && !searchModel.businessName.includes('*')){
            searchModel.businessName = '*' + searchModel.businessName.trim(' ') +'*';
        }

        return searchModel;
    }

    detailClick(row) {
        console.log(row);
        this.router.navigate(['/customer-details/' + row.CustomerGuid]);
    }

    rowTooltip(item) { return item.Name; }

    ngOnInit(){
        this.activatedRoute.queryParams.forEach((params: Params) => {

            if(!this.vc && Object.getOwnPropertyNames(params).length > 0) {
                var page = params['page'];
                var pageSize = params['pageSize'];
                this.name = params['name'];
                this.email = params['email'];
                this.phone = params['phone'];
                var customerGuid = params['customerguid'];
                var rewardCode = params['rewardCode'];
                var businessName = params['businessName'];
                let field = params['field'];
                let dir = params['dir'];

                this.search.page = page ? page : 1;
                this.search.pageSize = pageSize ? pageSize : 10;
                this.search.name = this.name;
                this.search.email = this.email;
                this.search.phone = this.phone;
                this.search.customerGuid = customerGuid;
                this.search.rewardCode = rewardCode;
                this.search.businessName = businessName;

                if(field && dir) {
                    this.search.sort = [];
                    this.search.sort.push({
                        'field': field,
                        'dir': dir
                    });

                    this.dataGridConfig.sortBy = field;
                    this.dataGridConfig.sortAsc = dir == 'asc' ? true : false;
                }

                this.dataGridConfig.limit = this.search.pageSize * 1;
                this.dataGridConfig.offset = (this.search.page-1)*this.search.pageSize;
            }
            else if (this.vc && Object.getOwnPropertyNames(params).length < 1){
                this.search.name = "";
                this.search.email = "";
                this.search.phone = "";
                this.search.businessName = "";
                this.search.customerGuid = "";
                this.search.rewardCode = "";
                this.search.sort = [];
                this.search.page = 1;
                this.search.pageSize = 10;
                this.vc.resetGrid(this.vc, this.search);
            }
        });
    }
}