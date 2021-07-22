import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-transaction-info',
  templateUrl: './transaction-info.component.html',
  styleUrls: ['./transaction-info.component.css']
})
export class TransactionInfoComponent implements OnInit {
  @Input() modalId:string;
  @Input() transactionInfoDetails:any=[];
  constructor() { }

  ngOnInit() {
  }
  
  closeMyDialog() {
    let myDialog: any = <any>document.getElementById(this.modalId);
    myDialog.close();
  }
}
