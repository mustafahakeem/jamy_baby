export class User {
    public firstname: string;
    public lastname: string;
    public email: string;
    public avatarUrl: string;
    public creationDate: string;
    public preferredLang: string;

    public constructor(data: any = {}) {
        this.firstname = data.firstname || '';
        this.lastname = data.lastname || '';
        this.email = data.email || '';
        this.avatarUrl = data.avatarUrl || '';
        this.creationDate = data.creation_date || Date.now();
        this.preferredLang = data.preferredLang || null;
    }

    public getName() {
        return this.firstname + ' ' + this.lastname;
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

export class UserSearch extends BaseSearch {
    email: string;
    name: string;
    userGuid: string;
    permissionGroupGuid: string;

    public constructor(data: any = {}) {
        super(data);
        this.email = data.email || null;
        this.name = data.name || null;
        this.permissionGroupGuid = data.permissionGroupGuid || null;
    }
}

export class UserPermissionDto {
    FirstName: string;
    Id: string;
    LastName: string;
    UserName: string;
}

export class PermissionGroupView {
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

    public static ConvertToArray(data: any): PermissionGroupView[] {
        var list = new Array<PermissionGroupView>();
        data.forEach(item => {
            list.push(new PermissionGroupView(item));
        });
        return list;
    }

    public static ConvertToArrayWithChecked(data: any): PermissionGroupView[] {
        var list = PermissionGroupView.ConvertToArray(data);
        list.forEach(item => {
            item.Checked = true;
        });
        return list;
    }

    public static MergeTwoArrays(toArray: PermissionGroupView[], fromArray: PermissionGroupView[]): PermissionGroupView[] {
        return PermissionGroupView.ConvertToArray(
            toArray.concat(fromArray.filter((item) => toArray.find(x => x.PermissionGroupGuid == item.PermissionGroupGuid) == null))
        );
    }

    public static SortGroups(permissionGroups: PermissionGroupView[]): void {
        permissionGroups = permissionGroups.sort((x, y) => {
            if (x.GroupName < y.GroupName) {
                return -1;
            }
            else
                return 1;
        });
    }
}

export class UserDetailView {
    PermissionGroupViews: PermissionGroupView[];
    UserPermissionDto: UserPermissionDto;
}
