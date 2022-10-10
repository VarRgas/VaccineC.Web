export interface IAuthorization {
    ID: string;
    AuthorizationNumber: number;
    UserId: string;
    AuthorizationDate: Date;
    Register: Date;
    BorrowerPersonId: string;
    Situation: string;
    TypeOfService: string;
    Notify: string;
    EventId: string;
    BudgetProductId: string;
}
