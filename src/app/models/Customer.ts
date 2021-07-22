export class Customer {
    CustomerGuid: string;
    Name: string;
    Email: string;
    Phone: string;
    CustomerType: number;
}

export class PersonalDetails {
    CustomerGuid: string;
    FirstName: string;
    MiddleName: string;
    LastName: string;

    getFullName(): string {
        var fullName = '';
        if(this.FirstName)
            fullName += this.FirstName + ' ';
        if(this.MiddleName)
            fullName += this.MiddleName + ' ';
        if(this.LastName)
            fullName += this.LastName + ' ';

        return fullName.trim();
    }

    getCopy() : PersonalDetails {
        var copy = new PersonalDetails();
        copy.CustomerGuid = this.CustomerGuid;
        copy.FirstName = this.FirstName;
        copy.MiddleName = this.MiddleName;
        copy.LastName = this.LastName;
        return copy;
    }
}

export class CustomerAccount {
    AccountId: string;
    AccountTypeId: number;
    AccountType: string;
    CurrencyId: number;
    Currency: string;
    SubAccountAddress: string;
    LastVerifiedBalance: number;
    AnxBalance: number;
}

export class AccountView {
    AccountId: string;
    AccountType: string;
    Balance: number;
}

export class RewardModelView {
    IsActive: boolean;
    IsCompleted: boolean;
    ChallengeCompletionDate: Date;
    RewardModelId: number;
    IsSpecificRewardCode: boolean;
    RewardModelStatus: string;
}

export class CustomerProfile {
    CountryId: number;
    CountryName: string;
    CurrencyId: number;
    CurrencyIsoCode: string;
    CustomerGuid: string;
    CustomerType: number;
    BankName: string;
    Email: string;
    IsVerified: boolean;
    KycStatus: string;
    LastLogin: Date;
    Name: string;
    PhoneNumber: string;
    Picture: string;
    OwnRewardCode: string;
    ReferrerRewardCode: string;
    Business: Business;
    HasKycSubmitted: boolean;
    KycTier: string;
    RewardModelViewForProfile: RewardModelView;
    BusinessPermissionStatus: string;
    IsBusiness: boolean;
    IsSpennUser: boolean;
}

export class CustomerSearchView {
    CustomerGuid: string;
    CurrencyId: number;
    CountryId: number;
    IsVerified: boolean;
    Name: string;
    PhoneNumber: string;
    CustomerType: number;
}


export class Business {
    Address: string;
    Address2: string;
    BusinessName: string;
    Phone: string;
    Latitude: number;
    Longitude: number;
    LastLogin: Date;
    BusinessCategory: BusinessCategory;
    IsPower: boolean;
    IsOnline: boolean;
}

export class BusinessCategory {
    BusinessCategoryId: number;
    Name: string;
    Picture: string;
}

export class ChangeShopOnlineFlagJamesCommand {
    CustomerGuid: string;
    IsOnline: boolean;
}

export class Sort {
    field: string;
    dir: string;
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

export class CustomerSearch extends BaseSearch {
    phone: string;
    email: string;
    name: string;
    customerGuid: string;
    rewardCode: string;
    businessName: string;

    public constructor(data: any = {}) {
        super(data);
        this.phone = data.phone || null;
        this.email = data.email || null;
        this.name = data.name || null;
        this.businessName = data.businessName || null;
    }
}

export class CustomerSearchKyc {
    countryId: number;
    isEscalated: boolean;
    customerGuid: string;
    rewardCode: string;
    page: number;
    pageSize: number;
    sort: any[];

    public constructor(data: any = {}) {
        this.countryId = data.countryId || null;
        this.isEscalated = data.isEscalated || false;
        this.page = data.page || 1;
        this.pageSize = data.pageSize || 10;
        this.sort = data.sort || [];
    }

    public getString(): string {
        return this.customerGuid + this.countryId + this.page + this.sort.concat(x => x.field);
    }
}

export class AuditHistorySearch extends BaseSearch {
    actionByUserGuid: number;
    customerGuid: string;

    public constructor(data: any = {}) {
        super(data)
        this.actionByUserGuid = data.actionByUserGuid || null;
        this.customerGuid = data.customerGuid || null;
    }

    public getString(): string {
        return this.customerGuid + this.actionByUserGuid + this.page + this.sort.concat(x => x.field);
    }
}

export class AccountHistoryQueryRequest {
    accountGuid: string;
    page: number;
    pageSize: number;
    sort: any[];

    public constructor(data: any = {}) {
        this.accountGuid = data.accountGuid || null;
        this.page = data.page || 1;
        this.pageSize = data.pageSize || 10;
        this.sort = data.sort || [];
    }
}

export class SmsQueryRequest {
    CustomerGuid: string;
    page: number;
    pageSize: number;
}


export class BasicKycInformationView {
    CustomerGuid: string;
    DateOfBirth: Date;
    KycDetailGuid: string;
    Occupation: string;
    Gender: string;
    IdNumber: string;
    KycType: number;
    CreateDate: Date;
}

export class KycDocumentsView {
    IdCardOrPassport: string;
    IdCardOrPassportSas: string;
    SelfieWithIdPaper: string;
    SelfieWithIdPas: string;
    UploadProofOfAddress: string;
    UploadProofOfAddressSas: string;
}

export class AnxKyc extends BasicKycInformationView {

    Name: string;
    AddressLine1: string;
    AddressLine2: string;
    City: string;
    PhoneNumber: string;
    Zip: string;
    KycStatus: string;
    KycDocuments: KycDocumentsView;
}

export class NidaKyc extends BasicKycInformationView {
    ApplicationNumber: string;
    Cell: string;
    CivilStatus: string;
    DateOfExpiry: Date;
    DateOfIssue: Date;
    District: string;
    DocumentNumber: string;
    DocumentType: string;
    FatherNames: string;
    ForeName: string;
    Id: string;
    IssueNumber: string;
    MotherNames: string;
    Nationality: string;
    PlaceOfBirth: string;
    PlaceOfIssue: string;
    Province: string;
    Sector: string;
    Spouse: string;
    Status: string;
    Surnames: string;
    TimeSubmitted: Date;
    Village: string;
}

export class ThirdPartyKyc extends BasicKycInformationView {
    Citizenship: string;
    Clan: string;
    Passport_Number: string;
    Date_of_Birth_from_passport: Date;
    Date_of_Death: Date;
    Date_of_expiry: Date;
    Date_of_Issue: Date;
    Ethnic_Group: string;
    Family: string;
    First_Name: string;
    Surname: string;
    Other_Name: string;
    IdType: string;
    Fingerprint: string;
    FingerprintSas: string;
    Photo: string;
    PhotoSas: string;
    Photo_from_Passport: string;
    Photo_from_PassportSas: string;
    Signature: string;
    SignatureSas: string;
    Place_of_Birth: string;
    Place_of_Death: string;
    Place_of_Live: string;
    RegOffice: string;
    Serial_Number: string;
}

export class KycDetail extends BasicKycInformationView {
    Citizenship: string;
    Clan: string;
    FirstName: string;
    Surname: string;
    OtherName: string;
    LastName: string;
    ForeNames: string;
    MiddleName: string;
    FatherNames: string;
    MotherNames: string;
    EthnicGroup: string;
    Family: string;
    SerialNumber: string;
    PassportNumber: string;

    DateOfBirthFromPassport: Date;
    DateOfDeath: Date;
    DateOfExpiry: Date;
    DateOfIssue: Date;

    PlaceOfBirth: string;
    PlaceOfLive: string;
    //PlaceOfDeath: string;
    IdType: string;
    Nationality: string;
    Status: string;
    RegOffice: string;
    ApplicationNumber: string;
    BiometricResult: string;
    Cell: string;
    CivilStatus: string;
    IsVerified: string;
    IssueNumber: string;
    Pin: string;
    PlaceOfIssue: string;
    PostalAddress: string;
    Postcode: string;
    Province: string;
    ResidentialAddressDistrict: string;
    ResidentialAddressRegion: string;
    ResidentialAddressStreet: string;
    ResidentialAddressVillage: string;
    ResidentialAddressWard: string;
    Sector: string;
    Village: string;
    VillageId: string;

    Fingerprint: string;
    FingerprintSas: string;
    Photo: string;
    PhotoSas: string;
    PhotoFromPassport: string;
    PhotoFromPassportSas: string;
    Signature: string;
    SignatureSas: string;
}

export enum KycType {
    Anx = 1,
    ThirdParty = 2,
    NidaRwf = 3,
    NidaTnz = 4
}

export class KycRequest {
    AddressLine1: string;
    AddressLine2: string;
    City: string;
    Country: string;
    CountryId: string;
    DateOfBirth: string;
    Gender: string;
    IdCardOrPassport: string;
    IdCardOrPassportSas: string;
    IdNumber: string;
    IdType: number
    IdValidFrom: string;
    IdValidTo: string;
    Nationality: string;
    Occupation: string;
    ProofOfAddress: string;
    ProofOfAddressSas: string;
    SelfieWithIdPaper: string;
    SelfieWithIdPaperSas: string;
    Zip: string;
}

export class ReviewKycCommand {
    CustomerGuid: string;
    IsApproved: boolean;
    RejectionReason: string;
    RejectionReasonId: number;
}

export class ManualKycCommand {
    CustomerGuid: string;
    IsApproved: boolean;
    Reason: string;
}

export class KycRequestResponseView{
    CreateDate: Date;    
    KycProcessingStatus: string;
    JamesProcessingStatus : string;
}

export class KycSwapImageCommand {
    KycRequestGuid : string;
    PropertyName1 : string;
    PropertyName2 : string;
}

export class PasswordResetRequest {
    CustomerPasswordResetApprovalId : number;
    CustomerPasswordResetApprovalGuid : string;
    CustomerId : number;
    CustomerPasswordResetTypeId : number;
    CustomerPasswordResetStatus:number;
}

export class AdditionalKycFileView {
    FileName: string;
    Description: string;
    UploadedBy: string;
    UploadedDate: string;
    FileUrl: string;
    KycDocumentType: string;
}

export class AdditionalKycFileCommand {
    CustomerGuid: string;
    Description: string;
    UploadedBy: string;
    file: File;
    KycDocumentTypeId: number;
}

export class KycDocumentType {
    KycDocumentTypeId: number;
    KycDocumentTypeName: string;
    CustomerTypeId: number;
}