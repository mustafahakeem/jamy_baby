export class Agent {
    FirstName: string;
    MiddleName: string;
    LastName: string;
    AgentName: string;
    PhoneNumber: string;
    CountryId: number;
    CurrencyId: number;
    BankId: number;
    KycTierId: number;
    AgentGroupId: number;
    Address: string;

    public constructor() {
        this.CountryId = 0;
        this.CurrencyId = 0;
        this.BankId = 0;
        this.KycTierId = 0;
        this.AgentGroupId = null;
    }

    public validate() : void {
        if(this.AgentName == null || this.AgentName.trim().length === 0 || this.AgentName.trim().length > 100)
            throw new Error("AgentName should be between 1 to 100 characters");
        if(this.FirstName == null || this.FirstName.trim().length === 0 || this.FirstName.trim().length > 100)
            throw new Error("FirstName should be between 1 to 100 characters");
        if(this.MiddleName != null && this.MiddleName.trim().length > 100)
            throw new Error("MiddleName should be less than 100 characters");
        if(this.LastName == null || this.LastName.trim().length === 0 || this.LastName.trim().length > 100)
            throw new Error("LastName should be between 1 to 100 characters");
        if(this.PhoneNumber == null || this.PhoneNumber.trim().length === 0)
            throw new Error("Invalid phone number");
        if(this.CountryId === null || this.CountryId < 1)
            throw new Error("Country is required");
        if(this.CurrencyId === null || this.CurrencyId < 1)
            throw new Error("Currency is required");
        if(this.BankId === null || this.BankId < 1)
            throw new Error("Bank is required");
        if(this.KycTierId === null || this.KycTierId < 1)
            throw new Error("KycTier is required");
        if(this.Address != null && this.Address.trim().length > 200)
            throw new Error("Address should be less than 200 characters");
    }
}

export class BaseSearch {
    page: number;
    pageSize: number;
    sort: any[];

    /**
     *common properties of search 
     */
    constructor(data: any = {}) {
        this.page = data.page || 1;
        this.pageSize = data.pageSize || 10;
        this.sort = data.sort || [];
    }
}

export class AgentSearch extends BaseSearch {
    agentNumber: number;
    agentName: string;
    phone: string;

    public constructor(data: any = {}) {
        super(data);
        this.agentNumber = data.agentNumber || 0;
        this.agentName = data.agentName || null;
        this.phone = data.phone || null;
    }
}

export class AgentSearchView {
    AgentNumber: number;
    AgentName: string;
    Phone: string;
    CurrencyId: number;
    CustomerGuid: string;

    public constructor(data: any = {}) {
        this.AgentName = data.agentName || null;
        this.AgentNumber = data.agentNumber || 0;
        this.Phone = data.phone || null;
        this.CustomerGuid = data.customerGuid || null;
        this.CurrencyId = data.currencyId || null;
    }
}

export class AgentProfile {
    CountryId: number;
    CountryName: string;
    CurrencyId: number;
    CurrencyIsoCode: string;
    CustomerGuid: string;
    BankName: string;
    KycStatus: string;
    CreateDate: Date;
    LastLogin: Date;
    Name: string;
    PhoneNumber: string;
    Picture: string;
    OwnRewardCode: string;
    KycTier: string;
    Address: string;
    AgentGroupName: string;
    IsOnlineOnMap: boolean;
}