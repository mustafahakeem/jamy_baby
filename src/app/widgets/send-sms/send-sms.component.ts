import { Component, Input, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { CustomerService } from '../../dal/customer.service';
import { NotificationService } from '../../services/notification.service';

// This lets me use jquery
declare var $: any;

@Component({
  selector: 'app-send-sms',
  templateUrl: './send-sms.component.html'
})
export class SendSmsComponent implements OnInit {
  
  @Input() customerGuid: string;
  message:string;
  busySms: Subscription;

  constructor(
    private customerService:CustomerService,
    private notificationService:NotificationService
  ) { }

  ngOnInit() {
    var arr = this.customerGuid;
  }

  showSMSModal():void {
    $("#SmsSendModal").modal('show');
  }
  sendSMSModal(): void {
    this.sendSmsCustomer();
    //do something here
    // this.hideSMSModal();
  }

  sendSmsCustomer() {
     this.busySms = this.customerService.sendSmsCustomer({ customerGuid: this.customerGuid, message: this.message })
        .subscribe(
            data => {
              this.notificationService.success("Sms sent successfully");              
              this.hideSMSModal();
            },
            error => {
              this.notificationService.error("Sms not sent");
                console.log(error);
                this.hideSMSModal();
            }
        );
        this.message='';
}

  hideSMSModal():void {
    $("#SmsSendModal").modal('hide');
  }
}
