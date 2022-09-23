export class BudgetModel {
  public id!: string;
  public personId: string = '';
  public userId: string = '';
  public expirationDate!: Date;
  public details: string = '';
}
