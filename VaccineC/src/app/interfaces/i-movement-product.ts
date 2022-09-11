export interface IMovementProduct {
    ID: string,
    MovementsId: string,
    ProductsId: string,
    Batch: string,
    UnitsNumber: number,
    UnitaryValue: number,
    Amount: number,
    Details: string,
    Register: Date,
    BatchManufacturingDate: Date,
    BatchExpirationDate: Date,
    Manufacturer: string
}