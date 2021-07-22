import { Component, OnInit,OnChanges, Input, ViewChild } from '@angular/core';
import { DataGridComponent } from '../../../widgets/data-grid/data-grid.component';
import { KycModelSearch } from '../../../models/kyc-cognitive';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { KycCognitiveService } from '../../../dal/kyc-cognitive.service';

@Component({
  selector: 'app-form-model-list',
  templateUrl: './form-model-list.component.html',
  styleUrls: ['./form-model-list.component.css']
})
export class FormModelListComponent implements OnInit, OnChanges {
  ngOnInit() {
  }
  ngOnChanges() {
    if(this.updateChild){
      this.vc.reloadItems(this.search);
    }
  }
  
  @Input() updateChild: any;
  @ViewChild('formModelGrid') vc: DataGridComponent;
  busyTransaction: Subscription;
  search: KycModelSearch = new KycModelSearch();
  constructor(public kycCognitiveService: KycCognitiveService, public router: Router, public auth: AuthService) { }
  showGrid: boolean = true;
  dataGridConfig: any = {
    gridId: "formModel-grid",
    referenceName: "formModelGrid",
    items: [],
    itemCount: 0,
    loadLater: false,
    searchModel: this.search,
    loadGrid: (searchModel: any, dataGrid: any) => {
      
      this.busyTransaction = this.kycCognitiveService.getFormModels(searchModel)
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
      { title: 'Country', data: 'CountryName', sortable: true, resizable: true, nowrap: true },
      { title: 'Id Card', data: 'IdCardName', sortable: false, resizable: true, nowrap: true },
      { title: 'Model Id', data: 'ModelId', sortable: false, resizable: true },
      { title: 'Updated On', data: 'UpdatedOn', type: "date", sortable: true, resizable: true }
    ],
    filters: [],
    rowTooltip: this.rowTooltip,
  };

  rowTooltip(item) { return item.CountryName + ' - ' + item.IdCardName; }

  gridSearch() {
    this.search.page = 1;
    this.search.pageSize = 10;
    this.vc.savedPageInfo.pageSize = 0;
    this.vc.savedPageInfo.offset = 0;
    this.vc.reloadItems(this.search);
  }

}
