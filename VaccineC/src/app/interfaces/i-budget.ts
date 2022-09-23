export interface IBudget {
  Id: string,
  UserId: string,
  FinancialPersonId: string,
  Situation: string,
  budgetNumber: number,
  discountPercentage: number,
  discountValue: number,
  totalBudgetAmount: number,
  totalBudgetedAmount: number,
  expirationDate: Date,
  approvalDate: Date,
  details: string,
  register: Date
}
