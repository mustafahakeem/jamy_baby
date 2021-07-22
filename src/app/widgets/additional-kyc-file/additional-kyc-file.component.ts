import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { CustomerService } from '../../dal/customer.service';
import { NotificationService } from '../../services/notification.service';
import {AdditionalKycFileView, AdditionalKycFileCommand, KycDocumentType } from '../../models/Customer';
import { AuthService } from 'app/services/auth.service';

// This lets me use jquery
declare var $: any;

@Component({
  selector: 'app-additional-kyc-file',
  templateUrl: './additional-kyc-file.component.html'
})
export class AdditionalKycFileComponent implements OnInit {

  @Input() customerGuid: string;
  @Input() customerName: string;
  @Input() customerType: number = 1;
  @Input() fileCount: string = "";
  @Output() isfileCountChange = new EventEmitter<string>();
  

  command: AdditionalKycFileCommand
  customerguid : string;
  description : string;
  addedBy: string;
  kycDocumentTypeId: number;
  kycDocumentTypeList: Array<KycDocumentType> = []; 

  @ViewChild('fileInput') 
  myFileInputVariable: ElementRef;

  busyAdditionalKycFile: Subscription;
  busy: Subscription;

  selectedFiles: FileList;
  additionalKycFiles : AdditionalKycFileView [] = [];

  constructor(private customerService: CustomerService,
              private notificationService: NotificationService,
              private authService: AuthService) {
  }

  ngOnInit() {
    this.addedBy = this.authService.getUserName();
    this.getAdditionalKycFiles(this.customerGuid);
    this.busy = this.customerService.getKycDocumentTypeList().subscribe(
      data => {
          this.kycDocumentTypeList = data;
      },
      error => {
          this.kycDocumentTypeList =[];
          console.log(error);
      }
    );
  }


  hideAdditionalFilesModal(): void {
    $("#AdditionalKycFileModal").modal('hide');
  }

  selectFiles(event) {
    this.selectedFiles = event.target.files;
  }

  uploadAdditionalKycFile() {

    this.command = new AdditionalKycFileCommand();
    this.command.CustomerGuid = this.customerGuid;
    this.command.Description = this.description;
    this.command.UploadedBy = this.addedBy;
    this.command.KycDocumentTypeId = this.kycDocumentTypeId;

    this.busyAdditionalKycFile = this.customerService.uploadAdditionalKycFile(this.command, this.selectedFiles)
    .subscribe( data => {
        if(data)
        {
            this.notificationService.success("Files Uploaded successfully.");
            this.getAdditionalKycFiles(this.customerGuid);
        }
      },
      error => {
        this.notificationService.error("Could not upload the files." + error);
      });

      this.description = "";
      this.myFileInputVariable.nativeElement.value = "";
      this.kycDocumentTypeId = null;
  }

  getAdditionalKycFiles(customerGuid: string) {
    this.busyAdditionalKycFile = this.customerService.getAdditionalKycFiles(customerGuid)
    .subscribe(
        data => {  
          this.additionalKycFiles = data;
          if(this.additionalKycFiles.length > 0)
          {
            this.fileCount = "(" + this.additionalKycFiles.length.toString() + ")";
            this.isfileCountChange.emit(this.fileCount);
          }
        },
        error => {
          this.notificationService.error("Additional Kyc File details could not be retrieved");
            console.log(error);
        }
    );
  }
}
