import { Component, OnInit, Input } from '@angular/core';
import {AuthService} from "../../services/auth.service";
import 'jquery';
import {NotificationService} from "../../services/notification.service";

declare var $: any;

@Component({
  selector: 'generic-grid',
  templateUrl: './generic-grid.component.html',
  styleUrls: ['./generic-grid.component.css']
})
export class GenericGridComponent implements OnInit {
  @Input() gridConfig;
  dtOptions: any ={};
  offset = 0;

  defaultGridConfig:any = {
    loadLater: false,
    gridUrl: '',
    headers: {
      // 'Device-Client-Id':'mydevice1'
    },
    columns:[],
    filters:[],
    rowClick: this.rowClick,
    customizeRow: this.customizeRow,
    customizeData: null,
    enableFilter: false,
    customizeSearch: this.customizeSearch,
    search: this.gridSearch,
    searchModel: {}
  };

  searchInfo:any;
  
  constructor(public auth : AuthService, private notif: NotificationService) { }

  rowClick(info: any): void {
    console.log(info);
  }

  customizeRow(nRow: any, rowDetails: any) {
    return rowDetails;
  }

  customizeSearch(searchInfo: any) {
    return searchInfo;
  }

  gridSearch(searchInfo: any){
    this.searchInfo=searchInfo;
    console.log(searchInfo);
    var table = $('#generic-grid').DataTable();
    table.draw();
  }
  
  ngOnInit() {
    this.gridConfig = $.extend( this.defaultGridConfig, this.gridConfig );

    //date formate
    for(var  i = 0; i < this.gridConfig.columns.length; i++){
      if(this.gridConfig.columns[i].type == "date"){
        this.gridConfig.columns[i].render = function (value, type, full, meta) {
          if (value === null) return "";
          var dt = new Date(value);
          // return (dt.getMonth() + 1) + "/" + dt.getDate() + "/" + dt.getFullYear();
          return dt.toLocaleString();
        }
      }
    }

    this.gridLoad();
    if(this.gridConfig.loadLater) this.dtOptions.deferLoading = 0;
  }

  gridLoad(){
    var headers = {
      'Access-Control-Allow-Origin':'*',
      'Content-Type':'application/json'
    };
    headers['Authorization'] = `Bearer ${this.auth.token.accessToken}`;

    for(var header in this.gridConfig.headers){
      if(!this.gridConfig.headers.hasOwnProperty(header)) continue;

      headers[header] = this.gridConfig.headers[header];
    };
    var customizeSearch=this.gridConfig.customizeSearch;

    this.dtOptions = {
      sDom: "rtip",
      autoWidth: this.gridConfig.autoWidth ? this.gridConfig.autoWidth : false,
      responsive: true,
      // responsive: {
      //   details: false
      // },
      details: false,
      lengthMenu: [2, 5, 10, 25, 50],
      processing: true,
      serverSide: true,
      order: this.gridConfig.order ? this.gridConfig.order : [],
      ajax: {
        type: "POST",
        headers: headers,
        url: this.gridConfig.gridUrl,
        data:  ( d, a) => {
          d.page = d.start/d.length + 1;
          d.pageSize = d.length;
          var  forms = $("form#generic-grid-form");

          var obj ={};
          for(var  i = 0;  forms[0] && (i < forms[0].length-1); i++){
            obj[forms[0].elements[i].id] = forms[0].elements[i].value;
          }
          d = $.extend(d, obj);
          
          d.sort = [];
          d.order.forEach((sortingColumn: any) => {
            d.sort.push({
              'field': d.columns[sortingColumn.column].name,
              'dir': sortingColumn.dir });
          });

          d = customizeSearch(d);
          if(this.searchInfo!=null)
          {
            d = $.extend(d, this.searchInfo);
          }
          return JSON.stringify( d );
        },
        // dataSrc: function(json) {
        //     console.log(json);
        //     //return json.Data;
        // },
        dataFilter: (data) => {
          var json = $.parseJSON( data );
          json.recordsTotal = json.Total;
          json.recordsFiltered = json.Total;
          json.data = json.Data;

          let self = this;
          if(self.gridConfig.customizeData)  self.gridConfig.customizeData(json.data);

          return JSON.stringify( json );
        },
        error : (xhr, textStatus, error) =>{
          var responseMsg = JSON.parse(xhr.responseText);
          if(responseMsg && responseMsg.Message && responseMsg.ErrorCode){
            this.notif.error(`${responseMsg.Message}, ErrorCode- ${responseMsg.ErrorCode}`);
          }
          else this.notif.error(`Error occured with HttpStatus- ${xhr.status}, StatusText- ${xhr.statusText}`);
        }
      },
      // deferLoading: 0,
      deferRender: true,
      columns: this.gridConfig.columns,
      rowCallback: (nRow: any, aData: any, iDisplayIndex: number, iDisplayIndexFull: number) => {
        let self = this;
        self.gridConfig.customizeRow(nRow, aData);
        $('td', nRow).unbind('click');
        $('td', nRow).bind('click', () => {
          self.gridConfig.rowClick(aData);
        });
        return nRow;
      },
      // initComplete: function () {
      //     // var parentDiv = $('#generic-grid').parent().parent()
      //     // var form = parentDiv.find('form')
      //     // form.append('<div class="row"><div class="form-group col col-xs-4"><label for="phonenumber">Phone Number</label><input type="text" class="form-control" id="phonenumber" [(ngModel)]="search.phonenumber" name="phonenumber"></div></div>')
      //
      //     // this.api().columns().every( function () {
      //     //     var column = this;
      //     //     var select = $('<br/><input type="text" class="column_filter" id="col0_filter">')
      //     //         .appendTo( $(column.header()) );
      //     // } );
      // },
      displayStart: this.gridConfig.displayStart ? this.gridConfig.displayStart : 0,
      displayLength: 10,
      paginationType: 'full_numbers',
      scrollX: true,
      sScrollX: "100%",
      scrollY: this.gridConfig.height ? this.gridConfig.height : 385,
    };
  }

}
