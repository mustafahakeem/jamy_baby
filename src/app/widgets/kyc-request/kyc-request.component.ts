import { Component, OnInit, Input } from '@angular/core';
import { CustomerService } from '../../dal/customer.service';
import { KycSwapImageCommand } from '../../models/Customer';
import { NotificationService } from '../../services/notification.service';

@Component({
  providers: [CustomerService],
  selector: 'app-kyc-request',
  templateUrl: './kyc-request.component.html',
  styleUrls: ['./kyc-request.component.css']
})
export class KycRequestComponent implements OnInit {

  @Input() kycRequest: any
  //add array for kyc image list for modal popup 
  kycImages = [];
  constructor(
    public customerService: CustomerService,
    private notificationService: NotificationService) {

  }

  ngOnInit() {
    this.getKycImageList();
  }

  getKycImageList()
  {
    //adding kyc image list for modal popup 
      if(this.kycRequest.IdCardOrPassport && this.kycRequest.IdCardOrPassport.length)
      {
        this.kycImages.push({id:'IdCardOrPassport',header:'Id Number : ' + this.kycRequest.IdNumber,url:this.kycRequest.IdCardOrPassport+this.kycRequest.IdCardOrPassportSas})
      }
      if(this.kycRequest.BackofIdCard && this.kycRequest.BackofIdCard.length)
      {
        this.kycImages.push({id:'BackofIdCard',header:'Id Number : ' + this.kycRequest.IdNumber,url:this.kycRequest.BackofIdCard+this.kycRequest.BackofIdCardSas})
      }
      if(this.kycRequest.ProofOfAddress && this.kycRequest.ProofOfAddress.length)
      {
        this.kycImages.push({id:'ProofOfAddress',header:'Address line 1: ' +this.kycRequest.AddressLine1 + ',\n Address line 2: ' + this.kycRequest.AddressLine2,url:this.kycRequest.ProofOfAddress+this.kycRequest.ProofOfAddressSas})
      }
      if(this.kycRequest.SelfieWithIdPaper && this.kycRequest.SelfieWithIdPaper.length)
      {
        this.kycImages.push({id:'SelfieWithIdPaper',header:'Id Number : ' + this.kycRequest.IdNumber,url:this.kycRequest.SelfieWithIdPaper+this.kycRequest.SelfieWithIdPaperSas})
      }
  }

  allowDrop(ev) {
    ev.preventDefault();
  }

  drag(ev) {
    ev.dataTransfer.setData("text", ev.target.id);
  }

  drop(ev) {
    ev.preventDefault();

    var target = ev.target;

    if (ev.target.nodeName == "IMG") {
      target = ev.target.parentElement;
    }

    var data = ev.dataTransfer.getData("text");
    var draggedItem = document.getElementById(data);
    var oldItem = target.querySelector("img");
    this.swapData(draggedItem, oldItem);
  }

  swapData(item1, item2) {

    var imageForAttributeName = "id";

    var imageFor1 = item1.getAttribute(imageForAttributeName);
    var filePath1 = this.kycRequest[imageFor1];
    var fileSas1 = this.kycRequest[imageFor1 + "Sas"];

    var imageFor2 = item2.getAttribute(imageForAttributeName);
    var filePath2 = this.kycRequest[imageFor2];
    var fileSas2 = this.kycRequest[imageFor2 + "Sas"];

    this.kycRequest[imageFor1] = filePath2;
    this.kycRequest[imageFor1 + "Sas"] = fileSas2;

    this.kycRequest[imageFor2] = filePath1;
    this.kycRequest[imageFor2 + "Sas"] = fileSas1;

    this.updateServerSide(imageFor1, imageFor2);
  }

  updateServerSide(propName1, propName2) {
    var command = new KycSwapImageCommand();
    command.KycRequestGuid = this.kycRequest.KycRequestGuid;
    command.PropertyName1 = propName1;
    command.PropertyName2 = propName2;

     this.customerService.swapImages(command)
      .subscribe(
        data => {
          var message = "Image reference updated successfully."
          console.log(message);
          this.notificationService.success(message);
        },
        error => {
          console.log(error);
        }
      )
  }

}
