import { Component, OnInit } from '@angular/core';
import { User } from '../../models/user';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-menu-aside',
  styleUrls: ['./menu-aside.component.css'],
  templateUrl: './menu-aside.component.html'
})
export class MenuAsideComponent implements OnInit {
  public currentStartingUrl: Array<string>;
  public currentPageLink = '';
  private links: Array<any> = [
    {
      'id': 1,
      'title': 'Home',
      'icon': 'dashboard',
      'permission': ['JamesBasic'],
      'link': ['/home'],
      'isActive': false
    },
    {
      'id': 2,
      'title': 'Customer',
      'icon': 'users',
      'link': ['/customer'],
      'isActive': true,
      'permission': ['SupportPersonell'],
      'innerLinks': ['/customer-details', '/']
    },
    {
      'id': 3,
      'title': 'Customer Verification',
      'icon': 'users',
      'link': ['/customer-verification-list'],
      'isActive': false,
      'innerLinks': ['/kyc-customer-detail'],
      'permission': ['KycProcessor']
    },
    {
      'id': 4,
      'title': 'Fund',
      'icon': 'money',
      'class': 'treeview',
      'link': [''],
      'isActive': false,
      'permission': ['CashManagement'],
      'sublinks': [
        {
          'id': 1,
          'title': 'Transaction',
          'link': ['/transaction'],
          'isActive': false,
          'permission': ['CashManagement']
        },
        {
          'id': 2,
          'title': 'Deposit List',
          'link': ['/deposit-list'],
          'isActive': false,
          'permission': ['CashManagement']
        }
      ]
    },
    {
      'id': 5,
      'title': 'Spenn Business',
      'icon': 'briefcase',
      'link': ['/business-register'],
      'isActive': false,
      'class': 'treeview',
      'permission': ['SpennBusinessAdministrator'],
      'sublinks': [
        {
          'id': 1,
          'title': 'Register Business',
          'link': ['/business-register'],
          'isActive': false,
          'permission': ['SpennBusinessAdministrator']
        },
        {
          'id': 2,
          'title': 'Add New User',
          'link': ['/business-add-user'],
          'isActive': false,
          'permission': ['SpennBusinessAdministrator']
        }
      ]
    },
    {
      'id': 6,
      'title': 'Agent',
      'icon': 'id-badge',
      'link': ['/agent'],
      'isActive': false,
      'class': 'treeview',
      'permission': ['AgentSupervisor'],
      'innerLinks': [ '/agent-details', '/agent-registration' ],
      'sublinks': [
        {
          'id': 1,
          'title': 'Agents List',
          'icon': 'id-badge',
          'link': ['/agent'],
          'isActive': false,
          'permission': ['AgentSupervisor']
        },
        {
          'id': 2,
          'title': 'Register Agent',
          'icon': 'id-badge',
          'link': ['/agent-registration'],
          'isActive': false,
          'permission': ['AgentSupervisor']
        }
      ]
    },
    {
      'id': 7,
      'title': 'Loan Applications',
      'icon': 'address-card-o',
      'link': ['/loan-application-list'],
      'innerLinks': ['/loan-application-detail'],
      'isActive': false,
      'permission': ['LoanProcessor']
    },
    {
      id: 8,
      'title': 'User Management',
      'icon': 'puzzle-piece',
      'link': ['/user'],
      'isActive': false,
      'permission': ['BigBoss']
    },
    {
      id: 9,
      'title': 'Log',
      'icon': 'wrench',
      'link': ['/log-viewer'],
      'isActive': false,
      'permission': ['ExceptionLog']
    },
    {
      id: 10,
      'title': 'Localization',
      'icon': 'wrench',
      'external': true,
      'target': '_self',
      'link': ['/localizationAdmin/'],
      'isActive': false,
      'permission': ['BigBoss']
    },
    {
      id: 11,
      'title': 'Configuration',
      'icon': 'cogs',
      'link': ['/kyc-cognitive-service/form-model-config'],
      'isActive': false,
      'permission': ['BigBoss']
    }
  ];


  constructor(public router: Router, public auth: AuthService, public users: UserService ) {
    // getting the current url
    this.router.events.subscribe((evt) => {
      if(evt.constructor.name === "NavigationEnd") {
      this.currentStartingUrl = evt["url"].split('?')[0].split('/');
      var index = this.currentStartingUrl.indexOf("", 0);
      if (index > -1) this.currentStartingUrl.splice(index, 1);
      if (this.currentStartingUrl.length > 0) this.currentStartingUrl[0] = `/${this.currentStartingUrl[0]}`
      this.currentPageLink = this.currentStartingUrl[0];
      }
    });
  }

  onElemClick = function (item) {

    if (item.sublinks) {
      this.links.forEach(element => {
        element.isActive = false;
      });
      var selectedItem = this.links.find(x => x.id == item.id);
      selectedItem.isActive = !selectedItem.isActive;
      return;
    }

    this.links.forEach(element => {
      if (element.link == item.link) {
        element.isActive = true;
      } else {
        element.isActive = false;
      }

      if (element.sublinks) {
        element.sublinks.forEach(sublink => {
          if (sublink.link == item.link) {
            sublink.isActive = true;
          } else {
            sublink.isActive = false;
          }
        });
      }
    });
  }

  public ngOnInit() {

    this.router.events.subscribe((evt) => {
      if(evt.constructor.name === "NavigationEnd") {
      this.currentStartingUrl = evt["url"].split('?')[0].split('/');
      var index = this.currentStartingUrl.indexOf("", 0);
      if (index > -1) this.currentStartingUrl.splice(index, 1);
      if (this.currentStartingUrl.length > 0) this.currentStartingUrl[0] = `/${this.currentStartingUrl[0]}`
      this.currentPageLink = this.currentStartingUrl[0];
       this.users.setUrl(this.currentPageLink);
      this.links.forEach(element => {
        if (element.link == this.currentPageLink) element.isActive = true;
        else element.isActive = false;

        if (element.sublinks) {
          element.sublinks.forEach(item => {
            if (item.link == this.currentPageLink) {
              element.isActive = true;
              item.isActive = true;
            }
          });
        }

        if(element.innerLinks)
        {
          element.innerLinks.forEach(item => {
            if (item == this.currentPageLink) {
              element.isActive = true;
            }
          });
        }
      });
    }
    });

  }

}
