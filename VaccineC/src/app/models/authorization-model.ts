import { EventModel } from "./event-model";

export class AuthorizationModel {
    public ID!: string;
    public AuthorizationNumber!: number;
    public UserId!: string;
    public AuthorizationDate!: Date;
    public Register!: Date;
    public BorrowerPersonId!: string;
    public Situation!: string;
    public TypeOfService!: string;
    public Notify!: string;
    public EventId!: string;
    public BudgetProductId!: string;
    public Event!: EventModel;
    public PersonPhone!: string;
}
