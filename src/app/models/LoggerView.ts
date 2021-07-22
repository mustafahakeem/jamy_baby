export class LoggerView {
    public Id: number;
    public Date: string;
    public Exception: string;
    public Level: string;
    public Logger: string;
    public MachineName: string;
    public Message: string;
    public StackTrace: string;
    public Thread: string;
    public UserName: string;
    public WorkItem: number;
    public Status: number;
}

export class LogViewerQueryRequest{
    fromDate: string;
    toDate: string;
    audience: number;
    page: number;
    pageSize: number;
    sort: any[];
    keywords: string;

    public constructor(data: any = {}) {
        this.fromDate = data.fromDate || null;
        this.toDate = data.toDate || null;
        this.audience = data.audience || 1;
        this.page = data.page || 1;
        this.pageSize = data.pageSize || 10;
        this.sort = data.sort || [];
        this.keywords = data.keywords || '';
    }
}

export class Server{
    id: number;
    name: string;
}

