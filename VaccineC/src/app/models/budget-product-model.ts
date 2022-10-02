export class BudgetProductModel {
    public id!: string;
    public budgetId!: string;
    public productId!: string;
    public borrowerPersonId!: string;
    public productDose: string = '';
    public details!: string;
    public estimatedSalesValue!: number;
    public situationProduct: string = '';
    public register!: Date;
    public userId!: string;
}
