import { Component, OnInit, Input } from '@angular/core';
import { Subscription } from 'rxjs';
import { KycService } from '../../services/kyc.service';
import * as $ from 'jquery';

@Component({
  selector: 'app-rejection-reason-modal',
  templateUrl: './rejection-reason-modal.component.html',
  providers: [KycService]
})
export class RejectionReasonModalComponent implements OnInit {
  @Input() callBackFn: (customerGuid: string, rejectionReason: string, rejectionReasonId: number) => string;
  @Input() modalId: string;
  @Input() customerGuid: string;
  reasons: any[];
  itemToSave: any;
  errorText: string;
  otherReason: string;
  busy: Subscription;

  constructor(private kycSrevice: KycService) { };

  selectItem(selectedItem) {

    this.itemToSave = selectedItem;

    selectedItem.status = !selectedItem.status;

    if (!selectedItem.status) {
      this.itemToSave = { Reason: '' };
    }
    this.errorText = '';
    this.reasons.forEach(category => {
      category.items.forEach(item => {
        if (selectedItem.Reason !== item.Reason) item.status = false;
      });
    })
  }

  ngOnInit() {
    this.itemToSave = { Reason: '' };
    this.reasons = [];
    this.otherReason = '';
    this.errorText = '';

    this.busy = this.kycSrevice.getRejectionReasons().subscribe(
      data => {

        var groups = this.groupBy(data, r => r.Category);

        groups.forEach((value: any[], key: string) => {
          var rr = {
            category: key,
            items: value
          }
          this.reasons.push(rr);
        });
      },
      errorResponse => {
        //this.notificationService.error(errorResponse.error.Message);
        console.log(errorResponse);
      }
    );

  }

  SaveSelection() {

    if (this.itemToSave.Reason.length == 0) {
      this.errorText = 'Please select one of reasons from above to reject customer';
      return;
    }

    if (this.itemToSave.Reason == 'Other' && this.otherReason.length == 0) {
      this.errorText = 'Please write reason to reject customer';
      return;
    }

    if (this.itemToSave.Reason == 'Other' && this.otherReason.length > 400) {
      this.errorText = 'Description is too long to save.';
      return;
    }

    var description = this.itemToSave.Reason;
    if (this.itemToSave.Reason == 'Other') description = this.itemToSave.Reason + " - " + this.otherReason;
    this.callBackFn(this.customerGuid, description, this.itemToSave.Id);

    $("#myModal .close").click();
  }

  groupBy(list, keyGetter) {
    const map = new Map();
    list.forEach((item) => {
      const key = keyGetter(item);
      const collection = map.get(key);
      if (!collection) {
        map.set(key, [item]);
      } else {
        collection.push(item);
      }
    });
    return map;
  }
}
