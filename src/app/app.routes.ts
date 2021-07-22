import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {
  CanActivateGuard, CanActivateWithAuthenticationGuard,
  CanActivateWithAuthenticatedAndVerifiedGuard2,
  CanActivateWithAuthenticatedAndVerifiedGuard
} from './services/guard.service';

// Components
import { HomeComponent } from './pages/home/home.component';
import { PageNumComponent } from './pages/page-num/page-num.component';
import { ClientComponent } from './pages/client/client.component';
import { CustomerComponent } from './pages/customer/customer.component';
import { BusinessComponent } from './pages/business/business-register/business-register.component';
import { BusinessAddUserComponent } from './pages/business/business-add-user/business-add-user.component';
import { DepositListComponent } from "./pages/deposit/deposit-list/deposit-list.component";
import { CustomerDetailsComponent } from "./pages/customer/customer-details/customer-details.component";
import { InfoComponent } from "./pages/info/info.component";
import { LogViewerComponent } from "./pages/log-viewer/log-viewer.component";
import { KycVerificationComponent } from './pages/kyc-verification/kyc-verification.component';
import { KycCustomerDetailComponent } from './pages/kyc-verification/kyc-customer-detail/kyc-customer-detail.component';
import { AuditHistoryComponent } from './pages/audit-history/audit-history.component';
import { AccessdeniedComponent } from './pages/error/accessdenied/accessdenied.component';
import { TransactionComponent } from './pages/transaction/transaction.component';
import { FormModelConfigComponent } from './pages/kyc-cognitive-service/form-model-config/form-model-config.component';
import { JamesuserComponent } from './pages/jamesuser/jamesuser.component'
import { JamesuserDetailsComponent} from './pages/jamesuser/jamesuser-details/jamesuser-details.component'
import { LoanApplicationComponent } from './pages/loans/loan-application/loan-application.component';
import { LoanApplicationDetailsComponent } from './pages/loans/loan-application-details/loan-application-details.component';
import { AgentRegistrationComponent } from './pages/agent/agent-registration/agent-registration.component';
import { AgentComponent } from './pages/agent/agent.component';
import { AgentDetailsComponent } from './pages/agent/agent-details/agent-details.component';

const routes: Routes = [
  // Root
  {
    canActivate: [CanActivateWithAuthenticatedAndVerifiedGuard2],
    path: '',
    data: {
      allowedRoles: ['JamesBasic']
    },
    redirectTo: '/customer',
    pathMatch: 'full',
  },
  {
    canActivate: [CanActivateWithAuthenticatedAndVerifiedGuard2],
    component: HomeComponent,
    path: 'home'
  },
  {
    canActivate: [CanActivateGuard],
    component: PageNumComponent,
    path: 'page/:id'
  },
  {
    canActivate: [CanActivateGuard],
    component: ClientComponent,
    path: 'client'
  },
  {
    canActivate: [CanActivateWithAuthenticatedAndVerifiedGuard2],
    component: CustomerComponent,
    path: 'customer',
    data: {
      allowedRoles: ['SupportPersonell'],
      fallBackPath: 'home'
    }
  },
  {
    canActivate: [CanActivateWithAuthenticatedAndVerifiedGuard2],
    component: BusinessComponent,
    path: 'business-register',
    data: {
      allowedRoles: ['SpennBusinessAdministrator']
    }
  },
  {
    canActivate: [CanActivateWithAuthenticatedAndVerifiedGuard2],
    component: BusinessAddUserComponent,
    path: 'business-add-user',
    data: {
      allowedRoles: ['SpennBusinessAdministrator']
    }
  },
  {
    canActivate: [CanActivateWithAuthenticatedAndVerifiedGuard2],
    component: AgentRegistrationComponent,
    path: 'agent-registration',
    data: {
      allowedRoles: ['AgentSupervisor']
    }
  },
  {
    canActivate: [CanActivateWithAuthenticatedAndVerifiedGuard2],
    component: AgentComponent,
    path: 'agent',
    data: {
      allowedRoles: ['AgentSupervisor']
    }
  },
  {
    canActivate: [CanActivateWithAuthenticatedAndVerifiedGuard2],
    component: AgentDetailsComponent,
    path: 'agent-details/:agentNumber',
    data: {
      allowedRoles: ['AgentSupervisor']
    }
  },
  {
    canActivate: [CanActivateWithAuthenticatedAndVerifiedGuard2],
    component: KycVerificationComponent,
    path: 'customer-verification-list',
    data: {
      allowedRoles: ['KycProcessor']
    }
  },
  {
    canActivate: [CanActivateWithAuthenticatedAndVerifiedGuard2],
    component: KycCustomerDetailComponent,
    path: 'kyc-customer-detail',
    data: {
      allowedRoles: ['SupportPersonell']
    }
  },
  {
    canActivate: [CanActivateWithAuthenticatedAndVerifiedGuard2],
    component: CustomerDetailsComponent,
    data: {
      allowedRoles: ['SupportPersonell']
    },
    path: 'customer-details/:customerguidorrewardcode',
  },
  {
    canActivate: [CanActivateWithAuthenticatedAndVerifiedGuard],
    component: DepositListComponent,
    path: 'deposit-list',
    data: {
      allowedRoles: ['CashManagement', 'SupportPersonell']
    }
  },
  {
    canActivate: [CanActivateWithAuthenticationGuard],
    component: InfoComponent,
    path: 'info'
  },
  {
    canActivate: [CanActivateWithAuthenticatedAndVerifiedGuard],
    component: LogViewerComponent,
    path: 'log-viewer',
    data: {
      allowedRoles: ['JamesBasic']
    }
  },
  {
    canActivate: [CanActivateWithAuthenticatedAndVerifiedGuard],
    component: TransactionComponent,
    path: 'transaction',
    data: {
      allowedRoles: ['CashManagement']
    }
  },
  {
    canActivate: [CanActivateWithAuthenticationGuard],
    component: AccessdeniedComponent,
    path: 'accessdenied'
  },
  {
    canActivate: [CanActivateWithAuthenticatedAndVerifiedGuard],
    component: FormModelConfigComponent,
    path: 'kyc-cognitive-service/form-model-config',
    data: {
      allowedRoles: ['KycProcessor']
    }
  },
  {
    canActivate: [CanActivateWithAuthenticatedAndVerifiedGuard],
    component: JamesuserComponent,
    path: 'user',
    data: {
      allowedRoles: ['BigBoss']
    }
  },
  {
    canActivate: [CanActivateWithAuthenticatedAndVerifiedGuard],
    component: LoanApplicationComponent,
    path: 'loan-application-list',
    data: {
      allowedRoles: ['LoanProcessor']
    }
  },
  {
    canActivate: [CanActivateWithAuthenticatedAndVerifiedGuard],
    component: JamesuserDetailsComponent,
    path: 'jamesuser-details/:userguid',
    data: {
      allowedRoles: ['BigBoss']
  }
},
{
  canActivate: [CanActivateWithAuthenticatedAndVerifiedGuard],
  component: LoanApplicationDetailsComponent,
    path: 'loan-application-detail',
    data: {
      allowedRoles: ['LoanProcessor']
    }
}
];

export const routing: ModuleWithProviders = RouterModule.forRoot(routes);
