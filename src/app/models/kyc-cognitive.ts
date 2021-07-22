export class FormRecognizerModelInfo {
    CountryId: number;
    CountryName: string;
    IdCard: number;
    IdCardName: string;
    ModelId: string;
    updatedOn: Date;

    public validate(): void {
        if (this.CountryId == null || this.CountryId < 1)
            throw new Error("Country is required");
        if (this.IdCard == null || this.IdCard < 1)
            throw new Error("IdCard is required");
        if (this.ModelId == null || this.ModelId.trim().length === 0)
            throw new Error("ModelId is required");

    }
}

export class KycIdCard {
    Name: string;
    Value: number;
}

export class KycModelSearch {
    CountryId: number;
    page: number;
    pageSize: number;
}
