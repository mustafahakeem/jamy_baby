import { CustomerSearchView } from "./Customer";

export class DepositView{
    amount: number;
    customerName: string;
    customerReference: string;
    depositDate: string;
    transactionDate: string;
    message: string;
}

export class TransactionType{
    name: string;
    transactionTypeId: number;
}

export class Deposit{
    amount: number;
    currencyId: number;
    rewardCode: string;
    depositDate: string;
    managementWalletGuid: string;
    message: string;
    customerGuid: string
}



export class DepositSearch {
    managementWalletGuid: string;
    fromDate: string;
    toDate: string;
    page: number;
    pageSize: number;

    public constructor(data: any = {}) {
        this.managementWalletGuid = data.managementWalletGuid || null;
        this.fromDate = data.fromDate || null;
        this.toDate = data.toDate || Date.now();
        this.page = data.page || 1;
        this.pageSize = data.pageSize || 10;
    }
}

export class Currency{
    CurrencyId: number;
    Ccy: string;
    Name: string;
    IsoCode: string;
    public constructor(data: any = {}) {
        this.CurrencyId = data.CurrencyId || null;
        this.Ccy = data.Ccy || null;
        this.Name = data.Name || null;
        this.IsoCode = data.IsoCode || null;
    }
}

export class Country{
    CountryId: number;
    PhoneCode: string;
    Name: string;
    IsoCode: string;
    DefaultCurrencyId: number;
    public constructor(data: any = {}) {
        this.CountryId = data.CountryId || null;
        this.PhoneCode = data.PhoneCode || null;
        this.Name = data.Name || null;
        this.IsoCode = data.IsoCode || null;
        this.DefaultCurrencyId = data.DefaultCurrencyId || null;
    }
}

export class Wallet{
    Name: string;
    ManagementWalletGuid: string;
    WalletTypeId: number;
    CustomerGuid: string;
    CurrencyId: number;
    public constructor(data: any = {}) {
        this.ManagementWalletGuid = data.ManagementWalletGuid || null;
        this.Name = data.Name || null;
    }
}

export class WalletShortView{
    Name: string;
    ManagementWalletGuid: string;
    WalletTypeId: number;
    public constructor(data: any = {}){
        this.ManagementWalletGuid = data.ManagementWalletGuid || null;
        this.Name = data.Name || null;
    }
}

export class FinanceRelocationReceiver{
    IsCustomerAllowed: boolean;
    IsWalletAllowed: boolean;
    ReceiverManagementWallets: WalletShortView[];
}

export class FinanceRelocationLookupResult {
    CurrencyId: string;
    SenderWallets : WalletShortView[];
    Receiver: FinanceRelocationReceiver=new FinanceRelocationReceiver();
}

export class FinanceRelocationLookupCommand{
    amount: number;
    transactionTypeId: number;
    currencyId: number;
}

export class FinanceRelocation extends FinanceRelocationLookupCommand {
    amount: number;
    message: string;
    senderManagementWalletGuid: string;
    receiverManagementWalletGuid: string;
    receiverCustomerGuid: string;
    depositDate: string;
} 

export class FinanceRelocationConfirmationData {
  senderWallet: WalletShortView;
  receiverWallet: WalletShortView;
  receiverCustomer: CustomerSearchView;
  transactionType: TransactionType;
  receiverName: string;
  receiverCustomerPhoneNumber: string;
  currency: Currency;
  public constructor() {
    this.senderWallet = new WalletShortView();
    this.receiverWallet = new WalletShortView();
    this.receiverCustomer = new CustomerSearchView();
    this.transactionType = new TransactionType();
    this.currency = new Currency();
    this.receiverName = null;
  }
}
