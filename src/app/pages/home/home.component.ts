import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { BreadcrumbService } from '../../services/breadcrumb.service';
import {Subscription } from 'rxjs';
import {AuthService} from "../../services/auth.service";
import {Response} from '@angular/http';
import {Observable} from 'rxjs/Observable';
import {NotificationService} from "../../services/notification.service";

declare var KF: any;

@Component({
  selector: 'app-home',
  styleUrls: ['./home.component.css'],
  templateUrl: './home.component.html'
})
export class HomeComponent implements OnInit, OnDestroy {
  public date: Date = new Date();
  private subscription: Subscription;

  constructor(private breadServ: BreadcrumbService,
              private router: Router,
              private activatedRoute: ActivatedRoute,
              private notif: NotificationService,
              private authService : AuthService) {
    // TODO
  }

  public ngOnInit() {
    console.log("Welcome to James");
    //
    // KF.embed.embedKlip({
    //   profile : "a620778c3d1c73811dbf076bd4907dc2",
    //   settings : {"width":1577,"theme":"light","borderStyle":"round","borderColor":"#cccccc"},
    //   title : "Key figures"
    // });

  }

  public ngOnDestroy() {

  }

}
