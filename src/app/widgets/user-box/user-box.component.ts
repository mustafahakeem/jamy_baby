import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  /* tslint:disable */
  selector: '.userBox',
  /* tslint:enable */
  styleUrls: ['./user-box.component.css'],
  templateUrl: './user-box.component.html'
})
export class UserBoxComponent implements OnInit {
  constructor(public auth: AuthService, private router: Router) {
    // TODO
  }

  public ngOnInit() {
    // TODO
  }

  public logout = (): void => {
    this.auth.logout();
  }
}
