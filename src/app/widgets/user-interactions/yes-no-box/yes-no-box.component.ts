import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
    templateUrl: './yes-no-box.component.html'
})
export class YesNoBoxComponent {

    constructor(public dialogRef: MatDialogRef<YesNoBoxComponent>,
        @Inject(MAT_DIALOG_DATA) public message : string) {
    }

    onNoClick(): void{
        this.dialogRef.close(false);
    }

    onYesClick(): void {
        this.dialogRef.close(true);
    }

}