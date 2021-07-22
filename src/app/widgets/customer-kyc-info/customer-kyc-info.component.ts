import { Component, OnInit, Input } from '@angular/core';
import { AnxKyc, NidaKyc, ThirdPartyKyc, KycDetail, KycType } from '../../models/Customer';
import { CustomerService } from '../../dal/customer.service';

@Component({
  selector: 'app-customer-kyc-info',
  templateUrl: './customer-kyc-info.component.html',
  styleUrls: ['./customer-kyc-info.component.css']
})
export class CustomerKycInfoComponent implements OnInit {
  @Input() kycDetail: any;

  ngOnInit() {
  }
}
