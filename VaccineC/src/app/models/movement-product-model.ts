export class MovementProductModel {
    public id!: string;
    public movementId!: string;
    public productId: string = '';
    public batch: string = '';
    public unitsNumber!: number;
    public unitaryValue!: number;
    public amount!: number;
    public batchManufacturingDate!: Date | null;
    public batchExpirationDate!: Date | null;
    public manufacturer: string = '';
}
