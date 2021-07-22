import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-info',
  templateUrl: 'info.component.html',
  styleUrls: ['info.component.css']
})
export class InfoComponent implements OnInit {

  infoText: string;

  constructor( private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    var info = this.activatedRoute.snapshot.queryParams["q"];
    if(info == "unverified"){
      this.infoText = "You are not authorized for this app. Please contact with system admin."
    }
  }

}
