import { Component, Input, OnChanges, Output, EventEmitter } from "@angular/core";
import { PersonalDetails } from "../../models/Customer";

@Component({
    selector: "customer-name-change-modal",
    templateUrl: "./customer-name-change-component.html"
})

export class CustomerNameChangeComponent implements OnChanges {
    @Input() modalId: string;
    @Input() personalDetails: PersonalDetails;
    @Output() updateName: EventEmitter<any> = new EventEmitter<any>();

    nameChanged: boolean;
    validationError: boolean;
    oldValues: PersonalDetails;

    constructor() {
        this.nameChanged = false;
    }

    ngOnChanges(){
        if(this.personalDetails) {
            this.oldValues = this.personalDetails.getCopy();
        }
    }

    cancelAndClose() {
        this.discardChanges();
        this.closeMyDialog();
    }

    discardChanges() {
        this.personalDetails = this.oldValues.getCopy();;
        this.nameChanged = false;
    }

    closeMyDialog() {
        let myDialog: any = <any>document.getElementById(this.modalId);
        myDialog.close();
    }
    
    updateAskConfirm() {
        var oldName = this.oldValues.getFullName();
        var newName = this.personalDetails.getFullName();
        this.nameChanged = oldName != newName;
    }

    isValid(): boolean {
        if(this.personalDetails && this.personalDetails.FirstName && this.personalDetails.LastName)
            return this.personalDetails.FirstName.trim() != '' && this.personalDetails.LastName.trim() != '';
        return false;
    }

    changeName(){
        var nameChange = { oldValue: this.oldValues, newValue: this.personalDetails }
        this.updateName.emit(nameChange);
        this.nameChanged = false;
        this.oldValues = this.personalDetails.getCopy();
        this.closeMyDialog();
    }

    

}