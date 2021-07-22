import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-customer-loan-details-modal',
  templateUrl: './customer-loan-details-modal.component.html',
  styleUrls:['customer-loan-details-modal.component.css']
})
export class CustomerLoanDetailsModalComponent implements OnInit {

  @Input() modalId:string;
  @Input() command:any;
  constructor() { }

  ngOnInit() {
  }

  closeMyDialog() {
    let myDialog: any = <any>document.getElementById(this.modalId);
    myDialog.close();
  }
}
