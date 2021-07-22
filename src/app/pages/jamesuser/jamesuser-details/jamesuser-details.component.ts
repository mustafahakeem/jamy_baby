import { Component, OnInit, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { JamesuserService } from '../../../dal/jamesuser.service';
import { Subscription } from 'rxjs';
import { StaticDataService } from '../../../services/static.data.service';
import { NotificationService } from '../../../services/notification.service';
import { AuthService } from '../../../services/auth.service';
import { PermissionGroupView, UserDetailView } from '../../../models/user';
import { UiSwitchModule } from 'ngx-toggle-switch';

@Component({
  selector: 'app-jamesuser-details',
  templateUrl: './jamesuser-details.component.html',
  styleUrls: ['./jamesuser-details.component.css']
})
export class JamesuserDetailsComponent implements OnInit {

  userdetails: UserDetailView;
  busy: Subscription;
  userGuid: string;
  permissionGroupViews: PermissionGroupView[];

  constructor(public jamesuserService: JamesuserService,
    private activatedRoute: ActivatedRoute,
    public router: Router,
    private staticDataService: StaticDataService,
    private notificationService: NotificationService,
    private auth: AuthService) {

  }
  ngOnInit() {
    this.activatedRoute.params.subscribe(params => {
      this.userGuid = params.userguid;
      this.busy = this.jamesuserService.getUserDetails(this.userGuid).subscribe(
        data => {
          console.log(data);
          this.userdetails = data;
          this.staticDataService.getJamesUserPermissionGroups().subscribe(
            data =>{
              this.userdetails.PermissionGroupViews = PermissionGroupView.MergeTwoArrays(PermissionGroupView.ConvertToArrayWithChecked(this.userdetails.PermissionGroupViews)
              , data);
            },
            error => {
              console.log("Error loading james permission groups");
            }
          );
         
        },
        error => {

          console.log(error);
        }
      )
    });
  }

  public onSubmit() {
    this.busy = this.jamesuserService.updateUserPermissions(this.userdetails)
      .subscribe(
        data => {
          console.log("Updated user permission successfully.");
         this.notificationService.success("Updated user permission successfully.");
       
        },
        error => {
            console.log(error);
            this.notificationService.error(error,"Error in user update");
        }
      );
  }
}
