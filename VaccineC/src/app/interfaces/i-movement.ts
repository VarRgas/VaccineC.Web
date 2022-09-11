export interface IMovement {
    ID: string,
    MovementNumber: number,
    UsersId: string,
    MovementType: string,
    Amount: number,
    Discount: number,
    ProductsAmount: number,
    Register: Date,
    Situation: string
}