import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { error } from 'console';
import { Subscription } from 'rxjs';
import { LendingService } from '../../../dal/lending.service';
import { LoanApplicationCommand, LoanApplicationQueryRequest } from '../../../models/lending';
import { NotificationService } from '../../../services/notification.service';

@Component({
  selector: 'app-loan-application-details',
  templateUrl: './loan-application-details.component.html',
  styleUrls: ['./loan-application-details.component.css']
})
export class LoanApplicationDetailsComponent implements OnInit {

  busy: Subscription;
  details: any;
  loanApplicationGuid: string;
  customerGuid: string;
  pageNumber: number;
  pageSize: number;
  isLastLoanApplication: boolean;

  loanApplicationCommand: LoanApplicationCommand = new LoanApplicationCommand();
  constructor(
    private activatedRoute: ActivatedRoute,
    private lendingService: LendingService,
    public router: Router,
    private notificationService: NotificationService
  ) { }

  ngOnInit() {
    this.isLastLoanApplication = false;
    this.activatedRoute.queryParams.subscribe(params => {
      this.loanApplicationGuid = params['loanapplicationguid'];
      this.customerGuid = params['customerguid'];
      this.pageNumber = !!params['pageNumber'] ? +params['pageNumber'] : undefined;
      this.pageSize = !!params['pageSize'] ? +params['pageSize'] : 10;


      // if (this.lendingService.hasItem(this.loanApplicationGuid)) {
      //   this.getLoanApplicationDetailById(this.loanApplicationGuid);
      // } else {
      //   this.loadLoanApplicationDetailList(this.pageNumber).then(res => {
      //     this.getLoanApplicationDetailById(this.loanApplicationGuid);
      //   });
      // }

      this.busy = this.lendingService.getLoanApplicationByGuid(this.loanApplicationGuid, this.customerGuid).subscribe(
        data => {
          console.log(data);
          this.details = data;
        }
      )
    });
  }

  ApproveLoanApplication() {
    this.loanApplicationCommand.LoanApplicationGuid = this.loanApplicationGuid;
    this.loanApplicationCommand.CustomerGuid = this.customerGuid;
    this.busy = this.lendingService.ApproveLoanApplication(this.loanApplicationCommand)
      .subscribe(data => {
        this.notificationService.success("Loan Application approved successfully.", "Loan Application Approved");
        this.gotoListPage();
      },
        error => {
          if (error.status === 401 || error.status === 403) { }
          console.log(error);
          this.gotoListPage();
        });
  }

  RejectLoanApplication() {
    this.loanApplicationCommand.LoanApplicationGuid = this.loanApplicationGuid;
    this.loanApplicationCommand.CustomerGuid = this.customerGuid;
    this.busy = this.lendingService.RejectLoanApplication(this.loanApplicationCommand)
      .subscribe(data => {
        this.notificationService.warning("Loan Application has been rejected.", "Loan Application Rejected");
        this.gotoListPage();
      },
        error => {
          if (error.status === 401 || error.status === 403) { }
          console.log(error);
        });
  }

  // loadLoanApplicationDetailList(pageNumber) {
  //   var search = new LoanApplicationQueryRequest();
  //   search.page = this.pageNumber;
  //   search.pageSize = this.pageSize;
  //   return this.lendingService.loadLoanApplicationDetailList(search);
  // };

  // getLoanApplicationDetailById(loanApplicationGuid: string) {
  //   var detail = this.lendingService.getLoanApplicationDetails(loanApplicationGuid);
  //   this.isLastLoanApplication=this.lendingService.isLastLoanApplication(loanApplicationGuid);
  //   this.formatDetail(detail);
  // };

  // formatDetail(data: any): void {
  //   this.details = data;
  //   this.customerGuid = this.details.CustomerGuid;
  // }

  // nextLoanApplication(): void {

  //   var nextLoanApplication = this.lendingService.getNextItem(this.loanApplicationGuid);
  //   if (nextLoanApplication == null) this.gotoListPage();
  //   else {
  //     this.goToLoanApplication(nextLoanApplication.LoanApplicationGuid);
  //   }
  // };

  gotoListPage() {
    this.router.navigate(['/loan-application-list'], {
      queryParams: {
        page: this.pageNumber,
        pageSize: this.pageSize
      }
    })
  };

  // goToLoanApplication(loanApplicationGuid: string) {

  //   this.router.navigate(['/kyc-customer-detail'], {
  //     queryParams: {
  //       loanapplicationguid: loanApplicationGuid,
  //       pageNumber: this.pageNumber,
  //       pageSize: this.pageSize
  //     }
  //   });
  // };

}
