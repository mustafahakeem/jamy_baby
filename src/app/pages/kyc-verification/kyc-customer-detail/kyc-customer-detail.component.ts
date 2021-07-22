import { Component, OnInit } from '@angular/core';
import { CustomerService } from '../../../dal/customer.service';
import { Subscription, Observable } from 'rxjs';
import { AnxKyc, NidaKyc, ThirdPartyKyc, KycDetail, KycType, CustomerProfile, KycRequest, ReviewKycCommand, CustomerSearchKyc } from '../../../models/Customer';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { NotificationService } from '../../../services/notification.service';
import { SessionStorageService } from '../../../services/sessionStorage.service';
import { KycService } from '../../../services/kyc.service';
import { StaticDataService } from '../../../services/static.data.service';

@Component({
  providers: [CustomerService, KycService],
  selector: 'app-kyc-customer-detail',
  templateUrl: './kyc-customer-detail.component.html',
  styleUrls: ['./kyc-customer-detail.component.css']
})
export class KycCustomerDetailComponent implements OnInit {
  busy: Subscription;
  customerGuid: string;
  customerAnxKyc: AnxKyc;
  customerNidaKyc: NidaKyc;
  customerThirdPartyKyc: ThirdPartyKyc;
  customerKycDetail: KycDetail;
  customerDetail: CustomerProfile;
  showKyc: boolean;
  isValidUser: boolean;
  kycDetail: any;
  kycRequest: KycRequest;
  countryId: number;
  autoNext: boolean;
  currentCustomer: string;
  pageNumber: number;
  field: string;
  dir: string;
  KycTriedCount: number;
  isLastCustomer: boolean;
  pageSize: number;
  glyphiconHolder: {};
  sanctionedItemCount: any = null;
  isReloaded: boolean = false;
  needShowAuditHistory: boolean = true;
  needShowAccountList: boolean = false;
  needShowSms: boolean = false;
  modalId: string = 'kyc_rejection_modal_id';
  kycCustomerDetail: CustomerProfile;
  isEscalated: boolean;

  constructor(private customerService: CustomerService,
    private activatedRoute: ActivatedRoute,
    private notificationService: NotificationService,
    public router: Router,
    private sessionStorageService: SessionStorageService,
    private kycSrevice: KycService,
    private staticDataService: StaticDataService) { }

  jamesVerify(customerGuid: string, isApproved: boolean, rejectionReason: string, RejectionReasonId: number): void {
    var command = new ReviewKycCommand();
    command.CustomerGuid = customerGuid;
    command.IsApproved = isApproved;
    command.RejectionReason = rejectionReason;
    command.RejectionReasonId = RejectionReasonId;

    this.busy = this.customerService.verifyJames(command).subscribe(
      data => {
        if (isApproved) this.notificationService.success("Customer approved successfully.", "Customer Approved");
        else this.notificationService.warning("Customer has been rejected.", "Customer Rejected");
        this.customerDetail.KycStatus = 'Approved/Reject';
       
        if (this.autoNext) {
          this.nextCustomer();
        } else {
          var nextcustGuid = this.kycSrevice.getNextItem(this.customerGuid);
          if (nextcustGuid == null) this.gotoListPage();
          else {
            var isLastCust = this.kycSrevice.isLastCustomer(nextcustGuid.Customer.CustomerGuid);
            if (isLastCust) {
              this.checkKycStatus(nextcustGuid.Customer.CustomerGuid);
            }
          }
        }
      },
      errorResponse => {
        //this.notificationService.error(errorResponse.error.Message);
        console.log(errorResponse);
      }
    );
  };

  jamesReject(): void {
    var myDialog = <any>document.getElementById(this.modalId);
    myDialog.showModal();
    return;
  }

  confirmReject(customerGuid: string, rejectionReason: string, rejectionReasonId: number): void {
    this.jamesVerify(customerGuid, false, rejectionReason, rejectionReasonId);
  }

  autoNextSettingChanged(): void {
    this.sessionStorageService.addItem('autoNext', this.autoNext);
  };

  changeGlyphicon = function (panelName: string) {
    this.glyphiconHolder[panelName] = this.glyphiconHolder[panelName] == 'glyphicon-plus' ? 'glyphicon-minus' : 'glyphicon-plus';
  };

  nextCustomer(): void {

    var nextCustomer = this.kycSrevice.getNextItem(this.customerGuid);
    if (nextCustomer == null) this.gotoListPage();
    else {
      this.checkKycStatusAndNextCustomer(nextCustomer.Customer.CustomerGuid);
    }
  };

  checkKycStatusAndNextCustomer(kycCustomerGuid: string) {
    this.busy = this.customerService.getCustomerDetail(kycCustomerGuid).subscribe(
      data => {
        this.kycCustomerDetail = data;
        if (this.kycCustomerDetail.KycStatus == "Unverified") {
          this.customerGuid = kycCustomerGuid;
          this.nextCustomer();
        }
        else {
          this.goToCustomer(kycCustomerGuid);
        }
      },
      error => {
        console.log(error);
      });
  }

  checkKycStatus(kycCustomerGuid: string) {
    this.busy = this.customerService.getCustomerDetail(kycCustomerGuid).subscribe(
      data => {
        if (data.KycStatus == "Unverified") {
          this.isLastCustomer = true;
        }

      },
      error => {
        console.log(error);
      });
  }
  formatDetail(data: any): void {
    this.kycDetail = data.KycDetail;
    this.customerDetail = data.Customer;
    this.kycRequest = data.KycRequest;
    this.KycTriedCount = data.KycTriedCount;
    this.formatCustomer();
    this.staticDataService.getCountryDict().subscribe(data => {
      this.customerDetail.CountryName = data[this.customerDetail.CountryId].Name;
    });
    this.staticDataService.getCurrencyDict().subscribe(data => {
      this.customerDetail.CurrencyIsoCode = data[this.customerDetail.CurrencyId].IsoCode;
    });
  };

  getKeycDetailById(customerGuid: string) {
    var detail = this.kycSrevice.getKycDetails(customerGuid);
    this.isLastCustomer = this.kycSrevice.isLastCustomer(this.customerGuid);
    this.formatDetail(detail);
  };

  goToCustomer(customerGuid: string) {

    this.router.navigate(['/kyc-customer-detail'], {
      queryParams: {
        customerguid: customerGuid,
        pageNumber: this.pageNumber,
        countryId: this.countryId,
        pageSize: this.pageSize
      }
    });
  };

  gotoListPage() {
    this.router.navigate(['/customer-verification-list'], {
      queryParams: {
        page: this.pageNumber,
        countryId: this.countryId,
        pageSize: this.pageSize
      }
    })
  };

  ngOnInit() {
    this.customerDetail = new CustomerProfile();
    this.customerAnxKyc = null;
    this.customerThirdPartyKyc = null;
    this.customerNidaKyc = null;
    this.showKyc = true;
    this.kycDetail = null;
    this.kycRequest = null;
    this.autoNext = this.sessionStorageService.getItem('autoNext') ? true : false;
    this.currentCustomer = "CURRENT_CUSTOMER";
    this.isLastCustomer = false;
    this.glyphiconHolder = {
      glyphiconCustomer: 'glyphicon-plus',
      glyphiconKyc: 'glyphicon-plus',
      glyphiconAudit: 'glyphicon-minus',
      glyphiconSms: 'glyphicon-plus',
      glyphiconAccountList: 'glyphicon-plus'
    }
    this.activatedRoute.queryParams.subscribe(params => {
      this.customerGuid = params['customerguid'];
      this.countryId = !!params['countryId'] ? +params['countryId'] : undefined;
      this.pageNumber = !!params['pageNumber'] ? +params['pageNumber'] : undefined;
      this.pageSize = !!params['pageSize'] ? +params['pageSize'] : 10;
      this.isEscalated = params['isEscalated'];

      this.glyphiconHolder['glyphiconAudit'] = 'glyphicon-minus';
      this.glyphiconHolder['glyphiconSms'] = 'glyphicon-plus';
      this.glyphiconHolder['glyphiconAccountList'] = 'glyphicon-plus';

      if (this.kycSrevice.hasItem(this.customerGuid)) {
        this.getKeycDetailById(this.customerGuid);
      } else {
        this.loadKycDetailList(this.pageNumber).then(res => {
          this.getKeycDetailById(this.customerGuid);
        });
      }

      this.loadSanctionListCount(this.customerGuid);

      this.isReloaded = true;
      setTimeout(() => {
        this.isReloaded = false;
        this.needShowAuditHistory = true;
        this.needShowAccountList = false;
        this.needShowSms = false;
        this.resetIcons();
      }, 100);

    })
  }

  resetIcons() {

  }

  loadSanctionListCount(customerGuid) {
    this.kycSrevice.loadSanctionListCount(customerGuid).subscribe(
      data => {
        this.sanctionedItemCount = data['sanctionCount'];
      })
  }

  loadKycDetailList(pageNumber) {
    var search = new CustomerSearchKyc();
    search.countryId = this.countryId;
    search.page = this.pageNumber;
    search.pageSize = this.pageSize;
    search.isEscalated = this.isEscalated;
    return this.kycSrevice.loadKycDetailList(search);
  };

  formatCustomer() {
    if (!this.customerDetail.Picture) {
      this.customerDetail.Picture = '/public/assets/img/avatar.png';
    }
  }

}
