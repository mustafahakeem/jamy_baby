// external module
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule, Http, XHRBackend, RequestOptions } from '@angular/http';
import { RouterModule } from '@angular/router';
import { AngularFireModule } from '@angular/fire';
import { ToasterModule } from 'angular2-toaster/angular2-toaster';
import { environment } from '../environments/environment';
import { TranslateModule, TranslateLoader, TranslateStaticLoader } from 'ng2-translate';
import { NgBusyModule } from 'ng-busy';
import {HttpClientModule} from '@angular/common/http';
import { MatDialogModule, MatButtonModule } from '@angular/material';
import { UiSwitchModule } from 'ngx-toggle-switch';

export function createTranslateLoader( http: Http ) {
    return new TranslateStaticLoader( http, '../public/assets/i18n', '.json' );
}

let modules = [
    // AlertModule,
    // DatepickerModule,
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpModule,
    RouterModule,
    AngularFireModule.initializeApp( environment.firebase ),
    TranslateModule.forRoot({
        deps: [Http],
        provide: TranslateLoader,
        useFactory: (createTranslateLoader)
    }),
    ToasterModule,
    DataTableModuleExtended,
    NgBusyModule,
    HttpClientModule,
    AngularFireModule,
    AngularFireDatabaseModule,
    MatDialogModule,
    MatButtonModule, 
    UiSwitchModule
];

import { AppComponent } from './app.component';

import { AppHeaderComponent } from './widgets/app-header';
import { AppFooterComponent } from './widgets/app-footer';
import { MenuAsideComponent } from './widgets/menu-aside';
import { MessagesBoxComponent } from './widgets/messages-box';
import { NotificationBoxComponent } from './widgets/notification-box';
import { TasksBoxComponent } from './widgets/tasks-box';
import { UserBoxComponent } from './widgets/user-box';
import { BreadcrumbComponent } from './widgets/breadcrumb';
import { GenericGridComponent } from './widgets/generic-grid/generic-grid.component';
import { CustomerAccountListComponent } from './widgets/customer-account-list/customer-account-list.component';
import { YesNoBoxComponent } from './widgets/user-interactions/yes-no-box/yes-no-box.component';
import { FeedbackTextBoxComponent } from './widgets/user-interactions/feedback-text-box/feedback-text-box.component';


let widgets = [
    AppComponent,
    BreadcrumbComponent,
    AppHeaderComponent,
    AppFooterComponent,
    MenuAsideComponent,
    MessagesBoxComponent,
    NotificationBoxComponent,
    TasksBoxComponent,
    UserBoxComponent,
    GenericGridComponent,
    ImageModalComponent,
    YesNoBoxComponent,
    FeedbackTextBoxComponent
];

import { UserService } from './services/user.service';
import { MessagesService } from './services/messages.service';
import { AuthService } from './services/auth.service';
import { Screen } from './services/Screen';
import { CanActivateGuard, CanActivateWithAuthenticationGuard,
    CanActivateWithAuthenticatedAndVerifiedGuard,
    CanActivateWithAuthenticatedAndVerifiedGuard2} from './services/guard.service';
import { NotificationService } from './services/notification.service';
import { BreadcrumbService } from './services/breadcrumb.service';
import { AdminLTETranslateService } from './services/translate.service';
import { LoggerService } from './services/logger.service';
import {JamesuserService} from './dal/jamesuser.service'




// let HttpClientFactory = function(backend: XHRBackend,
//                            defaultOptions: RequestOptions,
//                            authService: AuthService,
//                            notificationService : NotificationService){
//     return new HttpClient(backend, defaultOptions, authService, notificationService);
// };

let services = [
    UserService,
    Screen,
    BreadcrumbService,
    MessagesService,
    AuthService,
    CanActivateGuard,
   // HttpClient,
    CanActivateWithAuthenticationGuard,
    CanActivateWithAuthenticatedAndVerifiedGuard,
    CanActivateWithAuthenticatedAndVerifiedGuard2,
    NotificationService,
    AdminLTETranslateService,
    LoggerService,
    HttpClient,
    LookupService
    // {
    //     provide: HttpClient, useFactory: HttpClientFactory(),
    //     deps: [XHRBackend, RequestOptions, AuthService, NotificationService]
    // }
];

import { HomeComponent } from './pages/home/home.component';
import { PageNumComponent } from './pages/page-num/page-num.component';
import { ClientComponent } from './pages/client/client.component';
import { CustomerComponent } from './pages/customer/customer.component';
import { BusinessComponent } from './pages/business/business-register/business-register.component';
import { BusinessAddUserComponent } from './pages/business/business-add-user/business-add-user.component';
import { DepositListComponent } from './pages/deposit/deposit-list/deposit-list.component';
import { CustomerDetailsComponent } from './pages/customer/customer-details/customer-details.component';
import { TransactionListComponent } from './pages/transaction-list/transaction-list.component';
import { TransactionComponent } from './pages/transaction/transaction.component';
import { LogViewerComponent } from './pages/log-viewer/log-viewer.component';

let pages = [
    HomeComponent,
    PageNumComponent,
    ClientComponent,
    CustomerComponent,
    BusinessComponent,
    BusinessAddUserComponent,
    DepositListComponent,
    CustomerDetailsComponent,
    TransactionListComponent,
    LogViewerComponent,
    TransactionComponent,
    AgentComponent,
    AgentRegistrationComponent,
    AgentDetailsComponent
];

// main bootstrap
import { routing } from './app.routes';
import { HttpClient } from "./services/HttpClient";
import { InfoComponent } from './pages/info/info.component';
import {HTTP_INTERCEPTORS} from "@angular/common/http";
import {HeaderInterceptor} from "./services/header.interceptor";
import { DataGridComponent } from './widgets/data-grid/data-grid.component';
import { SmsListComponent } from './pages/sms-list/sms-list.component';
import { KycVerificationComponent } from './pages/kyc-verification/kyc-verification.component';
import { LookupService } from './dal/lookup.service';
import { KycCustomerDetailComponent } from './pages/kyc-verification/kyc-customer-detail/kyc-customer-detail.component';
import { CustomerKycInfoComponent } from './widgets/customer-kyc-info/customer-kyc-info.component';
import { SessionStorageService } from './services/sessionStorage.service';
import { ImageModalComponent } from './widgets/image-modal/image-modal.component';
import { RejectionReasonModalComponent } from './widgets/rejection-modal/rejection-reason-modal.component';
import { KycRequestComponent } from './widgets/kyc-request/kyc-request.component';
import { StaticDataService } from './services/static.data.service';
import { AuditHistoryComponent } from './pages/audit-history/audit-history.component';
import { AuditHistoryService } from './dal/audit-history.service';
import { MoneyFormatter } from './pipes/money-formatter';
import { MoneyFormatterService } from './services/moneyFormatter.service';
import { AccessdeniedComponent } from './pages/error/accessdenied/accessdenied.component';
import { HideIfUnauthorizedDirective } from './directives/hide-if-unauthorized.directive';
import { DataTableModuleExtended } from './widgets/data-grid/data-table-customized/CustomDataTableModule';
import { AngularFireDatabase, AngularFireDatabaseModule } from '@angular/fire/database';
import { RelocationConfirmationModalComponent } from './widgets/relocation-confirmation-modal/relocation-confirmation-modal.component';
import { FormModelConfigComponent } from './pages/kyc-cognitive-service/form-model-config/form-model-config.component';
import { FormModelListComponent } from './pages/kyc-cognitive-service/form-model-list/form-model-list.component';
import { TransactionInfoComponent } from './widgets/transaction-info/transaction-info.component';
import { JamesuserComponent } from './pages/jamesuser/jamesuser.component';
import { JamesuserDetailsComponent } from './pages/jamesuser/jamesuser-details/jamesuser-details.component';
import { SendSmsComponent } from './widgets/send-sms/send-sms.component';
import { ManualKycModalComponent } from './widgets/manual-kyc/manual-kyc-modal.component';
import { CustomerLoanListComponent } from './widgets/customer-loan-list/customer-loan-list.component';
import { CustomerLoanDetailsModalComponent } from './widgets/customer-loan-list/customer-loan-details-modal/customer-loan-details-modal.component';
import { LendingService } from './dal/lending.service';
import { LoanApplicationComponent } from './pages/loans/loan-application/loan-application.component';
import { LoanApplicationDetailsComponent } from './pages/loans/loan-application-details/loan-application-details.component';
import { CustomerNameChangeComponent } from './widgets/customer-name-change/customer-name-change-component';
import { BulkUnverifyComponent } from './widgets/bulk-unverify/bulk-unverify.component';
import {KycRequestResponseComponent} from './widgets/kyc-request-response/kyc-request-response.component'
import {KycEscalateComponent} from './widgets/kyc-escalate/kyc-escalate.component';
import { AdditionalKycFileComponent } from './widgets/additional-kyc-file/additional-kyc-file.component';
import { AgentRegistrationComponent } from './pages/agent/agent-registration/agent-registration.component';
import { AgentService } from './dal/agent.service';
import { AgentComponent } from './pages/agent/agent.component';
import { AgentDetailsComponent } from './pages/agent/agent-details/agent-details.component';

@NgModule( {
    bootstrap: [AppComponent],
    declarations: [
        ...pages,
        ...widgets,
        MoneyFormatter,
        InfoComponent,
        DataGridComponent,
        SmsListComponent,
        KycVerificationComponent,
        KycCustomerDetailComponent,
        CustomerAccountListComponent,
        CustomerKycInfoComponent,
        ImageModalComponent,
        RejectionReasonModalComponent,
        KycRequestComponent,
        AuditHistoryComponent,
        AccessdeniedComponent,
        HideIfUnauthorizedDirective,
        RelocationConfirmationModalComponent,
        FormModelConfigComponent,
        FormModelListComponent,
        TransactionInfoComponent,
        JamesuserComponent,
        JamesuserDetailsComponent,
        SendSmsComponent,
        KycRequestResponseComponent,
        ManualKycModalComponent,
        CustomerLoanListComponent,
        CustomerLoanDetailsModalComponent,
        CustomerNameChangeComponent,
        LoanApplicationComponent,
        LoanApplicationDetailsComponent,
        BulkUnverifyComponent,
        KycEscalateComponent,
        AdditionalKycFileComponent
    ],
    imports: [
        ...modules,
        routing
    ],
    providers: [
        UserService,
        Screen,
        BreadcrumbService,
        MessagesService,
        LookupService,
        AuthService,
        CanActivateGuard,
        // HttpClient,
        CanActivateWithAuthenticationGuard,
        CanActivateWithAuthenticatedAndVerifiedGuard,
        CanActivateWithAuthenticatedAndVerifiedGuard2,
        NotificationService,
        AdminLTETranslateService,
        LoggerService,
        {
            provide: HTTP_INTERCEPTORS,
            useClass: HeaderInterceptor,
            multi: true
        },
        // HttpClient
        {
            provide: HttpClient,
            useFactory: HttpClientFactory,
            deps: [XHRBackend, RequestOptions, AuthService, NotificationService]
        },
        SessionStorageService,
        StaticDataService,
        AuditHistoryService,
        MoneyFormatter,
        MoneyFormatterService,
        JamesuserService,
        LendingService,
        AgentService
    ],
    entryComponents: [ 
        YesNoBoxComponent, FeedbackTextBoxComponent
    ]
})
export class AppModule { }


export function HttpClientFactory() {
    return function(backend: XHRBackend,
                    defaultOptions: RequestOptions,
                    authService: AuthService,
                    notificationService : NotificationService){
        return new HttpClient(backend, defaultOptions, authService, notificationService);
    }
}