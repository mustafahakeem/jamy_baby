import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { Subscription } from 'rxjs';
import { KycService } from '../../services/kyc.service';
import { NotificationService } from '../../services/notification.service';

// This lets me use jquery
declare var $: any;

@Component({
  selector: 'app-kyc-escalate',
  templateUrl: './kyc-escalate.component.html'
})
export class KycEscalateComponent implements OnInit, OnChanges {
  
  @Input() customerGuid: string;
  @Input() customerName: string;
  @Input() kycRequest: any;

  escalationReason: string;
  
  busyEscalateKyc: Subscription;

  constructor(private kycService:KycService,
              private notificationService:NotificationService) { 
  }

  ngOnChanges(changes: SimpleChanges) {
    this.escalationReason = this.kycRequest.EscalationReason;
  }

  ngOnInit() {
    this.escalationReason = this.kycRequest.EscalationReason;
  }

  showEscalateKycModal():void {
    $("#EscalateKycModal").modal('show');
  }

  hideEscalateKycModal():void {
    $("#EscalateKycModal").modal('hide');
  }


escalateCustomersKyc(isEscalated: boolean) {

   this.kycRequest.IsEscalated = isEscalated;
    if(!isEscalated)
    {
      this.escalationReason ="";
    }

    this.busyEscalateKyc = this.kycService.escalateCustomersKyc(
      { CustomerGuid: this.customerGuid,
        IsEscalated: this.kycRequest.IsEscalated,
        EscalationReason: this.escalationReason
       }).subscribe(
        data => {
          this.notificationService.success("Customer Escalation updated successfully.");              
           this.kycRequest.EscalationReason = this.escalationReason
           this.kycRequest.IsEscalated = isEscalated
           this.hideEscalateKycModal();
        },
        error => {
          this.notificationService.error("Customer Escalation Failed. " + error.statusText);
            console.log(error);
            this.hideEscalateKycModal();
        }
    );
  }

  isReasonProvided(): boolean{
    if(!this.escalationReason)
        return false;
    else
        return true;
    }
  
}
