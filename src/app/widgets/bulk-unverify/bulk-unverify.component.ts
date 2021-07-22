import { Component, Input, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { CustomerService } from '../../dal/customer.service';
import { NotificationService } from '../../services/notification.service';

// This lets me use jquery
declare var $: any;

@Component({
  selector: 'app-bulk-unverify',
  templateUrl: './bulk-unverify.component.html'
})
export class BulkUnverifyComponent implements OnInit {
  
  @Input() rewardCode: string;
  unverifyReason:string;
  referredCustomerCount:string;
  referredCustomerswithActiveLoan:string;
  busyUnverifyBulk: Subscription;

  constructor(private customerService:CustomerService,
              private notificationService:NotificationService) { 
  }

  ngOnInit() {
    this.getReferredCustomerCount(this.rewardCode);
    this.unverifyReason ="";
  }

  showBulkUnverifyModal():void {
    $("#BulkUnverifyModal").modal('show');
  }

  hideBulkUnverifyModal():void {
    $("#BulkUnverifyModal").modal('hide');
  }

  unverifyAllReferred(): void {
    this.unverifyAllReferredCustomers();
  }

  isInputValid(): boolean{
    if(this.unverifyReason == "" || this.referredCustomerCount == "0")
        return false;
    else
        return true;
    }

  getReferredCustomerCount(rewardCode:string) {
     this.busyUnverifyBulk = this.customerService.getReferredCutomerCount(rewardCode)
        .subscribe(
            data => {  
              this.referredCustomerCount = data.ReferredCustomersCount;
              this.referredCustomerswithActiveLoan = data.ReferredCustomersWithActiveLoanCount;
            },
            error => {
              this.notificationService.error("Referred Customer count could not be retrieved");
                console.log(error);
                this.hideBulkUnverifyModal();
            }
        );
        
}

unverifyAllReferredCustomers() {
    this.busyUnverifyBulk = this.customerService.unverifyAllReferredCutomers({ RewardCode: this.rewardCode, UnverifyReason: this.unverifyReason })
    .subscribe(
        data => {
          this.notificationService.success("Bulk unverify successfull.");              
          this.hideBulkUnverifyModal();
          this.getReferredCustomerCount(this.rewardCode);
          this.unverifyReason ="";
        },
        error => {
          this.notificationService.error("Bulk unverify Failed.");
            console.log(error);
            this.hideBulkUnverifyModal();
        }
    );
  }
  
}
