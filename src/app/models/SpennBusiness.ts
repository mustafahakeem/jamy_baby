import { map } from "rxjs/operator/map";

export class SpennBusiness {
    Name: string;
    PhoneNumber: string;
    CountryId: number;
    CurrencyId: number;
    BankId: number;
    KycTierId: number;

    public constructor() {
        this.CountryId = 0;
        this.CurrencyId = 0;
        this.BankId = 0;
        this.KycTierId = 0;
    }

    public validate() : void {
        if(this.Name == null || this.Name.trim().length === 0 || this.Name.trim().length > 100)
            throw new Error("Name should be between 1 to 100 characters");
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
    }
}

export class Bank {
    BankId: number;
    BankName: string;
    CurrencyId: number;

    public constructor(data: any = {}) {
        this.CurrencyId = data.CurrencyId || null;
        this.BankId = data.BankId || null;
        this.BankName = data.Name || null;
    }
}

export class SpennBusinessUser {
    Email: string;
    PhoneNumber: string;
    CountryId: number;
    BusinessCustomerGuid: string;
    Password: string;
    ConfirmPassword: string;
    IsAllowedToApprovePayment: boolean;
    UserGuid: string;
    PermissionGroups: PermissionGroup[];

    public constructor(data: any = {}) {
        this.Email = data['email'] || data.Email || null;
        this.PhoneNumber = data['phoneNumber'] || data.TwoFaPhoneNumber || data['twoFaPhoneNumber'] || null;
        this.BusinessCustomerGuid = null;
        this.CountryId = null;
        this.IsAllowedToApprovePayment = false;
        this.UserGuid = data['userGuid'] || data.UserGuid || null;
        this.PermissionGroups = new Array<PermissionGroup>();
    }

    public validate() : void {
        if(this.BusinessCustomerGuid == null || this.BusinessCustomerGuid.trim().length === 0)
            throw new Error("Business Customer Guid is required");
        if(this.Email == null || this.Email.trim().length === 0 || this.Email.trim().length > 100)
            throw new Error("Invalid Email address");
        if(this.CountryId === null || this.CountryId < 0)
                throw new Error("Country is required");
        if(this.PhoneNumber == null || this.PhoneNumber.trim().length === 0)
            throw new Error("Invalid 2FA phone number");
        if(this.Password == null || this.Password.length < 5 || this.Password.length > 20)
            throw new Error("Password should be between 5-20 characters");
        if(this.ConfirmPassword != this.Password)
            throw new Error("Passwords did not match. Try again.");
    }
}

export class SpennBusinessUserCommand {
    Email: string;
    PhoneNumber: string;
    CountryId: number;
    BusinessCustomerGuid: string;
    Password: string;
    UserGuid: string;
    PermissionGroupGuids: string[];

    public constructor(user: SpennBusinessUser) {
        this.Email = user.Email;
        this.PhoneNumber = user.PhoneNumber;
        this.CountryId = user.CountryId;
        this.BusinessCustomerGuid = user.BusinessCustomerGuid;
        this.Password = user.Password;
        this.UserGuid = user.UserGuid;
        this.PermissionGroupGuids = user.PermissionGroups.filter(x => x.Checked).map(x => x.PermissionGroupGuid);
    }
}

export class SpennBusinessUsers {
    Users: SpennBusinessUser[];
    public constructor(data: any = {}) {
        this.Users = new Array<SpennBusinessUser>();
        data.Users.forEach(user => {
            this.Users.push(new SpennBusinessUser(user));
        });
    }
}

export class PermissionGroup {
    GroupName: string;
    AudienceGuid: string;
    TenantId: string;
    PermissionGroupGuid: string;
    Checked: boolean;

    public constructor(data = {}) {
        this.GroupName = data['GroupName'] || '';
        this.PermissionGroupGuid = data['PermissionGroupGuid'] || '';
        this.AudienceGuid = data['AudienceGuid'] || '';
        this.TenantId = data['TenantId'] || '';
        this.Checked = data['Checked'] || false;
    }

    public static ConvertToArray(data: any): PermissionGroup[] {
        var list = new Array<PermissionGroup>();
        data.forEach(item => {
            list.push(new PermissionGroup(item));
        });
        return list;
    }

    public static ConvertToArrayWithChecked(data: any) : PermissionGroup[] {
        var list = PermissionGroup.ConvertToArray(data);
        list.forEach(item => {
            item.Checked = true;
        });
        return list;
    }

    public static MergeTwoArrays(toArray: PermissionGroup[], fromArray: PermissionGroup[]) : PermissionGroup[] {
        return PermissionGroup.ConvertToArray(
            toArray.concat(fromArray.filter((item) => toArray.find(x => x.PermissionGroupGuid == item.PermissionGroupGuid) == null))
        );
    }

    public static SortGroups(permissionGroups: PermissionGroup[]) : void {
        permissionGroups = permissionGroups.sort((x, y) => {
            if(x.GroupName < y.GroupName) {
                return -1;
            }
            else
                return 1;
        });
    }
}