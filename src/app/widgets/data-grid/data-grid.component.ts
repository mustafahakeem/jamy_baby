import {Component, OnInit, Input, ViewChild, HostListener,ChangeDetectorRef } from '@angular/core';
import { Params, Router, Routes, ActivatedRoute } from "@angular/router";
import 'jquery';

declare var $: any;

@Component({
  selector: 'data-grid',
  templateUrl: './data-grid.component.html',
  styleUrls: ['./data-grid.component.css']
})
export class DataGridComponent implements OnInit {
  @Input() dataGridConfig;
  @ViewChild('genericDataGrid') vc:DataGridComponent;

  items = [];
  itemCount = 0;
  limit = 10;
  offset = 0;
  sortBy: string;
  sortAsc: boolean;
  loadLater = false;
  showReloading = false;
  resizeLimit = 50;

  defaultDataGridConfig:any={
    loadLater: false,
    loadGrid: this.loadGrid,
    dataSearch: this.dataSearch,
    customizeSearch: this.customizeSearch,
    searchModel: {},
    columns:[],
    filters:[],
    rowClick: this.rowClick,
    rowDoubleClick: this.rowDoubleClick,
    rowTooltip: this.rowTooltip,
    limit: 10,
    offset: 0,
    showReloading: false,
    indexColumn: true,
    resetGrid: this.resetGrid,
    buttonClick: this.detailClick,
    buttonName: null
  };

  constructor(public router: Router, 
              private activatedRoute: ActivatedRoute) 
              { 
                
              }

  loadGrid(searchModel, any){
    console.log(searchModel);
  }

  dataSearch(searchModel){
    console.log(searchModel);
    if(this.dataGridConfig.customizeSearch) searchModel = this.dataGridConfig.customizeSearch(searchModel);
    searchModel.page = 1;
    this.dataGridConfig.loadLater = false;
    this.vc.offset == 0 ? this.dataGridConfig.loadGrid(searchModel, this.dataGridConfig) : this.vc.offset = 0;
  }

  resetGrid(dataGrid, searchModel){
    this.vc.offset = 0;
    this.dataGridConfig.loadGrid(searchModel, this.dataGridConfig)
  }

  resetOffset() {
    this.vc.offset = 0;
  }

  customizeSearch(searchModel){
    return searchModel;
  }

  savedPageInfo: any={
    pageSize: 0,
    offset: 0,
    time: 0
  }

  refreshButtonClicked = function(params){
    return this.loadDataFromRemote(params);
  }

  reloadItems(params, reloadEvent = false) {
    console.log(params);

    if(reloadEvent === true && params.sortBy === undefined && params.offset !== undefined && params.limit !== undefined) {
      // this is a blur event
      if(this.savedPageInfo.pageSize === params.limit && this.savedPageInfo.offset === params.offset 
        && this.vc.limit === params.limit
        && this.dataGridConfig.searchModel.pageSize === params.limit
        && Date.now() - this.savedPageInfo.time < 1500) {
        console.log("Duplicate call");
        return params;
      }
    }

    return this.loadDataFromRemote(params);
    
  }
  private loadDataFromRemote = function (params){

    if(!this.dataGridConfig.loadLater) {
      this.dataGridConfig.searchModel.pageSize = params.pageSize ? params.pageSize : params.limit;
      this.dataGridConfig.searchModel.page = params.page ? params.page : Math.floor(params.offset / this.dataGridConfig.searchModel.pageSize) + 1;
      this.dataGridConfig.searchModel.page = !!this.dataGridConfig.searchModel.page ? this.dataGridConfig.searchModel.page : 0

      if (params.sortBy) {
        this.dataGridConfig.searchModel.sort = [];
        this.dataGridConfig.searchModel.sort.push({
          'field': params.sortBy,
          'dir': params.sortAsc ? "asc" : "desc"
        });
      }

      this.savedPageInfo.pageSize = this.dataGridConfig.searchModel.pageSize;
      this.savedPageInfo.offset = this.dataGridConfig.searchModel.pageSize * (this.dataGridConfig.searchModel.page - 1);
      this.savedPageInfo.time = Date.now();

      if(this.savedPageInfo.offset !== this.vc.offset) {
        this.vc.offset = this.savedPageInfo.offset;
      }
      this.dataGridConfig.loadGrid(this.dataGridConfig.searchModel, this.dataGridConfig);
      this.vc.resizeLimit = 80;
    }
    return params;
  }

  detailClick(row) {
    console.log(row);
  }

  // special properties:

  rowClick(rowEvent) {
    // console.log('Clicked: ');
    // console.log( rowEvent.row.item);
  }

  rowDoubleClick(rowEvent) {
    console.log('Double Clicked: ');
    console.log( rowEvent.row.item);
  }

  rowTooltip(item, col) {
    return  item[Object.keys(item)[1]];
  }

  ngOnInit() {
    this.dataGridConfig = $.extend( this.defaultDataGridConfig, this.dataGridConfig );
  }

  CheckChange(itemname, event ) {
    this.dataGridConfig.searchModel[itemname] = event.target.checked;
  } 
}
