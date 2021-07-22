import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { DataGridComponent } from '../../widgets/data-grid/data-grid.component';
import { LookupService } from '../../dal/lookup.service';
import { Subscription } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { AuditHistorySearch } from '../../models/Customer';
import { Router, ActivatedRoute } from '@angular/router';
import { AuditHistoryService } from '../../dal/audit-history.service';

@Component({
    providers: [DataGridComponent, LookupService],
    selector: 'app-audit-history',
    templateUrl: './audit-history.component.html',
    styleUrls: ['./audit-history.component.css']
})
export class AuditHistoryComponent implements OnInit {
    @ViewChild('customerGrid') vc: DataGridComponent;
    @Input() customerGuid: string;
    busy: Subscription;
    showGrid: boolean = true;
    search: AuditHistorySearch = new AuditHistorySearch();

    constructor(public auth: AuthService, public router: Router, private auditHistoryService: AuditHistoryService, private activatedRoute: ActivatedRoute, ) {

    }

    ngOnInit() {
        this.search.customerGuid = this.customerGuid;
        this.search.page = 1;
        this.search.pageSize = 10;
    }

    dataGridConfig: any = {
        gridId: "audit-history-grid",
        referenceName: "customerGrid",
        items: [],
        itemCount: 0,
        loadLater: false,
        searchModel: this.search,
        buttonName: null,
        rowTooltip: null,
        loadGrid: (searchModel: any, dataGrid: any) => {
            searchModel.customerGrid = this.search.customerGuid;
            this.busy = this.auditHistoryService.getAuditHistories(searchModel)
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
            { title: 'Created Date', data: 'CreateDate', sortable: false, resizable: true, type: "date" },
            { title: 'Action Name', data: 'ActionName', sortable: false, resizable: true },
            { title: 'Old Value', data: 'OldValue', sortable: false, resizable: true },
            { title: 'New Value', data: 'NewValue', sortable: false, resizable: true },
            { title: 'Description', data: 'Description', sortable: false, resizable: true },
            { title: 'Performed by', data: 'ActionByIdentifier', sortable: false, resizable: true }        ],
        // filters: [
        //   {
        //     title: 'Action By User Guid', name: 'actionByUserGuid', data: 'actionByUserGuid', value: '', type: 'text', searchable: true
        //   },
        //   {
        //     title: 'Action for Customer Guid', name: 'customerGuid', data: 'customerGuid', value: '', type: 'text', searchable: true
        //   },
        // ]
    };
}
