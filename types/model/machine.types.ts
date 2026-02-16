export interface IMachine {
  _id: string;
  mcName: string;
  mcCode: string;
  mcModel: string;
  mcSetCode: string;
  ipAddress: string;
  allowPosIp: string;
}

export interface IMachineData {
  id: string;
  shopId: string;
  name: string;
  code: string;
  model: string;
  serialNumber: string;
  setCode: string;
  ipAddress?: string;
  allowPosIp?: string;
  collectionCapacity?: number;
  collectionCurrentInventory?: number;
  createdAt?: string;
}
