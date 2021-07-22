import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { Router, Routes, ActivatedRoute } from '@angular/router';
import { CustomerService } from '../../../dal/customer.service';
import {
    CustomerProfile, Business, BusinessCategory, CustomerAccount,
    CustomerSearchView, AnxKyc, ThirdPartyKyc, KycType, NidaKyc, ChangeShopOnlineFlagJamesCommand,
    KycDetail, KycRequest, ReviewKycCommand, RewardModelView, PasswordResetRequest, PersonalDetails
}
    from '../../../models/Customer';
import { DepositService } from '../../../dal/deposit.service';
import { Subscription } from 'rxjs';
import { SmsListComponent } from '../../sms-list/sms-list.component';
import { StaticDataService } from '../../../services/static.data.service';
import { NotificationService } from '../../../services/notification.service';
import { AuthService } from '../../../services/auth.service';
import { PermissionGroup, SpennBusinessUser, SpennBusinessUsers } from '../../../models/SpennBusiness'
import { SpennBusinessService } from '../../../dal/spenn-business.service';
import { YesNoBoxComponent } from '../../../widgets/user-interactions/yes-no-box/yes-no-box.component';
import { FeedbackTextBoxComponent } from '../../../widgets/user-interactions/feedback-text-box/feedback-text-box.component';
import { MatDialog } from '@angular/material';
import { InteractionBoxData } from 'app/models/UserInteractions';
import { KycService } from 'app/services/kyc.service';

@Component({
    providers: [CustomerService, DepositService, SpennBusinessService, KycService],
    selector: 'customer-details',
    templateUrl: './customer-details.component.html',
    styleUrls: ['./customer-details.component.css']
})
export class CustomerDetailsComponent implements OnInit {
    @ViewChild('smsListComponenet') vc2: SmsListComponent;
    busy: Subscription;
    customerGuid: string;
    customerGuidOrRewardCode: string;
    recoveryWords: any;
    error: any;
    customerDetail: CustomerProfile;
    personalDetails: PersonalDetails;
    changeShopOnlineFlagJamesCommand: ChangeShopOnlineFlagJamesCommand;
    isValidUser = true;
    customerAccounts: CustomerAccount[] = [];
    customerAnxKyc: AnxKyc;
    customerNidaKyc: NidaKyc;
    customerThirdPartyKyc: ThirdPartyKyc;
    customerKycDetail: KycDetail;
    kycRequest: KycRequest;
    anxBalance: any = 'not loaded';
    customerAccount: CustomerAccount = new CustomerAccount();
    customerSearchView: CustomerSearchView = new CustomerSearchView();
    showKyc: boolean;
    showSmsList: boolean = false;
    isSupervisor: boolean = false;
    isKycManager: boolean = false;
    isKycProcessor: boolean = false;
    kycTierList: any = [];
    selectedKycTier: number;
    modalId: string = 'james-customer-review-supervisor';
    nameModalId: string = 'change-customer-name-modal';
    businessUsers: SpennBusinessUser[] = [];
    PinResetRequest: PasswordResetRequest;
    SecurityCodeResetRequest: PasswordResetRequest;
    additionalKycFileCount: string = "";

    columns: any[] = [
        { label: 'AccountId', name: 'AccountId' },
        { label: 'AccountType', name: 'AccountType' },
        { label: 'Currnecy', name: 'Currnecy' },
        { label: 'Subaccount address', name: 'SubAccountAddress' },
        { label: 'Local balance', name: 'LocalBalance' },
        { label: 'AnX balance', name: 'AnXbalance' },
        { label: 'Transaction details', name: 'TransactionDetails' }
    ];

    businessUserColumns: any[] = [
        { label: 'Email', name: 'Email' },
        { label: 'TwoFa Phone Number', name: 'PhoneNumber' },
        { label: 'Permissions', name: 'PermissionGroups' },
        { label: 'Reset Password', name: 'ResetPassword' },
        { label: 'Remove user', name: 'RemoveUser' }
    ];

    constructor(public customerService: CustomerService,
        private activatedRoute: ActivatedRoute,
        public router: Router,
        private depositService: DepositService,
        private staticDataService: StaticDataService,
        private notificationService: NotificationService,
        private authService: AuthService,
        private spennBusinessService: SpennBusinessService,
        private dialog: MatDialog) {
    }


    ngOnInit() {
        this.activatedRoute.params.subscribe(params => {
            this.customerGuidOrRewardCode = params.customerguidorrewardcode;
            this.customerDetail = new CustomerProfile();
            this.customerDetail.Business = new Business();
            this.customerDetail.Business.BusinessCategory = new BusinessCategory();
            this.isValidUser = true;
            this.customerAccount.AccountId = null;
            this.customerAnxKyc = null;
            this.customerThirdPartyKyc = null;
            this.customerNidaKyc = null;
            this.kycRequest = null;
            this.showKyc = false;
            this.isKycManager = this.authService.isUserHasInPermissionGroup("KycManager");
            this.isSupervisor = this.isKycManager || this.authService.isUserHasInPermissionGroup("KycSupervisor");
            this.isKycProcessor = this.isSupervisor || this.authService.isUserHasInPermissionGroup("KycProcessor");
            console.log(`KycSupervisor:${this.isSupervisor} KycManager:${this.isKycManager} KycProcessor:${this.isKycProcessor}`);
            this.getCustomerDetails();
        });
    }

    getCustomerDetails(): void {
        this.busy = this.customerService.getCustomerDetail(this.customerGuidOrRewardCode).subscribe(
            data => {

                data.RewardModelViewForProfile = this.rewardModelMapping(data.RewardModelViewForProfile);

                this.customerDetail = data;
                this.personalDetails = this.personalDetailMapping(data);
                this.customerGuid = data.CustomerGuid;
                if (!this.customerDetail.Picture) {
                    this.customerDetail.Picture = '/public/assets/img/avatar.png';
                }
                //this.getCustomerAccounts();

                //Get customer password reset requests
                this.getCustomerPasswordRequests();

                this.staticDataService.getCurrencyDict().subscribe(
                    data => {
                        this.customerDetail.CurrencyIsoCode = data[this.customerDetail.CurrencyId] ? data[this.customerDetail.CurrencyId].IsoCode : null;
                    },
                    error => {
                        console.log(error);
                    }
                );
                this.staticDataService.getCountryDict().subscribe(
                    dict => {
                        this.customerDetail.CountryName = dict[this.customerDetail.CountryId].Name;
                    },
                    error => {
                        console.log(error);
                    }
                );
                console.log(this.customerDetail);
                this.isValidUser = true;

                this.getKycTierList();
                //this.mappRewardModel(this.customerDetail, data);

                this.getBusinessUsers();
            },
            error => {
                this.isValidUser = false;
                this.customerDetail = new CustomerProfile();
                this.customerDetail.Business = new Business();
                this.customerDetail.Business.BusinessCategory = new BusinessCategory();
                console.log(error);
            }
        );
    }

    hasBusinessPermission(): boolean {
        return this.authService.isUserHasInPermissionGroup("SpennBusinessAdministrator");
    }

    resetSpennBusinessCustomerPassword(userGuid, email, phoneNumber) {
        this.busy = this.customerService.resetSpennBusinessUserPassword({ BusinessUserEmail: email, BusinessuserGuid: userGuid, BusinessCustomerGuid: this.customerGuid, BusinessUserPhoneNumber: phoneNumber })
            .subscribe(
                data => {
                    var message = 'New temp password sent on SMS to ' + phoneNumber;
                    this.notificationService.success(message, 'Successful')
                },
                error => {
                    console.log(error);
                    this.error = error;
                }
            );
    }

    removeUserFromSpennBusiness(businessUser: SpennBusinessUser) {
        if(confirm("Are you sure you want to remove this user?")) {
            console.log(`User should be removed: UserGuid: ${businessUser.UserGuid} and BusinessGuid: ${this.customerDetail.CustomerGuid}`);
            var userRemoveRequest = {
                UserGuid: businessUser.UserGuid,
                UserEmail: businessUser.Email,
                BusinessCustomerGuid: this.customerGuid
            };
            this.busy = this.customerService.removeUserFromBusiness(userRemoveRequest).subscribe(
                data => {
                    this.businessUsers = this.businessUsers.filter(u => u != businessUser);
                    this.notificationService.success(`User removed from business having email: ${businessUser.Email}`);
                },
                error => {
                        console.log(error);
                        this.error = error;
                }
            );
        }
        
    }

    registerExistingCustomerSpennBusiness(customerGuid){
        this.busy = this.customerService.registerExistingCustomerBusiness({CustomerGuid: customerGuid})
        .subscribe(
            data => {
                this.customerDetail.IsBusiness=true;
                var message = 'Successfully registered on spenn business customer:  '+customerGuid;
                this.notificationService.success(message, 'Successfull');

                },
                error => {
                    console.log(error);
                    this.error = error;
                }
            );
    }

    registerExistingSpennSpennBusinessCustomerToSpenn(customerGuid) {
        this.busy = this.customerService.registerExistingSpennBusinessCustomerToSpenn({ CustomerGuid: customerGuid })
            .subscribe(
                data => {
                    this.customerDetail.IsSpennUser = true;
                    var message = 'Successfully registered to Spenn:  ' + customerGuid;
                    this.notificationService.success(message, 'Successfull');

                },
                error => {
                    console.log(error);
                    this.error = error;
                }
            );
    }

    updateSpennBusinessUserPermissions(userIndex): void {
        if (this.customerDetail.IsBusiness && this.hasBusinessPermission()) {
            this.spennBusinessService.updateBusinessUserPermissions(this.businessUsers[userIndex]);
            this.busy = this.spennBusinessService.updateBusinessUserPermissions(this.businessUsers[userIndex])
                .subscribe(
                    data => {
                        this.notificationService.success('Permission groups updated', 'Successfull');
                    }, error => {
                        this.getBusinessUsers();
                        console.log(error);
                        this.error = error;
                    }
                );
        }
    }

    updateSpennBusinessPaymentApprovalRole(userGuid, isAllowedToApprovePayment) {
        if (this.customerDetail.IsBusiness && this.hasBusinessPermission()) {
            this.busy = this.spennBusinessService.updatePaymentApprovalRoleToPrinciple({
                IsAllowedToApprovePayment: isAllowedToApprovePayment,
                BusinessUserGuid: userGuid,
                BusinessCustomerGuid: this.customerGuid
            })
                .subscribe(
                    data => {
                        var statusMessage = isAllowedToApprovePayment == true ? 'added' : 'removed';
                        var message = 'Payment approval role ' + statusMessage + ' for spenn business user. ';
                        this.notificationService.success(message, 'Successfull')
                    },
                    error => {
                        this.getBusinessUsers();
                        console.log(error);
                        this.error = error;
                    }
                );
        }
    }

    getBusinessUsers() {
        if (this.customerDetail.IsBusiness && this.hasBusinessPermission()) {
            this.busy = this.spennBusinessService.getBusinessUsers(this.customerGuid).subscribe(
                data => {
                    this.businessUsers = data.Users;
                    this.businessUsers.forEach((user, index) => {
                        this.spennBusinessService.getBusinessUserPermissions(user.UserGuid).subscribe(
                            roles => {
                                this.businessUsers[index].PermissionGroups = roles;
                                PermissionGroup.SortGroups(this.businessUsers[index].PermissionGroups);
                            },
                            error => {
                                console.log(error);
                            }
                        );
                    });
                },
                error => {
                    console.log(error);
                    this.error = error;
                }
            );
        }
    }

    getKycTierList() {
        // load the KycTierList only for kyc supervisor or kycManager
        if (this.isSupervisor == true) {
            this.customerService.getKycTierList().subscribe(
                data => {
                    this.kycTierList = data;

                    // set the initial value of select KycTier
                    for (let kycTier of this.kycTierList) {
                        if (kycTier.KycTierName == this.customerDetail.KycTier) {
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
                if (data && data.length > 1) {
                    if (data[0] != null) {
                        this.PinResetRequest = data[0];
                    }
                    if (data[1] != null) {
                        this.SecurityCodeResetRequest = data[1];
                    }
                }
            },
            error => {
                console.log(error);
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

    getKyc() {
        this.showKyc = !this.showKyc;
        if (this.kycRequest) return;
        if (this.customerAnxKyc != null || this.customerThirdPartyKyc != null || this.customerNidaKyc != null)
            return;
        this.busy = this.customerService.getKycInformation(this.customerGuid).subscribe(
            data => {
                console.log(data);
                if (data != null) {
                    if (data.KycRequest != null) {
                        this.customerKycDetail = data;
                        if (this.customerKycDetail.KycDetailGuid == '00000000-0000-0000-0000-000000000000') {
                            this.customerKycDetail = null;
                        } 
                        this.kycRequest = data.KycRequest;
                    }
                    else if (data.KycType == (<number>KycType.Anx)) {
                        this.customerAnxKyc = data;
                    }
                    else if (data.KycType == (<number>KycType.NidaRwf)) {
                        this.customerNidaKyc = data;
                    }
                    else if (data.KycType == (<number>KycType.ThirdParty)) {
                        this.customerThirdPartyKyc = data;
                    }
                    else {
                        this.customerKycDetail = data;
                        this.kycRequest = data.KycRequest;
                    }
                }
            },
            error => {
                this.kycRequest = null;
                console.log(error);
            }
        );
    };
    reloadKycRequest() {

        this.busy = this.customerService.getKycInformation(this.customerGuid).subscribe(
            data => {
                if (data != null) {
                    if (data.KycRequest != null) {
                        this.kycRequest = data.KycRequest;
                    }
                }
            },
            error => {
                this.kycRequest = null;
                console.log(error);
            }
        );
    };

    showSms() {
        this.showSmsList = !this.showSmsList;
    }

    showNameChangeModal(customerData) {
        var myDialog = <any>document.getElementById(this.nameModalId);
        myDialog.showModal();
        return;
    }

    goToCustomerByRewardCode(rewardCode) {
        this.busy = this.customerService.getCustomerByRewardCode(rewardCode)
            .subscribe(
                data => {
                    this.customerSearchView = data;
                    console.log(data);
                    // this.router.navigate(['/customer-details/' + data.CustomerGuid]);
                    window.location.href = '/customer-details/' + data.CustomerGuid;
                },
                error => {
                    console.log(error);
                    this.customerSearchView = new CustomerSearchView();
                });

    }

    resetRecoveryWordsAndView() {
        this.busy = this.customerService.resetRecoveryWordsAndView({ CustomerGuid: this.customerGuid })
            .subscribe(
                data => {
                    console.log(data);
                    this.recoveryWords = data.RecoveryWords;
                },
                error => {
                    console.log(error);
                    this.error = error;
                }
            );
    }

    lockCustomer() {

        var configData: InteractionBoxData = {
            Title: "Provide a reason",
            Message: "Please specify why you want to lock this customer"
        };
        const dialogRef = this.dialog.open(FeedbackTextBoxComponent, { width: '500px', data: configData });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
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

        var configData: InteractionBoxData = {
            Title: "Provide a reason",
            Message: "Please specify why you want to unlock this customer"
        };
        const dialogRef = this.dialog.open(FeedbackTextBoxComponent, { width: '500px', data: configData });

        dialogRef.afterClosed().subscribe(result => {

            if (result) {
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

    changeIsOnlineFlag(value) {
        this.changeShopOnlineFlagJamesCommand = new ChangeShopOnlineFlagJamesCommand();
        this.changeShopOnlineFlagJamesCommand.CustomerGuid = this.customerGuid;
        this.changeShopOnlineFlagJamesCommand.IsOnline = value;
        this.busy = this.customerService.changeOnlineFlag(this.changeShopOnlineFlagJamesCommand)
            .subscribe(
                data => {
                    console.log("Changed successfully.");
                },
                error => {
                    this.customerDetail.Business.IsOnline = !this.customerDetail.Business.IsOnline;
                    console.log(error);
                    this.error = error;
                }
            );
    }

    jamesReview(isApproved, rejectionReason, rejectionReasonId) {
        var kycReviewCommand = new ReviewKycCommand();
        kycReviewCommand.IsApproved = isApproved;
        kycReviewCommand.CustomerGuid = this.customerGuid;
        kycReviewCommand.RejectionReason = rejectionReason;
        kycReviewCommand.RejectionReasonId = rejectionReasonId;

        if (!this.isSupervisor && this.isKycProcessor) {
            this.jamesProcessorVerify(isApproved, kycReviewCommand);
        }
        else {
            this.jamesSupervisorVerify(isApproved, kycReviewCommand);
        }
    }

    jamesSupervisorVerify(isApproved, kycReviewCommand) {
        this.busy = this.customerService.reviewCustomerKyc(kycReviewCommand).subscribe(data => {
            this.customerDetail.KycStatus = isApproved ? "JamesVerified" : "Unverified";
            var message = 'Customer has been ' + (isApproved ? 'approved' : 'rejected') + ' successfully.';
            this.notificationService.success(message, 'Successfull')
            this.reloadKycRequest();
            // update business data if any
            if (this.customerDetail.Business) {
                this.busy = this.customerService.getCustomerDetail(this.customerGuidOrRewardCode).subscribe(
                    data => {
                        this.customerDetail.Business = data.Business;
                    },
                    error => {
                        console.log(error);
                        this.error = error;
                    });
            }

        },
            error => {
                console.log(error);
                this.error = error;
            });
    }

    jamesProcessorVerify(isApproved, command) {

        this.busy = this.customerService.verifyJames(command).subscribe(
            data => {
                var message = 'Customer has been ' + (isApproved ? 'approved' : 'rejected') + ' successfully.';
                this.notificationService.success(message, 'Successfull');
                this.customerDetail.KycStatus = 'Approved/Reject';
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
        this.jamesReview(false, rejectionReason, rejectionReasonId);
    }

    updateKycTier(kycTier: number) {
        var savedKycTier = this.customerDetail.KycTier;
        this.customerDetail.KycTier = this.kycTierList.find(k => k.KycTierId == kycTier).KycTierName;
        this.busy = this.customerService.updateKycTier({ customerGuid: this.customerGuid, kycTierId: kycTier })
            .subscribe(
                data => {
                    console.log("KycTier updated successfully.");
                    this.notificationService.success("KycTier updated successfully");
                },
                error => {
                    this.customerDetail.KycTier = savedKycTier;
                    console.log(error);
                    this.error = error;
                }
            );
    }

    changeCustomerName(nameChange: any) {
        if (nameChange) {
            var oldVal = <PersonalDetails>nameChange.oldValue;
            var newVal = <PersonalDetails>nameChange.newValue;
            this.busy = this.customerService.changeCustomerName(newVal)
                .subscribe(success => {
                    console.log("Customer name updated successfully from " + this.customerDetail.Name + " to " + newVal.getFullName());
                    this.notificationService.success("Customer's name changed successfully");
                    this.personalDetails = newVal;
                }, error => {
                    console.log(error);
                    this.error = error;
                    this.personalDetails = oldVal;
                }, () => {
                    this.customerDetail.Name = this.personalDetails.getFullName();
                });
        }

    }

    personalDetailMapping(data: any): PersonalDetails {
        var personalDetails = new PersonalDetails();
        personalDetails.CustomerGuid = data.CustomerGuid;
        personalDetails.FirstName = data.FirstName;
        personalDetails.MiddleName = data.MiddleName;
        personalDetails.LastName = data.LastName;
        return personalDetails;
    }

    rewardModelMapping(rewardModelView: RewardModelView) {
        if (rewardModelView == null) return null;

        if (rewardModelView.IsCompleted) {
            rewardModelView.RewardModelStatus = "Completed";
            return rewardModelView;
        }

        if (rewardModelView.ChallengeCompletionDate == null) {
            if (rewardModelView.IsActive) rewardModelView.RewardModelStatus = "Needs verification";
            else rewardModelView.RewardModelStatus = "Time Expired";
            return rewardModelView;
        }

        if (rewardModelView.ChallengeCompletionDate != null && new Date(rewardModelView.ChallengeCompletionDate) < new Date()) {
            rewardModelView.RewardModelStatus = "Time Expired";
            return rewardModelView;
        }

        rewardModelView.RewardModelStatus = "Active";
        return rewardModelView;
    }

    approveBusinessPermission(kycTier: number) {
        this.busy = this.customerService.approveBusinessPermission({ customerGuid: this.customerGuid })
            .subscribe(
                data => {
                    console.log("Business permission approved successfully.");
                    this.notificationService.success("Business permission approved successfully");
                    this.customerDetail.KycTier = data.KycTier;
                    this.customerDetail.BusinessPermissionStatus = data.BusinessPermissionStatus;
                },
                error => {
                    console.log(error);
                    this.error = error;
                }
            );
    }

    trackByIdx(index: number, obj: any): any {
        return index;
    }

    onManualKycVerification(status): void {
        this.getCustomerDetails();
    }
}
