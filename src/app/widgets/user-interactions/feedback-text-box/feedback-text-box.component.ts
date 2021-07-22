import { Component, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { InteractionBoxData } from 'app/models/UserInteractions';

@Component({
    templateUrl: './feedback-text-box.component.html',
    styleUrls: ['./feedback-text-box.component.css']
})
export class FeedbackTextBoxComponent {

    feedback : string = "";

    constructor(public dialogRef: MatDialogRef<FeedbackTextBoxComponent>, 
        @Inject(MAT_DIALOG_DATA) public data : InteractionBoxData){           
        }

    onCloseClick(): void {
        this.dialogRef.close();
    }

    onSubmitClick(): void {
        this.dialogRef.close(this.feedback);
    }
}