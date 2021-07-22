import { Component, OnInit, Input } from "@angular/core";
import { FinanceRelocation, FinanceRelocationLookupResult, FinanceRelocationConfirmationData, WalletShortView } from "../../models/deposit";

@Component({
  selector: "app-relocation-confirmation-modal",
  templateUrl: "./relocation-confirmation-modal.component.html"
})
export class RelocationConfirmationModalComponent implements OnInit {
  @Input() callBackFn: (command: FinanceRelocation) => string;
  @Input() modalId: string;
  @Input() command: FinanceRelocation;
  @Input() lookup: FinanceRelocationConfirmationData;
  private confirmationData: FinanceRelocationConfirmationData = new FinanceRelocationConfirmationData();
  constructor() {}

  ngOnInit() {
  }
  closeMyDialog() {
    let myDialog: any = <any>document.getElementById(this.modalId);
    myDialog.close();
  }

  onConfirmation() {
    this.closeMyDialog();
    this.callBackFn(this.command);
  }
}
