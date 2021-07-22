import DateTimeFormat = Intl.DateTimeFormat;
/**
 * Created by Anupam on 1/16/2017.
 */
export class Token {
    public accessToken: string;
    public refreshToken: string;
    public tokenType: string;
    public expiresIn: string;
    public clientId: string;
    public audience: string;
    public issued: DateTimeFormat;
    public expires: DateTimeFormat;
    public permissionGroups: string[];

    public constructor( data: any = {}) {
        this.accessToken = data.access_token || '';
        this.refreshToken = data.refresh_token || '';
        this.tokenType = data.token_type || '';
        this.expiresIn = data.expires_in || '';
        this.clientId = data.clientId || '';
        this.audience = data.audience || '';
        this.issued = data['issued'] || null;
        this.expires = data['.expires'] || null;
    }

}