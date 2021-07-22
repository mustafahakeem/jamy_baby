import { Component, OnInit, Input } from '@angular/core';
import * as $ from 'jquery';

@Component({
  selector: 'app-image-modal',
  templateUrl: './image-modal.component.html',
  styleUrls: ['./image-modal.component.css']
})
export class ImageModalComponent implements OnInit {
  @Input() imageUrl: string;
  @Input() header: string;
  @Input() modalId: string;
  @Input() kycRequest: any;

  imageIndex: number =0;
  constructor() { }

  public degAmount: number = 0;

  ngOnInit() {
    if(this.kycRequest && this.kycRequest.length)
    {
      //set default image index oninit
      this.imageIndex = this.kycRequest.findIndex(x=>x.id.toUpperCase()==this.modalId.toUpperCase());
    }
  }

  changeImage(index:number)
  {
    let newIndex = this.imageIndex+index;
    if(newIndex >= this.kycRequest.length)
    {
      //last image
    }
    else if(newIndex < 0)
    {
      //first image
    }
    else
    {
      //change image
      this.imageUrl = this.kycRequest[newIndex].url;
      this.header = this.kycRequest[newIndex].header;
      this.imageIndex = newIndex;
      this.degAmount = 0;
    }
  }
  
  ngOnChanges(){
    this.degAmount = 0;
  }
  
  openMyModal() {
    var elem = $('#' + this.modalId);
    elem.show();
  }

  rotateImage() {
    this.degAmount = (this.degAmount + 90) % 360;
  }

  closeMyModal() {
    if(this.kycRequest && this.kycRequest.length)
    {
      //set default image index on poup close.
      this.imageIndex = this.kycRequest.findIndex(x=>x.id.toUpperCase()==this.modalId.toUpperCase());
      this.imageUrl = this.kycRequest[this.imageIndex].url;
      this.header = this.kycRequest[this.imageIndex].header;
    }
    var elem = $('#' + this.modalId);
    elem.hide();
  }
  
  generateUUID(): string {
    var d = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = (d + Math.random() * 16) % 16 | 0;
      d = Math.floor(d / 16);
      return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
    return uuid;
  };
}
