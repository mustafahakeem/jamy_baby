import { Component, OnInit, Input } from "@angular/core";
import { CustomerService } from "../../dal/customer.service";
import { NotificationService } from "../../services/notification.service";
import { Subscription } from "rxjs";
import { KycRequestResponseView } from "app/models/Customer";

@Component({
  providers: [CustomerService],
  selector: "app-kyc-request-response-table",
  templateUrl: "./kyc-request-response.component.html",
  styleUrls: ["./kyc-request-response.component.css"],
})
export class KycRequestResponseComponent implements OnInit {
  @Input() customerGuid: string;

  showTable: boolean = false;
  kycRequestResponseViews: Array<KycRequestResponseView>;
  busy: Subscription;

  tableConfig = [
    { label: "Date", name: "CreateDate" },
    { label: "NIDA Status", name: "KycProcessingStatus" },
    { label: "JamesStatus", name: "JamesProcessingStatus" },
  ];

  constructor(
    public customerService: CustomerService,
    private notificationService: NotificationService
  ) {}

  ngOnInit() {}

  fetchKycRequestResponses(): void {
    this.busy = this.customerService
      .getKycResuestResponses(this.customerGuid)
      .subscribe(
        (resp: any) => (this.kycRequestResponseViews = resp.Data),
        (error) => {
          console.log(error);
        }
      );
  }

  toggleTableVisiblity(): void {
    this.showTable = !this.showTable;
    if (this.showTable) {
      this.fetchKycRequestResponses();
    }
  }
}
