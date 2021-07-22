import { Component, Input, OnInit } from "@angular/core";
import { Subscription } from "rxjs";
import { CustomerService } from "../../dal/customer.service";
import { ManualKycCommand } from "../../models/Customer";
import { NotificationService } from "../../services/notification.service";

// This lets me use jquery
declare var $: any;

@Component({
  selector: "manual-kyc-modal",
  templateUrl: "./manual-kyc-modal.component.html",
  styleUrls: ["./manual-kyc-modal.component.css"],
})
export class ManualKycModalComponent implements OnInit {
  @Input() callBackFn: (changeStatus) => void;
  @Input() customerGuid: string;
  @Input() kycStatus: string;
  busyManualKycChange: Subscription;

  selectedKycStatus = 0;
  reason = "";
  kycStatuses = ["", "JamesVerified", "Unverified"];
  manualKycVerificationStep: number = 1; // 1=kyc form, 2=confirmation
  errorBag = {
    selectedKycStatusError: "",
    reasonError: "",
  };

  constructor(
    private customerService: CustomerService,
    private notificationService: NotificationService
  ) {}

  ngOnInit() {}

  onChnage(): void {
    this.errorBag = {
      selectedKycStatusError: "",
      reasonError: "",
    };
  }

  validateForm(): boolean {
    let isValid = true;
    if (this.selectedKycStatus == 0) {
      this.errorBag.selectedKycStatusError = "please select kyc status.";
      isValid = false;
    }
    if (this.reason.length <= 0) {
      this.errorBag.reasonError = "please specify reasons.";
      isValid = false;
    }
    return isValid;
  }

  onUpdate() {
    let command = new ManualKycCommand();
    command.CustomerGuid = this.customerGuid;
    command.IsApproved = this.selectedKycStatus == 1 ? true : false;
    command.Reason = this.reason;
    this.busyManualKycChange = this.customerService
      .changeKycManually(command)
      .subscribe(
        (data) => {
          this.notificationService.success(
            `Kyc status is changed to ${
              command.IsApproved ? "JamesVerified" : "Unverified"
            } Successfully`
          );
          this.hideManualKycModal();
          this.callBackFn(true);
        },
        (error) => {
          console.log(error);
          this.hideManualKycModal();
          this.callBackFn(false);
        }
      );
  }

  onProceed(): void {
    if (this.validateForm()) {
      this.manualKycVerificationStep = 2;
    }
  }
  onBack(): void {
    this.manualKycVerificationStep = 1;
  }

  onCancel(): void {
    this.hideManualKycModal();
  }

  showManualKycModal(): void {
    $("#ManualKycModal").modal("show");
  }

  hideManualKycModal(): void {
    this.manualKycVerificationStep = 1;
    this.selectedKycStatus = 0;
    this.reason = "";
    $("#ManualKycModal").modal("hide");
  }
}
