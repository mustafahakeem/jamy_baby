import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { Router, Routes, ActivatedRoute } from '@angular/router';
import { CustomerService } from '../../../dal/customer.service';
import {
    CustomerAccount, AnxKyc, PasswordResetRequest
}
    from '../../../models/Customer';
import { DepositService } from '../../../dal/deposit.service';
import { Subscription } from 'rxjs';
import { SmsListComponent } from '../../sms-list/sms-list.component';
import { StaticDataService } from '../../../services/static.data.service';
import { NotificationService } from '../../../services/notification.service';
import { FeedbackTextBoxComponent } from '../../../widgets/user-interactions/feedback-text-box/feedback-text-box.component';
import { MatDialog } from '@angular/material';
import { InteractionBoxData } from 'app/models/UserInteractions';
import { AgentService } from 'app/dal/agent.service';
import { AgentProfile } from 'app/models/agent';
import { AuthService } from 'app/services/auth.service'

@Component({
    providers: [CustomerService, DepositService, AgentService],
    selector: 'agent-details',
    templateUrl: './agent-details.component.html',
    styleUrls: ['./agent-details.component.css']
})
export class AgentDetailsComponent implements OnInit {
    @ViewChild('smsListComponenet') vc2: SmsListComponent;
    busy: Subscription;
    customerGuid: string;
    agentNumber: number;
    error: any;
    agentDetail: AgentProfile;
    isValidUser = true;
    customerAccounts: CustomerAccount[] = [];
    customerAnxKyc: AnxKyc;
    anxBalance: any = 'not loaded';
    customerAccount: CustomerAccount = new CustomerAccount();
    showSmsList = false;
    isSupervisor = false;
    isKycManager = false;
    isKycProcessor = false;
    kycTierList: any = [];
    selectedKycTier: number;
    modalId: string = 'james-agent-review-supervisor';
    PinResetRequest:PasswordResetRequest;
    additionalKycFileCount : string = "";

    columns: any[] = [
        { label: 'AccountId', name: 'AccountId' },
        { label: 'AccountType', name: 'AccountType' },
        { label: 'Currnecy', name: 'Currnecy' },
        { label: 'Subaccount address', name: 'SubAccountAddress' },
        { label: 'Local balance', name: 'LocalBalance' },
        { label: 'AnX balance', name: 'AnXbalance' },
        { label: 'Transaction details', name: 'TransactionDetails' }
    ];

    constructor(public customerService: CustomerService,
        private activatedRoute: ActivatedRoute,
        public router: Router,
        private staticDataService: StaticDataService,
        private notificationService: NotificationService,
        private authService: AuthService,
        private dialog: MatDialog,
        private agentService: AgentService) {            
    }


    ngOnInit() {
        this.activatedRoute.params.subscribe(params => {
            this.agentNumber = params.agentNumber;
            this.agentDetail = new AgentProfile();
            this.isValidUser = true;
            this.customerAccount.AccountId = null;
            this.customerAnxKyc = null;
            this.isKycManager = this.authService.isUserHasInPermissionGroup("KycManager");
            this.isSupervisor = this.isKycManager || this.authService.isUserHasInPermissionGroup("KycSupervisor");
            this.isKycProcessor = this.isSupervisor || this.authService.isUserHasInPermissionGroup("KycProcessor");
            console.log(`KycSupervisor:${this.isSupervisor} KycManager:${this.isKycManager} KycProcessor:${this.isKycProcessor}`);
            this.getAgentDetails();
        });
    }
    
    getAgentDetails():void{
        this.busy = this.agentService.getAgentDetail(this.agentNumber).subscribe(
            data => {
                    this.agentDetail = data;
                    this.customerGuid = data.CustomerGuid;
                    if (!this.agentDetail.Picture || this.agentDetail.Picture == "") {
                        this.agentDetail.Picture = '/public/assets/img/avatar.png';
                    }

                //Get customer password reset requests
                this.getCustomerPasswordRequests();

                this.staticDataService.getCurrencyDict().subscribe(
                    data => {
                        this.agentDetail.CurrencyIsoCode = data[this.agentDetail.CurrencyId] ? data[this.agentDetail.CurrencyId].IsoCode : null;
                    },
                    error => {
                        console.log(error);
                    }
                );
                this.staticDataService.getCountryDict().subscribe(
                    dict => {
                        this.agentDetail.CountryName = dict[this.agentDetail.CountryId].Name;
                    },
                    error => {
                        console.log(error);
                    }
                );
                console.log(this.agentDetail);
                this.isValidUser = true;

                this.getKycTierList();
            },
            error => {
                this.isValidUser = false;
                this.agentDetail = new AgentProfile();
                console.log(error);
            }
        );
    }

    getKycTierList() {
        // load the KycTierList only for kyc supervisor or kycManager
        if (this.isSupervisor == true) {
            this.customerService.getKycTierList().subscribe(
                data => {
                    this.kycTierList = data;

                    // set the initial value of select KycTier
                    for (let kycTier of this.kycTierList) {
                        if (kycTier.KycTierName == this.agentDetail.KycTier) {
                            this.selectedKycTier = kycTier.KycTierId;
                            break;
                        }
                    }
                },
                error => {
                    console.log(error);
                    this.error = error;
                }
            );
        }
    }

    getCustomerPasswordRequests() {
        this.busy = this.customerService.getCustomerPasswordRequests(this.customerGuid).subscribe(
            data => {
                if(data && data.length>1){
                    if(data[0]){
                        this.PinResetRequest=data[0];
                    }
                }
            },
            error => {
                this.error = error;
            }
        );
    };

    getCustomerAccounts() {
        this.busy = this.customerService.getCustomerAccounts(this.customerGuid).subscribe(
            data => {
                console.log(data);
                this.customerAccounts = data;
            },
            error => {
                console.log(error);
            }
        );
    };

    getAnxBalance() {
        this.busy = this.customerService.getCustomerBalanceByCustomerId(this.customerGuid).subscribe(
            data => {
                console.log(data);

                for (let i = 0; i < this.customerAccounts.length; i++) {
                    for (let j = 0; j < data.length; j++) {
                        if (data[j].AccountId == this.customerAccounts[i].AccountId) this.customerAccounts[i].AnxBalance = data[j].Balance;
                    }
                }
            },
            error => {
                console.log(error);
            }
        );
    };

    showSms() {
        this.showSmsList = !this.showSmsList;
    }

    lockCustomer() {

        let configData : InteractionBoxData = { 
            Title : "Provide a reason", 
            Message : "Please specify why you want to lock this agent" 
        }; 
        const dialogRef = this.dialog.open(FeedbackTextBoxComponent, { width: '500px', data: configData });

        dialogRef.afterClosed().subscribe(result => {
            if(result) {
                console.log("Yes option chosen. response is " + result)
                this.busy = this.customerService.lockCustomer({ customerGuid: this.customerGuid, reason: result })
                .subscribe(
                    data => {
                        this.ngOnInit();
                    },
                    error => {
                        console.log(error);
                        this.error = error;
                    }
                );
            }
        });
        
    }

    approvePasswordResetRequest(PasswordResetRequest) {
        var customerPasswordApprovalCommand = {
            CustomerPasswordResetApprovalGuid: PasswordResetRequest.CustomerPasswordResetApprovalGuid,
            CustomerPasswordResetTypeId: PasswordResetRequest.CustomerPasswordResetTypeId,
            CustomerPasswordResetStatus: 1 //approved=1, rejected=2
        };
        this.passwordResetRequest(customerPasswordApprovalCommand);
    }

    rejectPasswordResetRequest(PasswordResetRequest) {
        var customerPasswordApprovalCommand = {
            CustomerPasswordResetApprovalGuid: PasswordResetRequest.CustomerPasswordResetApprovalGuid,
            CustomerPasswordResetTypeId: PasswordResetRequest.CustomerPasswordResetTypeId,
            CustomerPasswordResetStatus: 2 //approved=1, rejected=2
        };
        this.passwordResetRequest(customerPasswordApprovalCommand);
    }

    private passwordResetRequest(customerPasswordApprovalCommand: {
        CustomerPasswordResetApprovalGuid: any; 
        CustomerPasswordResetTypeId: any; 
        CustomerPasswordResetStatus: number;
        }) {
        this.busy = this.customerService.approvePasswordResetRequest(customerPasswordApprovalCommand)
            .subscribe(data => {
                this.getCustomerPasswordRequests();
                var message = 'Customer request has been ' + (customerPasswordApprovalCommand.CustomerPasswordResetStatus == 1 ? 'approved' : 'rejected') + ' successfully.';
                this.notificationService.success(message, 'Successfull')
            }, error => {
                console.log(error);
                this.error = error;
            });
    }

    unLockCustomer() {

        var configData : InteractionBoxData = { 
            Title : "Provide a reason", 
            Message : "Please specify why you want to unlock this agent" 
        }; 
        const dialogRef = this.dialog.open(FeedbackTextBoxComponent, { width: '500px', data: configData });

        dialogRef.afterClosed().subscribe(result => {
            
            if(result){                
                this.busy = this.customerService.unLockCustomer({ customerGuid: this.customerGuid, reason: result })
                .subscribe(
                    data => {
                        this.ngOnInit();
                    },
                    error => {
                        console.log(error);
                        this.error = error;
                    }
                );
            }
         });

        
    }

    updateKycTier(kycTier: number) {
        var savedKycTier = this.agentDetail.KycTier;
        this.agentDetail.KycTier = this.kycTierList.find(k => k.KycTierId == kycTier).KycTierName;
        this.busy = this.customerService.updateKycTier({ customerGuid: this.customerGuid, kycTierId: kycTier })
            .subscribe(
                data => {
                    console.log("KycTier updated successfully.");
                    this.notificationService.success("KycTier updated successfully");
                },
                error => {
                    this.agentDetail.KycTier = savedKycTier;
                    console.log(error);
                    this.error = error;
                }
            );
    }

    trackByIdx(index: number, obj: any): any {
        return index;
    }
}
