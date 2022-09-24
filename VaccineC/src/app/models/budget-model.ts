export class BudgetModel {
  public id!: string;
  public personId: string = '';
  public userId: string = '';
  public situation: string = '';
  public totalBudgetAmount!: number;
  public discountPercentage!: number;
  public discountValue!: number;
  public expirationDate!: Date;
  public approvalDate!: Date;
  public details: string = '';
  public register!: Date;
  public budgetNumber!: number;
  public totalBudgetedAmount!: number;
}
