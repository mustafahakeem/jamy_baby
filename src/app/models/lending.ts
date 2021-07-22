export class LoanApplicationQueryRequest {
    page: number;
    pageSize: number;
    sort: any[];

    public constructor(data: any = {}) {
        this.page = data.page || 1;
        this.pageSize = data.pageSize || 10;
        this.sort = data.sort || [];
    }
}


export class CustomerLoanQueryRequest {
    customerGuid: string;
    page: number;
    pageSize: number;
    sort: any[];

    public constructor(data: any = {}) {
        this.customerGuid = data.customerGuid || null;
        this.page = data.page || 1;
        this.pageSize = data.pageSize || 10;
        this.sort = data.sort || [];
    }
}

export class LoanApplicationCommand {
    LoanApplicationGuid: string;
    CustomerGuid:string;

    public constructor(data: any = {}) {
        this.LoanApplicationGuid = data.loanApplicationGuid || null;
        this.CustomerGuid = data.customerGuid || null;
    }
}
