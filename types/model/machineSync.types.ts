
interface ICassettesDetails {
    denomination: number;
    qty: number;
}

// Interface for recycle module details
export interface IMachineRecycleModule {
    denomination: number;
    capacity: number;
    refillPoint: number;
    currentInventory: number;
}

// Interface for collection cassette details
export interface IMachineCollectionCassette {
    capacity: number;
    currentInventory: number;
    details: ICassettesDetails[]; // Added details field to match schema
}

// Interface representing the main Machine model
export interface IMachineSyne {
    _id: string;
    mcName: string; // Machine name
    mcCode: string; // Machine code
    mcModel: string; // Machine model
    serialNumber: string;
    ipAddress?: string; // Made optional to match the schema
    allowPosIp?: string; // Made optional to match the schema
    mcSetCode: string; // Added to match the schema
    shop: any; // Updated to handle populated object
    organization: any; // Updated to handle populated object
    recycleModules: IMachineRecycleModule[];
    collectionCassette: IMachineCollectionCassette;
    createdAt: Date;
    updatedAt: Date;
}
export interface IMachineDocument extends Document, Omit<IMachineSyne, "_id"> {
    _id: string;
}