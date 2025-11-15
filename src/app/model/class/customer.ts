export class Customer {
    "id": number;
    "createDate": Date;
    "lastModified": Date;
    "organizationType": number;
    "organizationLegalName": string;
    "organizationDisplayName": string;
    "contactPerson": string;
    "address01": string;
    "address02": string;
    "city": string;
    "postalCode": string;
    "phone": string;
    "extension": string;
    "email": string;
    "fax": string;
    "note": string;
    "active": boolean;

    constructor() {
        this.id = 0;
        this.createDate = new Date();
        this.lastModified = new Date();
        this.organizationType = 0;
        this.organizationLegalName = "";
        this.organizationDisplayName = "";
        this.contactPerson = "";
        this.address01 = "";
        this.address02 = "";
        this.city = "";
        this.postalCode = "";
        this.phone = "";
        this.extension = "";
        this.email = "";
        this.fax = "";
        this.note = "";
        this.active = true;
    }


}