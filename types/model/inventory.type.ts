export interface InventoryType {
    denom: string;
    stackerMin: number;
    refillPoint: number;
}

export interface DenomType {
    reqId: string;
    denominations: InventoryType;
}