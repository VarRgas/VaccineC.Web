export class PersonAddressModel {
    public id!: string;
    public personId: string = '';
    public addressType: string = '';
    public publicPlace: string = '';
    public district: string = '';
    public addressNumber: string = '';
    public complement: string = '';
    public addressCode: string = '';
    public referencePoint!: string;
    public city: string = '';
    public state: string = '';
    public country: string = '';
}
