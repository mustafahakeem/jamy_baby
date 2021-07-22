import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { CustomerService } from "../../dal/customer.service";
import { environment } from "../../../environments/environment";
import { AuthService } from "../../services/auth.service";
import { Params, Router, Routes, ActivatedRoute } from "@angular/router";
import { GenericGridComponent } from "../../widgets/generic-grid/generic-grid.component";
import 'jquery';
import { AgentSearch } from "../../models/agent";
import { Subscription } from 'rxjs';
import {DataGridComponent} from "../../widgets/data-grid/data-grid.component";
import { AgentService } from 'app/dal/agent.service';

@Component({
    providers: [AgentService, DataGridComponent],
    selector: 'app-agent',
    styleUrls: [],
    templateUrl: './agent.component.html'
})
export class AgentComponent implements OnInit{
    @ViewChild('agentGrid') vc:DataGridComponent;
    busy: Subscription;
    phone: string;
    agentNumber: number = 0;
    showGrid: boolean = true;

    search: AgentSearch = new AgentSearch();

    dataGridConfig:any={
        // headerTitle: "Customer List",
        gridId: "agent-grid",
        referenceName: "agentGrid",
        items: [],
        itemCount: 0,
        loadLater: true,
        // dataSearch: this.dataSearch,
        customizeSearch: this.customizeSearch,
        searchModel: this.search,
        buttonName: "Details",
        buttonClick: (row) => this.detailClick(row),
        loadGrid: (searchModel: any, dataGrid: any) => {
            this.router.navigate(['/agent'],{ queryParams: {
                page: searchModel.page,
                pageSize: searchModel.pageSize,
                agentNumber: searchModel.agentNumber,
                agentName: searchModel.agentName,
                phone: searchModel.phone,
                field: searchModel.sort[0] ? searchModel.sort[0].field : null,
                dir: searchModel.sort[0] ? searchModel.sort[0].dir : null
            }});
            this.busy = this.agentService.searchAgents(searchModel)
                .subscribe(
                    data => {
                        this.showGrid = true;
                        dataGrid.items = data.Data;
                        dataGrid.itemCount = data.Total;

                        dataGrid.items.forEach((item: any) => {
                            item.AgentNumberHtml = `<a href="/agent-details/${item.AgentNumber}">${item.AgentNumber}</a>`;
                            item.NameHtml = `<a href="/agent-details/${item.AgentNumber}">${item.Name}</a>`;
                            item.PhoneHtml = `<a href="/agent-details/${item.AgentNumber}">${item.Phone}</a>`;
                        });
                    },
                    error => {
                        if(error.status === 401 || error.status === 403) this.showGrid = false;
                        console.log(error);
                    }
                );
        },
        columns:[
            {title: 'Agent Number', data:'AgentNumber', sortable: true, resizable: true, type: "html", htmlElement: 'AgentNumberHtml'},
            {title: 'Phone', data:'Phone', sortable: true, resizable: true, type: "html", htmlElement: 'PhoneHtml'},
            {title: 'Agent Name', name:'AgentName',sortable: true, data:'AgentName', type: 'text', searchable: true}
        ],
        filters:[
            {title: 'Agent Number', name:'agentNumber', data:'AgentNumber', type: 'text', searchable: true},
            {title: 'Agent Name', name:'agentName', data:'AgentName', type: 'text', searchable: true},
            {title: 'Phone', name:'phone', data:'Phone', type: 'text', searchable: true}],
        rowTooltip: this.rowTooltip,
        rowDoubleClick: (rowEvent) => {
            this.router.navigate(['/agent-details/' + rowEvent.row.item.AgentNumber]);
        }
    };

    constructor(public agentService: AgentService, public auth : AuthService, public router: Router, private activatedRoute: ActivatedRoute){
    }

    customizeSearch(searchModel){
        if(searchModel!=null && searchModel.agentName!=null && searchModel.agentName!="" && !searchModel.businessName.includes('*')){
            searchModel.agentName = '*' + searchModel.businessName.trim(' ') +'*';
        }

        return searchModel;
    }

    detailClick(row) {
        this.router.navigate(['/agent-details/' + row.AgentNumber]);
    }

    rowTooltip(item) { return item.AgentName; }

    ngOnInit(){
        this.activatedRoute.queryParams.forEach((params: Params) => {

            if(!this.vc && Object.getOwnPropertyNames(params).length > 0) {
                var page = params['page'];
                var pageSize = params['pageSize'];
                this.phone = params['phone'];
                this.agentNumber = params['agentNumber'];
                var agentName = params['agentName'];
                let field = params['field'];
                let dir = params['dir'];

                this.search.page = page ? page : 1;
                this.search.pageSize = pageSize ? pageSize : 10;
                this.search.phone = this.phone;
                this.search.agentName = agentName;
                this.search.agentNumber = this.agentNumber;

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
                this.search.phone = "";
                this.search.agentNumber = null;
                this.search.agentName = "";
                this.search.sort = [];
                this.search.page = 1;
                this.search.pageSize = 10;
                this.vc.resetGrid(this.vc, this.search);
            }
        });
    }
}