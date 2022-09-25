export class BudgetNegotiationModel {
    public id!: string;
    public budgetId: string = '';
    public paymentFormId: string = '';
    public totalAmountBalance!: number;
    public totalAmountTraded!: number;
    public installments!: number;
    public register!: Date;
}
