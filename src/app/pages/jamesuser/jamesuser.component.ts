import { Component, OnInit, ViewChild } from '@angular/core';
import { JamesuserService } from "../../dal/jamesuser.service";
import { AuthService } from "../../services/auth.service";
import { Params, Router, Routes, ActivatedRoute } from "@angular/router";
import { PermissionGroupView, UserSearch } from "../../models/user";
import { Subscription } from 'rxjs';
import { DataGridComponent } from "../../widgets/data-grid/data-grid.component";
import { StaticDataService } from '../../services/static.data.service';
import 'jquery';

@Component({
  selector: 'app-jamesuser',
  templateUrl: './jamesuser.component.html',
  styleUrls: ['./jamesuser.component.css']
})
export class JamesuserComponent implements OnInit {

  constructor(public userService: JamesuserService, 
              public auth: AuthService, 
              public router: Router, 
              private activatedRoute: ActivatedRoute,
              private staticDataService: StaticDataService) {
  }

    @ViewChild('userGrid') vc: DataGridComponent;
    busy: Subscription;
    name: string;
    email: string;
    permissiongroupguid: string;
    showGrid: boolean = true;

    search: UserSearch = new UserSearch();

    noPermissionGroupView: PermissionGroupView;
    permissionGroupViews: PermissionGroupView[]  = [];
  
    dataGridConfig: any = {
      gridId: "user-grid",
      referenceName: "userGrid",
      items: [],
      itemCount: 0,
      loadLater: false,
      customizeSearch: this.customizeSearch,
      searchModel: this.search,
      buttonClick: (row) => this.detailClick(row),
      loadGrid: (searchModel: any, dataGrid: any) => {
      this.router.navigate(['/user'], {
          queryParams: {
            page: searchModel.page,
            pageSize: searchModel.pageSize,
            name: searchModel.name,
            email: searchModel.email,
            userguid: searchModel.userGuid,
            permissiongroupguid : searchModel.permissionGroupGuid,
            field: searchModel.sort[0] ? searchModel.sort[0].field : null,
            dir: searchModel.sort[0] ? searchModel.sort[0].dir : null
          }
        });
        this.busy = this.userService.searchUsers(searchModel)
          .subscribe(
            data => {
              this.showGrid = true;
              dataGrid.items = data.Data;
              dataGrid.itemCount = data.Total;
              dataGrid.items.forEach((item: any) => {
                item.FirstName = item.FirstName + " " +item.LastName;
                item.UserGuidHtml = `<a href="/jamesuser-details/${item.Id}">${item.Id}</a>`;
              });
            },
            error => {
              if (error.status === 401 || error.status === 403) this.showGrid = false;
              console.log(error);
            }
          );
      },
      columns: [
        { title: 'User Guid', data: 'Id', sortable: false, resizable: true, type: "html", htmlElement: 'UserGuidHtml' },
        { title: 'Name', data: 'FirstName', sortable: true, resizable: true },
        { title: 'Email', data: 'UserName', sortable: true, resizable: true },
        { title: 'Permissions', data: 'PermissionGroup', sortable: false, resizable: true, nowrap: true }
      ],
      filters: [
        { title: 'Name', name: 'name', data: 'FirstName', value: '', type: 'text', searchable: true },
        { title: 'Email', name: 'email', data: 'UserName', type: 'text', searchable: true },
        { title: 'User Guid', name: 'userGuid', data: 'Id', value: '', type: 'guid', searchable: true },
        {
          title: 'James Permission', name: 'permissionGroupGuid', type: 'select', options: this.permissionGroupViews,
          optionValue: 'PermissionGroupGuid', optionLabel: 'GroupName', isRequired: false, searchable: true
        }],
      rowTooltip: this.rowTooltip,
      rowDoubleClick: (rowEvent) => {
                  this.detailClick(rowEvent.row);
      }
    };
    
    ngOnInit() {
      this.activatedRoute.queryParams.forEach((params: Params) => {
  
        if (!this.vc && Object.getOwnPropertyNames(params).length > 0) {
          var page = params['page'];
          var pageSize = params['pageSize'];
          this.name = params['name'];
          this.email = params['email'];
          this.permissiongroupguid = params['permissiongroupguid'];
          let field = params['field'];
          let dir = params['dir'];
  
          this.search.page = page ? page : 1;
          this.search.pageSize = pageSize ? pageSize : 10;
          this.search.name = this.name;
          this.search.email = this.email;
          this.search.permissionGroupGuid = this.permissiongroupguid;
  
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
          this.search.name = "";
          this.search.email = "";
          this.search.permissionGroupGuid = "";
          this.search.sort = [];
          this.search.page = 1;
          this.search.pageSize = 10;
          this.vc.resetGrid(this.vc, this.search);
        }
      });

      this.staticDataService.getJamesUserPermissionGroups().subscribe(
        data =>{
          console.log(data);
          this.permissionGroupViews = data;
          this.createNoPermissionView();
          this.dataGridConfig.filters[3].options = this.permissionGroupViews;
          if (this.permissionGroupViews && this.permissionGroupViews.length > 0) {
            this.dataGridConfig.searchModel.permissionGroupGuid = '';
          }
        },
        error => {
          console.log("Error loading james permission groups");
        }
      );
    }

    private createNoPermissionView(){
      this.noPermissionGroupView = JSON.parse('{ "GroupName":"NoPermission", "PermissionGroupGuid" : "NoPermission"}');
      this.permissionGroupViews.splice(0,0,this.noPermissionGroupView);
      console.log(this.permissionGroupViews);
    }

    customizeSearch(searchModel) {
      if (searchModel != null && searchModel.name != null && searchModel.name != "" && !searchModel.name.includes('*')) {
        searchModel.name =  searchModel.name.trim(' ');
      }
      if (searchModel != null && searchModel.email != null && searchModel.email != "" && !searchModel.email.includes('*')) {
        searchModel.email =  searchModel.email.trim(' ') ;
      }
      return searchModel;
    }
  
    detailClick(row) {
      console.log(row);
    }
  
    rowTooltip(item) { 
      return item.PermissionGroup; 
    } 
    
  }
